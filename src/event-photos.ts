import type { Photo } from "./content";

type EventPhoto = Pick<Photo, "id" | "alt" | "caption"> & { src: string };

const images = import.meta.glob<string>(
  "../Eventos/*.{avif,jpg,jpeg,png,webp}",
  { eager: true, query: "?url", import: "default" },
);

export const eventPhotos: readonly EventPhoto[] = Object.entries(images)
  .sort(([first], [second]) => first.localeCompare(second, "es"))
  .map(([path, src]) => {
    const caption = path
      .split("/")
      .pop()!
      .replace(/\.[^.]+$/, "")
      .replace(/[-_]+/g, " ");
    return {
      id: path,
      src,
      alt: `Imagen del próximo evento: ${caption}`,
      caption,
    };
  });