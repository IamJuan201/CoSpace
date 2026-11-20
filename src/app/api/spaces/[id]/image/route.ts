import {
  GetObjectCommand,
  HeadObjectCommand,
  S3ServiceException,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getS3Bucket, s3 } from "@/lib/s3";
import type { IdRouteContext } from "@/lib/http";

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: IdRouteContext): Promise<NextResponse> {
  const { id } = await params;
  const space = await prisma.space.findFirst({
    where: { id, isActive: true },
    select: { imageUrl: true },
  });
  if (!space?.imageUrl?.startsWith("s3://")) return new NextResponse(null, { status: 404 });

  const bucket = getS3Bucket();
  const storedReference = space.imageUrl.slice("s3://".length);
  const separator = storedReference.indexOf("/");
  if (separator < 0 || storedReference.slice(0, separator) !== bucket) {
    return new NextResponse(null, { status: 404 });
  }

  const sourceKey = storedReference.slice(separator + 1);
  if (!sourceKey.startsWith("incoming/")) return new NextResponse(null, { status: 404 });

  let imageKey = sourceKey;
  const relativePath = sourceKey.slice("incoming/".length);
  const extensionIndex = relativePath.lastIndexOf(".");
  const basename = extensionIndex > relativePath.lastIndexOf("/")
    ? relativePath.slice(0, extensionIndex)
    : relativePath;
  const thumbnailKey = `thumbnails/${basename}.webp`;

  try {
    await s3.send(new HeadObjectCommand({ Bucket: bucket, Key: thumbnailKey }));
    imageKey = thumbnailKey;
  } catch (error) {
    if (!(error instanceof S3ServiceException) || error.name !== "NotFound") {
      console.warn("No se pudo consultar la miniatura S3; se usará el original", error);
    }
  }

  const url = await getSignedUrl(
    s3,
    new GetObjectCommand({ Bucket: bucket, Key: imageKey }),
    { expiresIn: 300 },
  );
  return NextResponse.redirect(url, {
    status: 302,
    headers: { "Cache-Control": "private, no-store" },
  });
}
