import { S3Client } from "@aws-sdk/client-s3";

export function getS3Bucket(): string {
  const bucket = process.env.S3_BUCKET?.trim();
  if (!bucket) throw new Error("S3_BUCKET no está configurado");
  return bucket;
}

export const s3 = new S3Client({
  region: process.env.AWS_REGION ?? "us-east-1",
});
