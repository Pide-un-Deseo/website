import { useEffect, useRef, useState } from "react";
import { gallery } from "../content";
import { Photo } from "./Photo";
import { Icon } from "./Icon";

export function Gallery() {
  const [selected, setSelected] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLAnchorElement | null>(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || selected === null) return;
    if (!dialog.open) dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      openerRef.current?.focus();
    };
  }, [selected]);
  const photo = selected === null ? undefined : gallery[selected];
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
        <div className="gallery-grid">
          {gallery.map((item, index) => (
            <a
              key={item.id}
              className={`gallery-item gallery-item-${index}`}
              href={`/images/${item.id}-1200.webp`}
              aria-label={`Ampliar foto: ${item.alt}`}
              onClick={(event) => {
                event.preventDefault();
                openerRef.current = event.currentTarget;
                setSelected(index);
              }}
            >
              <Photo photo={item} sizes="(max-width: 600px) 50vw, 33vw" />
              <span className="gallery-zoom">
                <Icon name="plus" />
              </span>
            </a>
          ))}
        </div>
      </div>
      <dialog
        ref={dialogRef}
        className="lightbox"
        aria-label="Fotografía ampliada"
        onKeyDown={(event) => {
          if (event.key === "Tab") {
            event.preventDefault();
            event.currentTarget
              .querySelector<HTMLButtonElement>("button")
              ?.focus();
          }
        }}
        onCancel={(event) => {
          event.preventDefault();
          setSelected(null);
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) setSelected(null);
        }}
      >
        {photo && (
          <div className="lightbox-content">
            <button
              className="lightbox-close"
              autoFocus
              onClick={() => setSelected(null)}
              aria-label="Cerrar fotografía"
            >
              <Icon name="close" />
            </button>
            <img src={`/images/${photo.id}-1200.webp`} alt={photo.alt} />
            <p>{photo.alt}</p>
          </div>
        )}
      </dialog>
    </section>
  );
}
