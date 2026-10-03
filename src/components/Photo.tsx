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
  return (
    <img
      className={className}
      src={`/images/${photo.id}-800.webp`}
      srcSet={`/images/${photo.id}-320.webp 320w, /images/${photo.id}-480.webp 480w, /images/${photo.id}-800.webp 800w, /images/${photo.id}-1200.webp 1200w`}
      sizes={sizes}
      alt={photo.alt}
      width="800"
      height="1000"
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      style={photo.position ? { objectPosition: photo.position } : undefined}
    />
  );
}
