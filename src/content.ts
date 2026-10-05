import config from "./gallery-config.json" with { type: "json" };
import generatedGallery from "./generated/gallery.json" with { type: "json" };

export type CharacterId = keyof typeof config.characters;
export type PhotoVariant = { src: string; width: number; height: number };
export type Photo = {
  id: string;
  alt: string;
  caption?: string;
  position?: string;
  variants: PhotoVariant[];
};
export type GalleryPhoto = Photo & { characterId: CharacterId };
export type Character = {
  id: CharacterId;
  name: string;
  caption: string;
  photo?: Photo;
};

// Optional editorial details; adding a photo never requires an entry here.
export const photoDetails: Record<
  string,
  { alt?: string; caption?: string; position?: string }
> = {
  "rapunzel/rapunzel-jardin": {
    alt: "Rapunzel entre árboles, con su larga trenza decorada con flores",
  },
  "ariel/ariel-retrato": {
    alt: "Retrato de Ariel sonriendo con su vestuario azul",
    position: "center 20%",
  },
  "huntrix/huntrix-poses": {
    alt: "Las animadoras de Huntrix interpretando una pose del grupo",
    position: "center 20%",
  },
  "cenicienta/cenicienta-fiesta": {
    alt: "Cenicienta con su vestido azul en una decoración de cuento",
  },
  "blancanieves/blancanieves-jardin": {
    alt: "Blancanieves sentada junto a las flores del jardín",
  },
  "rapunzel/detalle-rapunzel": {
    alt: "Detalles del vestido, la trenza y los accesorios de Rapunzel",
  },
  "ariel/ariel": {
    alt: "Ariel con su vestido azul junto a un muro de piedra",
  },
  "blancanieves/blancanieves": {
    alt: "Blancanieves sentada entre la hierba y las flores",
  },
  "rapunzel/rapunzel": {
    alt: "Rapunzel con su trenza de flores junto a un árbol",
  },
  "rapunzel/rapunzel-portada": {
    alt: "Rapunzel con su vestido lila y su larga trenza",
  },
  "cenicienta/cenicienta": {
    alt: "Cenicienta con su vestido azul de princesa",
  },
  "cenicienta/cenicienta-retrato": {
    alt: "Retrato de Cenicienta sonriendo con sus guantes y vestido azul",
  },
  "huntrix/huntrix": {
    alt: "Las tres animadoras de Huntrix con su vestuario de colores al aire libre",
  },
  "moana/moana": {
    alt: "Moana con una flor en el cabello junto a una vidriera de colores",
  },
};
export const gallery: GalleryPhoto[] = generatedGallery.map((photo) => {
  if (!(photo.characterId in config.characters))
    throw new Error("Personaje desconocido: " + photo.characterId);
  const characterId = photo.characterId as CharacterId;
  return {
    ...photo,
    characterId,
    alt: "Animadora caracterizada como " + config.characters[characterId].name,
    ...photoDetails[photo.id],
  };
});
export function getPhoto(id: string): GalleryPhoto {
  const photo = gallery.find((item) => item.id === id);
  if (!photo)
    throw new Error(
      "No existe la foto " +
        id +
        ". Ejecuta npm run gallery:prepare y revisa src/gallery-config.json.",
    );
  return photo;
}
export function largestVariant(photo: Photo): PhotoVariant {
  return photo.variants[photo.variants.length - 1];
}
export const developmentCredit = {
  label: "Desarrollado por",
  name: "JD3M0N",
  url: "https://github.com/JD3M0N",
};
export const business = {
  name: "Pide un Deseo",
  handle: "@pideundeseo.cuba",
  phone: "5353893363",
  displayPhone: "+53 53893363",
  instagram: "https://www.instagram.com/pideundeseo.cuba/",
  facebook: "https://www.facebook.com/share/19L1iYkqMb/",
  location: "La Habana, Cuba",
  base: "La Habana Vieja",
};
export const characters: Character[] = Object.entries(config.characters).map(
  ([id, value]) => {
    const characterId = id as CharacterId;
    const cover =
      "cover" in value ? getPhoto(characterId + "/" + value.cover) : undefined;
    return {
      id: characterId,
      name: value.name,
      caption: value.caption,
      photo: cover,
    };
  },
);
export const presentation = Object.fromEntries(
  Object.entries(config.presentation).map(([name, id]) => [name, getPhoto(id)]),
) as Record<keyof typeof config.presentation, GalleryPhoto>;
export const services = [
  {
    name: "Animación de 1 hora",
    duration: "1 hora",
    title: "Un encuentro mágico",
    description:
      "Su personaje favorito llega a la fiesta para compartir canciones, juegos y mucha ilusión.",
    featured: false,
  },
  {
    name: "Animación de 3 horas",
    duration: "3 horas",
    title: "Más tiempo para soñar",
    description:
      "Tres horas para disfrutar de la compañía del personaje y vivir juntos la celebración.",
    featured: true,
  },
];
export const included = [
  "Interacción con los invitados",
  "Show y canciones del personaje",
  "Juegos y canciones con los niños",
  "Cantar felicidades junto al pastel",
  "Participación en la piñata",
  "Carta temática del personaje",
  "Oportunidades ilimitadas para tomar fotos",
];
export const events = [
  {
    title: "Día de princesas",
    text: "Un encuentro temático para compartir un momento de cuento.",
    icon: "crown" as const,
  },
  {
    title: "Show de las Huntrix",
    text: "Música, personajes y toda la energía de las Guerreras K-POP.",
    icon: "music" as const,
  },
  {
    title: "Fechas especiales",
    text: "Celebraciones estacionales, días festivos y fechas para recordar.",
    icon: "sparkle" as const,
  },
];
export function getCharacterPhotos(character: Character): GalleryPhoto[] {
  const photos = gallery.filter((photo) => photo.characterId === character.id);
  const cover = photos.find((photo) => photo.id === character.photo?.id);
  return cover
    ? [cover, ...photos.filter((photo) => photo.id !== cover.id)]
    : photos;
}
export const values = [
  {
    title: "Personajes que cobran vida",
    text: "Cuidamos la caracterización, los gestos y las canciones para recrear la esencia de cada personaje.",
    icon: "crown" as const,
  },
  {
    title: "Conexión de verdad",
    text: "Nos encanta interactuar con los niños y hacerlos parte de cada momento de la celebración.",
    icon: "heart" as const,
  },
  {
    title: "Cada detalle cuenta",
    text: "Vestuario de alta calidad, profesionalidad y pasión por lo que hacemos.",
    icon: "sparkle" as const,
  },
];
export const faqs = [
  {
    question: "¿Con cuánto tiempo debo contactar?",
    answer:
      "Recomendamos escribirnos con un mes de anticipación para tener más posibilidades de encontrar disponible la fecha que deseas. Si tu fiesta es antes, consúltanos igualmente: confirmamos la disponibilidad por WhatsApp.",
  },
  {
    question: "¿En qué zonas trabajan?",
    answer:
      "Tenemos nuestra sede en La Habana Vieja y nos trasladamos dentro de La Habana. Cuéntanos dónde será tu celebración al escribirnos.",
  },
  {
    question: "¿Cuánto dura la animación?",
    answer:
      "Tenemos dos modalidades de animación: 1 hora y 3 horas. Por WhatsApp podemos ayudarte a coordinar el personaje y el servicio para tu celebración.",
  },
  {
    question: "¿Cómo funciona los combos de personajes?",
    answer:
      "Para el servicio de 3 horas y dependencia de la temática, cuando se solicitan personajes de una misma franquicia puede obtener hasta un 15% de descuento. Consulta los detalles de los combos por WhatsApp.",
  },
  {
    question: "¿Cómo puedo asistir a un evento especial?",
    answer:
      "Organizamos encuentros con diferentes temáticas como ""Un día de princesas"", shows de las Huntrix y celebraciones de temporada, para grupos de entre 25 y 35 niños. Consulta las próximas fechas y la disponibilidad por WhatsApp o en nuestras redes.",
  },
  {
    question: "¿La consulta deja mi fecha reservada?",
    answer:
      "No. Al pulsar el botón se abre una conversación de WhatsApp para que consultes y coordines con nuestro equipo. La disponibilidad y la reserva se confirman directamente con nosotras.",
  },
];
export const steps = [
  {
    title: "Imagina su sorpresa",
    text: "Elige el personaje y la experiencia que le harían más ilusión.",
  },
  {
    title: "Cuéntanos tu idea",
    text: "Escríbenos por WhatsApp con la fecha y el lugar de la celebración.",
  },
  {
    title: "Preparemos la magia",
    text: "Confirmamos disponibilidad y coordinamos contigo los detalles.",
  },
];
