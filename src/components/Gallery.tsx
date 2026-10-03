import { useEffect, useRef, useState } from "react";
import { gallery } from "../content";
import { Photo } from "./Photo";
import { Icon } from "./Icon";
import { Lightbox } from "./Lightbox";

export function Gallery() {
  const [selected, setSelected] = useState<number | null>(null);
  const [controls, setControls] = useState({
    ready: false,
    start: true,
    end: false,
  });
  const trackRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const update = () =>
      setControls({
        ready: true,
        start: track.scrollLeft <= 2,
        end: track.scrollLeft + track.clientWidth >= track.scrollWidth - 2,
      });
    update();
    track.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(track);
    return () => {
      track.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, []);

  const moveTrack = (direction: number) => {
    const track = trackRef.current;
    if (!track) return;
    const items = Array.from(track.children) as HTMLElement[];
    const positions = items.map(
      (item) =>
        item.getBoundingClientRect().left -
        track.getBoundingClientRect().left +
        track.scrollLeft -
        parseFloat(getComputedStyle(track).paddingLeft),
    );
    const target =
      direction > 0
        ? positions.find((position) => position > track.scrollLeft + 2)
        : positions
            .slice()
            .reverse()
            .find((position) => position < track.scrollLeft - 2);
    track.scrollTo({
      left: target ?? (direction > 0 ? track.scrollWidth : 0),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  };
  if (!gallery.length) return null;

  return (
    <section
      className="section gallery-section"
      id="galeria"
      aria-labelledby="gallery-title"
    >
      <div className="container">
        <div className="section-heading heading-inline">
          <div>
            <p className="eyebrow">
              <span /> Instantes de ilusión
            </p>
            <h2 id="gallery-title">
              La magia se ve.
              <br />
              <em>Y se siente.</em>
            </h2>
          </div>
          <p>
            Un vistazo a nuestros personajes,
            <br className="desktop-break" /> sus detalles y el cariño que
            ponemos en cada uno.
          </p>
        </div>
        <div className="gallery-toolbar">
          <p>{gallery.length} fotografías · Desliza para descubrirlas</p>
          {gallery.length > 1 && controls.ready && (
            <div
              className="gallery-navigation"
              aria-label="Controles de la galería"
            >
              <button
                type="button"
                className="gallery-control"
                aria-label="Ver fotos anteriores"
                aria-controls="gallery-track"
                disabled={controls.start}
                onClick={() => moveTrack(-1)}
              >
                <Icon name="arrow" className="arrow-previous" />
              </button>
              <button
                type="button"
                className="gallery-control"
                aria-label="Ver fotos siguientes"
                aria-controls="gallery-track"
                disabled={controls.end}
                onClick={() => moveTrack(1)}
              >
                <Icon name="arrow" />
              </button>
            </div>
          )}
        </div>
        <div
          className="gallery-track"
          id="gallery-track"
          ref={trackRef}
          role="region"
          aria-label="Fotografías de nuestros personajes"
          tabIndex={0}
        >
          {gallery.map((item, index) => (
            <a
              key={item.id}
              className="gallery-item"
              href={`/images/${item.id}-1200.webp`}
              aria-label={`Ampliar foto: ${item.alt}`}
              onClick={(event) => {
                event.preventDefault();
                openerRef.current = event.currentTarget;
                setSelected(index);
              }}
            >
              <Photo
                photo={item}
                sizes="(max-width: 600px) 80vw, (max-width: 1000px) 45vw, 33vw"
              />
              <span className="gallery-zoom">
                <Icon name="plus" />
              </span>
            </a>
          ))}
        </div>
      </div>
      <Lightbox
        photos={gallery}
        selected={selected}
        onSelect={setSelected}
        openerRef={openerRef}
      />
    </section>
  );
}
