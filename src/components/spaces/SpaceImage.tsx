import type { ReactElement } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface SpaceImageProps {
  src: string | null;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
}

export default function SpaceImage({
  src,
  alt,
  sizes,
  className = "",
  priority = false,
}: SpaceImageProps): ReactElement {
  const t = useTranslations("Spaces");

  return (
    <div className={`relative overflow-hidden bg-zinc-200 ${className}`}>
      {src ? (
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      ) : (
        <span className="absolute inset-0 flex items-center justify-center text-sm text-zinc-500">
          {t("noImage")}
        </span>
      )}
    </div>
  );
}