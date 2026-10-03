import { useEffect, useRef, type RefObject } from "react";
import type { Photo } from "../content";
import { Icon } from "./Icon";
import { largestVariant } from "../content";

type LightboxProps = {
  photos: readonly Photo[];
  title?: string;
  selected: number | null;
  onSelect: (index: number | null) => void;
  openerRef: RefObject<HTMLAnchorElement | null>;
};

export function Lightbox({
  photos,
  title,
  selected,
  onSelect,
  openerRef,
}: LightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const photo = selected === null ? undefined : photos[selected];
  const source = photo ? largestVariant(photo) : undefined;
  const isOpen = Boolean(photo);
  // Changing photos must not close the dialog or restore the opener's focus.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !isOpen) return;
    const opener = openerRef.current;
    dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      opener?.focus();
    };
  }, [isOpen, openerRef]);

  const movePhoto = (direction: number) => {
    if (selected !== null)
      onSelect(Math.max(0, Math.min(photos.length - 1, selected + direction)));
  };
  return (
    <dialog
      ref={dialogRef}
      className="lightbox"
      aria-label={title ?? "Fotografía ampliada"}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          movePhoto(event.key === "ArrowLeft" ? -1 : 1);
        }
        if (event.key === "Tab") {
          const buttons = Array.from(
            event.currentTarget.querySelectorAll<HTMLButtonElement>(
              "button:not(:disabled)",
            ),
          );
          const first = buttons[0];
          const last = buttons[buttons.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last?.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first?.focus();
          }
        }
      }}
      onCancel={(event) => {
        event.preventDefault();
        onSelect(null);
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onSelect(null);
      }}
    >
      {photo && (
        <div className="lightbox-content">
          <button
            type="button"
            className="lightbox-close"
            autoFocus
            onClick={() => onSelect(null)}
            aria-label="Cerrar fotografía"
          >
            <Icon name="close" />
          </button>
          {title && <h2 className="lightbox-title">{title}</h2>}
          <img
            src={source?.src}
            alt={photo.alt}
            width={source?.width}
            height={source?.height}
          />
          {photo.caption && <p>{photo.caption}</p>}
          <div className="lightbox-navigation">
            {photos.length > 1 && (
              <button
                type="button"
                className="gallery-control"
                aria-label="Foto anterior"
                aria-disabled={selected === 0}
                onClick={() => movePhoto(-1)}
              >
                <Icon name="arrow" className="arrow-previous" />
              </button>
            )}
            <span role="status" aria-live="polite" aria-atomic="true">
              Foto {(selected ?? 0) + 1} de {photos.length}
            </span>
            {photos.length > 1 && (
              <button
                type="button"
                className="gallery-control"
                aria-label="Foto siguiente"
                aria-disabled={selected === photos.length - 1}
                onClick={() => movePhoto(1)}
              >
                <Icon name="arrow" />
              </button>
            )}
          </div>
        </div>
      )}
    </dialog>
  );
}
