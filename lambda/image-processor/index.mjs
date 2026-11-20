import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import sharp from "sharp";

const s3 = new S3Client({});
const INPUT_PREFIX = "incoming/";
const OUTPUT_PREFIX = "thumbnails/";
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const ALLOWED_CONTENT_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

function thumbnailKey(inputKey) {
  const relativeKey = inputKey.slice(INPUT_PREFIX.length);
  const extensionIndex = relativeKey.lastIndexOf(".");
  const basename = extensionIndex > relativeKey.lastIndexOf("/")
    ? relativeKey.slice(0, extensionIndex)
    : relativeKey;

  return `${OUTPUT_PREFIX}${basename}.webp`;
}

export async function handler(event) {
  const results = [];

  for (const record of event.Records ?? []) {
    const bucket = record.s3.bucket.name;
    const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, " "));

    // The bucket notification should also filter on incoming/; this guard
    // prevents accidental processing of the generated thumbnails.
    if (!key.startsWith(INPUT_PREFIX)) {
      console.info("Skipping object outside the input prefix", { bucket, key });
      continue;
    }

    const source = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
    if (!source.Body) throw new Error(`S3 returned an empty object: ${key}`);

    if (!ALLOWED_CONTENT_TYPES.has(source.ContentType ?? "")) {
      console.warn("Skipping unsupported image type", {
        bucket,
        key,
        contentType: source.ContentType,
      });
      continue;
    }

    if ((source.ContentLength ?? 0) > MAX_IMAGE_BYTES) {
      console.warn("Skipping image larger than 10 MiB", { bucket, key });
      continue;
    }

    const original = Buffer.from(await source.Body.transformToByteArray());
    const thumbnail = await sharp(original, { limitInputPixels: 40_000_000 })
      .rotate()
      .resize({ width: 1200, height: 900, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();

    const outputKey = thumbnailKey(key);
    await s3.send(new PutObjectCommand({
      Bucket: bucket,
      Key: outputKey,
      Body: thumbnail,
      ContentType: "image/webp",
      CacheControl: "private, max-age=3600",
    }));

    results.push({ bucket, inputKey: key, outputKey, bytes: thumbnail.length });
  }

  return { processed: results.length, results };
}
