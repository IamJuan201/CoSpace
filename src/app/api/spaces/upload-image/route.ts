import { randomUUID } from "node:crypto";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";
import { authenticate, errorResponse } from "@/lib/http";
import { getS3Bucket, s3 } from "@/lib/s3";

export const runtime = "nodejs";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const IMAGE_TYPES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
} as const;

export async function POST(request: NextRequest): Promise<NextResponse> {
  const auth = authenticate(request, "ADMIN");
  if (!auth.ok) return auth.response;

  const form = await request.formData().catch(() => null);
  const file = form?.get("image");
  if (!(file instanceof File)) return errorResponse("Selecciona una imagen", 400);
  if (file.size === 0 || file.size > MAX_IMAGE_SIZE) {
    return errorResponse("La imagen debe pesar como máximo 5 MB", 400);
  }

  const extension = IMAGE_TYPES[file.type as keyof typeof IMAGE_TYPES];
  if (!extension) return errorResponse("Usa una imagen JPG, PNG o WebP", 400);

  try {
    const bucket = getS3Bucket();
    const key = `incoming/${randomUUID()}.${extension}`;
    await s3.send(new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: Buffer.from(await file.arrayBuffer()),
      ContentType: file.type,
      CacheControl: "private, max-age=3600",
    }));

    return NextResponse.json({ imageUrl: `s3://${bucket}/${key}` }, { status: 201 });
  } catch (error) {
    console.error("No se pudo guardar la imagen en S3", error);
    return errorResponse("No se pudo subir la imagen. Revisa la configuración de S3", 500);
  }
}
