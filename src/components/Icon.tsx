export type IconName =
  | "arrow"
  | "whatsapp"
  | "instagram"
  | "facebook"
  | "sparkle"
  | "heart"
  | "crown"
  | "music"
  | "pin"
  | "plus"
  | "close"
  | "menu"
  | "check";
const paths: Record<IconName, string> = {
  arrow: "M5 12h14M12 5l7 7-7 7",
  whatsapp:
    "M20.5 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20l1.2-4.7A8.5 8.5 0 1 1 20.5 11.5ZM8.2 7.5c-.5.4-.7 1.2-.4 2 .8 2.6 2.6 4.4 5.2 5.2.8.3 1.6.1 2-.4l.8-1.2-2.4-1.2-.9.9a7.2 7.2 0 0 1-2.7-2.7l.9-.9-1.2-2.4-1.3.7Z",
  instagram:
    "M8 3h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5ZM16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM17.5 6.5h.01",
  facebook:
    "M14 21v-8h3l.5-4H14V7c0-1 .4-2 2-2h2V2h-3c-3.5 0-5 2-5 5v2H7v4h3v8",
  sparkle: "m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5L12 2Z",
  heart:
    "M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z",
  crown: "M3 6l4.5 4L12 3l4.5 7L21 6l-2 12H5L3 6ZM6 21h12",
  music:
    "M9 18V5l12-2v13M9 8l12-2M9 18a3 3 0 1 1-3-3c1.7 0 3 1.3 3 3ZM21 16a3 3 0 1 1-3-3c1.7 0 3 1.3 3 3Z",
  pin: "M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0ZM15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z",
  plus: "M12 5v14M5 12h14",
  close: "m6 6 12 12M6 18 18 6",
  menu: "M4 7h16M4 12h16M4 17h16",
  check: "m5 12 4 4L19 6",
};
export function Icon({
  name,
  className = "",
}: {
  name: IconName;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      className={`icon ${className}`}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={paths[name]} />
    </svg>
  );
}
