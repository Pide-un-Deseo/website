import { business } from "../content";
export function whatsappUrl(subject?: string): string {
  const message = subject
    ? `¡Hola, Pide un Deseo! Me gustaría consultar disponibilidad para ${subject}. ¿Podemos coordinar los detalles?`
    : "¡Hola, Pide un Deseo! Me gustaría conocer sus servicios y consultar disponibilidad para una celebración en La Habana.";
  return `https://wa.me/${business.phone}?text=${encodeURIComponent(message)}`;
}
