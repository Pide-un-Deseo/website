export type Photo = { id: string; alt: string; position?: string };
export type Character = { name: string; caption: string; photo?: Photo };
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
export const characters: Character[] = [
  {
    name: "Huntrix",
    caption: "Una celebración con ritmo propio",
    photo: {
      id: "huntrix",
      alt: "Las tres animadoras de Huntrix con su vestuario de colores",
    },
  },
  {
    name: "Cenicienta",
    caption: "La magia de un cuento",
    photo: {
      id: "cenicienta",
      alt: "Nuestra Cenicienta con su vestido azul de princesa",
    },
  },
  {
    name: "Rapunzel",
    caption: "Una aventura llena de ilusión",
    photo: {
      id: "rapunzel",
      alt: "Rapunzel con su trenza de flores y vestido lila",
    },
  },
  {
    name: "Ariel",
    caption: "Un mundo por descubrir",
    photo: {
      id: "ariel",
      alt: "Nuestra Ariel con su cabello rojo y vestido azul",
    },
  },
  {
    name: "Moana",
    caption: "El espíritu de la aventura",
    photo: { id: "moana", alt: "Nuestra animadora caracterizada como Moana" },
  },
  {
    name: "Blancanieves",
    caption: "La dulzura de los clásicos",
    photo: {
      id: "blancanieves",
      alt: "Blancanieves con su vestido amarillo en un jardín",
    },
  },
  { name: "Elsa", caption: "Una invitada llena de magia" },
  { name: "Anna", caption: "Alegría para compartir" },
  { name: "Barbie", caption: "Una celebración a todo color" },
  { name: "Bella", caption: "Un encuentro de cuento" },
];
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
  "Show y canciones del personaje",
  "Juegos y canciones con los niños",
  "Felicitaciones y participación en la piñata",
  "Interacción con los invitados",
  "Diploma del personaje",
  "Fotografías para recordar",
];
export const events = [
  {
    title: "Spa de princesas",
    text: "Un encuentro temático para compartir un momento de cuento.",
    icon: "crown" as const,
  },
  {
    title: "Show de Huntrix",
    text: "Música, personajes y toda la energía de nuestras Huntrix.",
    icon: "music" as const,
  },
  {
    title: "Fechas especiales",
    text: "Halloween, celebraciones de temporada y fechas para recordar.",
    icon: "sparkle" as const,
  },
];
export const gallery: Photo[] = [
  {
    id: "rapunzel-jardin",
    alt: "Rapunzel entre árboles, con su larga trenza decorada con flores",
  },
  {
    id: "ariel-retrato",
    position: "center 20%",
    alt: "Retrato de Ariel sonriendo con su vestuario azul",
  },
  {
    id: "huntrix-poses",
    position: "center 20%",
    alt: "Las animadoras de Huntrix interpretando una pose del grupo",
  },
  {
    id: "cenicienta-fiesta",
    alt: "Cenicienta con su vestido azul en una decoración de cuento",
  },
  {
    id: "blancanieves-jardin",
    alt: "Blancanieves sentada junto a las flores del jardín",
  },
  {
    id: "detalle-rapunzel",
    alt: "Detalles del vestido, la trenza y los accesorios de Rapunzel",
  },
  { id: "ariel", alt: "Ariel con su vestido azul junto a un muro de piedra" },
  {
    id: "blancanieves",
    alt: "Blancanieves sentada entre la hierba y las flores",
  },
  { id: "rapunzel", alt: "Rapunzel con su trenza de flores junto a un árbol" },
  {
    id: "rapunzel-portada",
    alt: "Rapunzel con su vestido lila y su larga trenza",
  },
  { id: "cenicienta", alt: "Cenicienta con su vestido azul de princesa" },
  {
    id: "cenicienta-retrato",
    alt: "Retrato de Cenicienta sonriendo con sus guantes y vestido azul",
  },
  {
    id: "huntrix",
    alt: "Las tres animadoras de Huntrix con su vestuario de colores al aire libre",
  },
  {
    id: "moana",
    alt: "Moana con una flor en el cabello junto a una vidriera de colores",
  },
];
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
    question: "¿Cómo funciona la entrega de regalos?",
    answer:
      "La familia compra el regalo y coordina con nosotras su entrega. La princesa se encarga de llevar la sorpresa al destinatario. Consulta los detalles y la disponibilidad por WhatsApp.",
  },
  {
    question: "¿Cómo puedo asistir a un evento especial?",
    answer:
      "Organizamos encuentros como spa de princesas, shows de Huntrix y celebraciones de temporada, para grupos de entre 25 y 35 niños. Consulta las próximas fechas y la disponibilidad por WhatsApp o en nuestras redes.",
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
