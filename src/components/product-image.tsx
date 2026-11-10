import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

/** next/image wrapper: SVG artwork is served as-is, uploaded photos are optimised (AVIF/WebP). */
export function ProductImage({ src, alt, className, ...rest }: Omit<ImageProps, "src"> & { src: string }) {
  return <Image src={src} alt={alt} className={cn("object-cover", className)} unoptimized={src.endsWith(".svg")} {...rest} />;
}
