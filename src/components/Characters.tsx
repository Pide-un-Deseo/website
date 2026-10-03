import { useRef, useState, type MouseEvent } from "react";
import { characters, getCharacterPhotos, type Character } from "../content";
import { whatsappUrl } from "../lib/whatsapp";
import { Photo } from "./Photo";
import { Icon } from "./Icon";
import { Lightbox } from "./Lightbox";

export function Characters() {
  const [active, setActive] = useState<Character | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const openerRef = useRef<HTMLAnchorElement | null>(null);
  const open = (event: MouseEvent<HTMLAnchorElement>, character: Character) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)
      return;
    event.preventDefault();
    openerRef.current = event.currentTarget;
    setActive(character);
    setSelected(0);
  };
  return (
    <section
      className="section characters-section"
      id="personajes"
      aria-labelledby="characters-title"
    >
      <div className="container">
        <div className="section-heading centered">
          <p className="eyebrow">
            <span /> Invitados muy especiales
          </p>
          <h2 id="characters-title">
            ¿Con quién sueña
            <br />
            <em>celebrar?</em>
          </h2>
          <p>
            Un encuentro con ese personaje que tanto le gusta.
            <br />
            Elige su favorito y empecemos a imaginar la sorpresa.
          </p>
        </div>
        <div className="character-grid">
          {characters.map((character) => {
            const photos = getCharacterPhotos(character);
            const cover = photos[0];
            return (
              <article className="character-card" key={character.id}>
                {cover ? (
                  <a
                    className="character-photo character-gallery-link"
                    href={`/images/${cover.id}-1200.webp`}
                    aria-label={`Ver fotos de ${character.name}`}
                    onClick={(event) => open(event, character)}
                  >
                    <Photo
                      photo={character.photo ?? cover}
                      sizes="(max-width: 600px) 46vw, (max-width: 1000px) 30vw, 18vw"
                    />
                    <span className="character-photo-count">
                      Ver fotos · {photos.length}
                    </span>
                  </a>
                ) : (
                  <div className="character-photo">
                    <div className="character-photo-blank" aria-hidden="true" />
                  </div>
                )}
                <div className="character-info">
                  <h3>
                    {cover ? (
                      <a
                        className="character-name-link"
                        href={`/images/${cover.id}-1200.webp`}
                        onClick={(event) => open(event, character)}
                      >
                        {character.name}
                      </a>
                    ) : (
                      character.name
                    )}
                  </h3>
                  <p>{character.caption}</p>
                  <a
                    href={whatsappUrl(character.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Quiero conocer más sobre ${character.name} en WhatsApp`}
                  >
                    Quiero conocer más <Icon name="arrow" />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
        <p className="section-footnote">
          <Icon name="heart" /> Cada personaje, una manera distinta de hacerles
          sonreír.
        </p>
      </div>
      <Lightbox
        photos={active ? getCharacterPhotos(active) : []}
        title={active?.name}
        selected={selected}
        onSelect={setSelected}
        openerRef={openerRef}
      />
    </section>
  );
}
