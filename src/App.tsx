import { presentation } from "./content";
import type { ReactNode } from "react";
import {
  business,
  developmentCredit,
  events,
  faqs,
  included,
  services,
  steps,
  values,
} from "./content";
import { whatsappUrl } from "./lib/whatsapp";
import { Icon } from "./components/Icon";
import { Photo } from "./components/Photo";
import { Gallery } from "./components/Gallery";
import { Characters } from "./components/Characters";

function WhatsAppLink({
  subject,
  children = "Consultar por WhatsApp",
  className = "button button-primary",
}: {
  subject?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <a
      className={className}
      href={whatsappUrl(subject)}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Icon name="whatsapp" />
      {children}
      <Icon name="arrow" />
    </a>
  );
}
const links = [
  { href: "#personajes", label: "Personajes" },
  { href: "#servicios", label: "Experiencias" },
  { href: "#galeria", label: "Galería" },
  { href: "#nosotras", label: "Nuestra esencia" },
];
function Header() {
  return (
    <>
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <div className="announcement">
        <Icon name="sparkle" />
        <span>Pequeños momentos. Grandes recuerdos.</span>
        <span className="announcement-place">
          Hecho con ilusión en La Habana
        </span>
      </div>
      <header className="site-header">
        <div className="container header-inner">
          <a
            href="#inicio"
            className="brand"
            aria-label="Pide un Deseo, inicio"
          >
            <img
              src="/images/logo.webp"
              width="82"
              height="82"
              alt="Pide un Deseo"
            />
          </a>
          <nav className="desktop-nav" aria-label="Navegación principal">
            {links.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
          <a
            className="header-contact"
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
          >
            Hablemos de tu fiesta <Icon name="arrow" />
          </a>
          <details className="mobile-menu">
            <summary aria-label="Menú de navegación">
              <Icon name="menu" />
              <Icon name="close" />
            </summary>
            <nav aria-label="Navegación móvil">
              {[...links, { href: "#contacto", label: "Contacto" }].map(
                (link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(event) =>
                      event.currentTarget
                        .closest("details")
                        ?.removeAttribute("open")
                    }
                  >
                    {link.label}
                    <Icon name="arrow" />
                  </a>
                ),
              )}
            </nav>
          </details>
        </div>
      </header>
    </>
  );
}
function Hero() {
  return (
    <section
      className="hero container"
      id="inicio"
      aria-labelledby="hero-title"
    >
      <div className="hero-copy">
        <p className="eyebrow">
          <span /> Animación infantil & organización de eventos
        </p>
        <h1 id="hero-title">
          Su personaje
          <br />
          favorito.
          <br />
          <em>
            Un recuerdo
            <br />
            para siempre.
          </em>
        </h1>
        <p className="hero-description">
          Hay visitas que se convierten en recuerdos.
          <br className="desktop-break" /> Llevamos sus personajes favoritos a
          tu celebración, con canciones, juegos y mucha, mucha ilusión.
        </p>
        <div className="hero-actions">
          <WhatsAppLink />
          <a className="text-link" href="#personajes">
            Conocer los personajes <Icon name="arrow" />
          </a>
        </div>
        <div className="hero-location">
          <Icon name="pin" />
          <span>
            La Habana, Cuba <span className="location-divider">·</span> La magia
            va hasta ti
          </span>
        </div>
      </div>
      <div className="hero-art">
        <span className="hero-orbit" aria-hidden="true" />
        <Icon name="sparkle" className="hero-sparkle sparkle-one" />
        <Icon name="sparkle" className="hero-sparkle sparkle-two" />
        <div className="hero-photo-main">
          <Photo
            photo={{
              ...presentation.hero,
              alt: "Rapunzel con su vestido lila entre las flores del jardín",
            }}
            priority
            sizes="(max-width: 600px) 65vw, (max-width: 1000px) 50vw, 35vw"
          />
        </div>
        <div className="hero-photo-small">
          <Photo
            photo={{
              ...presentation.small,
              alt: "Cenicienta sonriendo con su vestido azul",
            }}
            sizes="(max-width: 600px) 31vw, 16vw"
          />
          <span></span>
        </div>
        <div className="hero-photo-huntrix">
          <Photo
            photo={{
              ...presentation.group,
              alt: "Las animadoras de Huntrix interpretando una pose del grupo",
            }}
            sizes="(max-width: 600px) 36vw, 17vw"
          />
        </div>
        <div className="hero-note">
          <Icon name="heart" />
          <span>
            Hecho de
            <br />
            <em>ilusión</em>
          </span>
        </div>
        <span className="hero-handwriting" aria-hidden="true">
         
        </span>
      </div>
    </section>
  );
}
function Services() {
  return (
    <section
      className="section services-section"
      id="servicios"
      aria-labelledby="services-title"
    >
      <div className="container">
        <div className="section-heading centered">
          <p className="eyebrow">
            <span /> Mucho más que una visita
          </p>
          <h2 id="services-title">
            Momentos que se quedan
            <br />
            <em>en el corazón.</em>
          </h2>
          <p>
            Experiencias para celebrar, jugar y compartir.
            <br />
            Nosotras ponemos la magia; ustedes, el motivo.
          </p>
        </div>
        <div className="services-grid">
          {services.map((service) => (
            <article
              className={`service-card ${service.featured ? "service-featured" : ""}`}
              key={service.name}
            >
              <div className="service-top">
                <Icon name={service.featured ? "sparkle" : "crown"} />
                <span>Animación · {service.duration}</span>
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <WhatsAppLink
                subject={service.name}
                className="button button-outline"
              >
                Consultar esta experiencia
              </WhatsAppLink>
            </article>
          ))}
          <article className="service-card gift-card">
            <div className="service-top">
              <Icon name="heart" />
              <span>Ofertas con descuento</span>
            </div>
            <h3>
              Más personajes,
              <br />
              más diversión
            </h3>
            <p>
              Recibe descuentos de hasta un 15% al solicitar personajes 
              de una misma temática.
              
            </p>
            <WhatsAppLink
              subject="Ofertas con descuento"
              className="button button-outline"
            >
              Ahorra por más
            </WhatsAppLink>
          </article>
        </div>
        <div className="included-box">
          <div>
            <p className="eyebrow">En nuestras animaciones</p>
            <h3>
              Cada encuentro tiene
              <br />
              un poco de todo esto.
            </h3>
          </div>
          <ul>
            {included.map((item) => (
              <li key={item}>
                <Icon name="check" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <p className="services-note">
          También compartimos la celebración con otros artistas invitados, como
          magos y payasos. Coordinamos los detalles contigo por WhatsApp.
        </p>
      </div>
    </section>
  );
}
function Events() {
  return (
    <section
      className="section events-section"
      id="eventos"
      aria-labelledby="events-title"
    >
      <div className="container">
        <div className="events-intro">
          <div>
            <p className="eyebrow">
              <span /> Nos encontramos durante todo el año
            </p>
            <h2 id="events-title">
              Siempre hay un motivo
              <br />
              <em>para hacer magia.</em>
            </h2>
          </div>
          <p>
            También creamos nuestros propios encuentros para grupos de{" "}
            <strong>25 a 35 niños</strong>. Nuevas historias, personajes y
            momentos para compartir.
          </p>
        </div>
        <div className="events-grid">
          {events.map((event, index) => (
            <article className="event-card" key={event.title}>
              <div className="event-icon">
                <Icon name={event.icon} />
                <span>0{index + 1}</span>
              </div>
              <h3>{event.title}</h3>
              <p>{event.text}</p>
            </article>
          ))}
        </div>
        <div className="events-bottom">
          <span>Descubre qué estamos preparando para la próxima ocasión.</span>
          <WhatsAppLink
            subject="los próximos eventos"
            className="button button-light"
          >
            Consultar próximos eventos
          </WhatsAppLink>
        </div>
      </div>
    </section>
  );
}
function About() {
  return (
    <section
      className="section about-section"
      id="nosotras"
      aria-labelledby="about-title"
    >
      <div className="container about-grid">
        <div className="about-art">
          <Photo
            photo={{
              ...presentation.about,
              alt: "Ariel, uno de los personajes recreados por nuestro equipo",
            }}
            sizes="(max-width: 700px) 85vw, 40vw"
          />
          <div className="about-caption">
            <Icon name="heart" />
            <span>
              Detrás de cada personaje,
              <br />
              <em>mucho amor por lo que hacemos.</em>
            </span>
          </div>
          <Icon name="sparkle" className="about-star" />
        </div>
        <div className="about-copy">
          <p className="eyebrow">
            <span /> Nuestra esencia
          </p>
          <h2 id="about-title">
            La magia está
            <br />
            <em>en los detalles.</em>
          </h2>
          <p>
            Somos Pide un Deseo. Desde La Habana Vieja, llevamos a cada
            celebración la ilusión de encontrarse con un personaje de fantasía.
          </p>
          <div className="value-list">
            {values.map((value) => (
              <div className="value" key={value.title}>
                <span className="value-icon">
                  <Icon name={value.icon} />
                </span>
                <div>
                  <h3>{value.title}</h3>
                  <p>{value.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
function Booking() {
  return (
    <section
      className="section booking-section"
      id="reservas"
      aria-labelledby="booking-title"
    >
      <div className="container">
        <div className="section-heading centered">
          <p className="eyebrow">
            <span /> Así empieza la historia
          </p>
          <h2 id="booking-title">
            De una idea bonita
            <br />
            <em>a un día inolvidable.</em>
          </h2>
        </div>
        <div className="steps">
          {steps.map((step, index) => (
            <div className="step" key={step.title}>
              <span className="step-number">0{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          ))}
        </div>
        <div className="booking-tip">
          <Icon name="sparkle" />
          <p>
            Los sueños bonitos se preparan con tiempo.{" "}
            <strong>Recomendamos consultar con un mes de anticipación.</strong>
          </p>
        </div>
        <div className="faq-grid">
          <div>
            <p className="eyebrow">Antes de hacer un deseo</p>
            <h2>
              Tal vez te
              <br />
              <em>preguntes…</em>
            </h2>
            <p>
              Y si te queda alguna duda,
              <br />
              estamos a un mensaje de distancia.
            </p>
            <a
              className="text-link"
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
            >
              Hablemos <Icon name="arrow" />
            </a>
          </div>
          <div className="faq-list">
            {faqs.map((faq) => (
              <details className="faq" key={faq.question}>
                <summary>
                  {faq.question}
                  <Icon name="plus" />
                </summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
function Contact() {
  return (
    <section
      className="contact-section"
      id="contacto"
      aria-labelledby="contact-title"
    >
      <div className="container contact-inner">
        <Icon name="sparkle" className="contact-star" />
        <p className="eyebrow">Nos encantará ser parte de su historia</p>
        <h2 id="contact-title">
          Pide un deseo
          <br />
          <em>y lo hacemos realidad</em>
        </h2>
        <p>
          Cuéntanos qué imaginas para su día.
          <br />
          Empecemos a preparar juntos un recuerdo inolvidable.
        </p>
        <WhatsAppLink className="button button-light">
          Escríbenos por WhatsApp
        </WhatsAppLink>
        <span className="contact-phone">
          {business.displayPhone} · La Habana, Cuba
        </span>
      </div>
    </section>
  );
}
function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <img
              src="/images/logo.webp"
              alt="Pide un Deseo"
              width="110"
              height="110"
            />
            <p>
              Personajes, ilusión y recuerdos
              <br />
              que se quedan para siempre.
            </p>
          </div>
          <div className="footer-social">
            <p className="eyebrow">La magia continúa en nuestras redes</p>
            <a
              className="social-handle"
              href={business.instagram}
              target="_blank"
              rel="noopener noreferrer"
            >
              {business.handle}
              <Icon name="arrow" />
            </a>
            <div className="social-links">
              <a
                href={business.instagram}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon name="instagram" />
                Instagram
              </a>
              <a
                href={business.facebook}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon name="facebook" />
                Facebook
              </a>
            </div>
          </div>
          <div className="footer-location">
            <Icon name="pin" />
            <p>
              Desde La Habana Vieja,
              <br />
              <strong>para toda La Habana.</strong>
            </p>
            <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
              {business.displayPhone}
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Pide un Deseo</span>
          <span className="development-credit">
            {developmentCredit.label}{" "}
            <a href={developmentCredit.url}>{developmentCredit.name}</a>
          </span>
          <a href="#inicio">Volver al inicio ↑</a>
        </div>
      </div>
    </footer>
  );
}
export default function App() {
  return (
    <>
      <Header />
      <main id="contenido">
        <Hero />
        <div className="magic-strip" aria-hidden="true">
          <span>Ilusión</span>
          <Icon name="sparkle" />
          <span>Canciones</span>
          <Icon name="sparkle" />
          <span>Sonrisas</span>
          <Icon name="sparkle" />
          <span>Recuerdos</span>
          <Icon name="sparkle" />
          <span>Magia</span>
        </div>
        <Characters />
        <Services />
        <Events />
        <Gallery />
        <About />
        <Booking />
        <Contact />
      </main>
      <Footer />
      <a
        className="floating-whatsapp"
        href={whatsappUrl()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="¿Hacemos un deseo? Consultar por WhatsApp"
      >
        <Icon name="whatsapp" />
        <span>¿Hacemos un deseo?</span>
      </a>
    </>
  );
}
