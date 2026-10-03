import type { Photo as PhotoData } from "../content";
export function Photo({
  photo,
  className = "",
  priority = false,
  sizes = "(max-width: 600px) 50vw, 25vw",
}: {
  photo: PhotoData;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  const source =
    photo.variants.find((variant) => variant.width >= 800) ??
    photo.variants[photo.variants.length - 1];
  return (
    <img
      className={className}
      src={source.src}
      srcSet={photo.variants
        .map((variant) => `${variant.src} ${variant.width}w`)
        .join(", ")}
      sizes={sizes}
      alt={photo.alt}
      width={source.width}
      height={source.height}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      style={photo.position ? { objectPosition: photo.position } : undefined}
    />
  );
}
