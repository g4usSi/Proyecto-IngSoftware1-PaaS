import { Link } from 'react-router-dom';
import { Brand } from '../components/Brand.jsx';
import { Icon } from '../components/Icon.jsx';
import { ServiceStatus } from '../components/ServiceStatus.jsx';

const steps = [
  { number: '01', icon: 'upload', title: 'Sube tu imagen.', description: 'Un espacio sencillo para reunir tus imágenes y tenerlas a mano.' },
  { number: '02', icon: 'spark', title: 'Guarda lo esencial.', description: 'Conversión a WebP: conservaremos la imagen optimizada y el tamaño original como dato.' },
  { number: '03', icon: 'layers', title: 'Una copia es suficiente.', description: 'La deduplicación global reutilizará archivos idénticos, manteniendo el acceso de cada usuario.' },
];

export function LandingPage() {
  return (
    <div className="landing">
      <div className="hero-wrap">
        <header className="site-header content-width">
          <Brand light />
          <nav aria-label="Navegación principal" className="public-nav">
            <a href="#proceso">Cómo funciona</a>
            <Link to="/app/plans">Planes</Link>
          </nav>
          <div className="header-actions">
            <Link className="text-link" to="/login">Entrar</Link>
            <Link className="button button-peach button-small" to="/register">Crear cuenta <Icon name="arrow" /></Link>
          </div>
        </header>

        <main id="main-content">
          <section className="hero content-width" aria-labelledby="hero-title">
            <div className="hero-copy">
              <span className="hero-kicker"><span /> Storage as a Service</span>
              <h1 id="hero-title">Tus imágenes.<br />Más ligeras.<br /><span>Igual de tuyas.</span></h1>
              <p>Estamos construyendo una forma sencilla de almacenar imágenes: optimización WebP, menos duplicados y un espacio para todo lo que creas.</p>
              <div className="hero-actions">
                <Link className="button button-orange" to="/app/storage">Explorar el proyecto <Icon name="arrow" /></Link>
                <a className="hero-secondary" href="#proceso">Conocer el proceso <span aria-hidden="true">↘</span></a>
              </div>
              <div className="development-note"><span className="development-dot" /> Proyecto en desarrollo · Primera versión</div>
            </div>

            <div className="pipeline" aria-label="Flujo previsto: imagen original, optimización a WebP y una única copia almacenada">
              <div className="pipeline-top"><span className="pipeline-label">MENOS ESPACIO. MÁS POSIBILIDADES.</span><Icon name="spark" /></div>
              <div className="original-file"><span className="file-icon"><Icon name="image" /></span><div><strong>Tu imagen original</strong><span>Su tamaño queda como dato</span></div><span className="file-format">JPG / PNG</span></div>
              <div className="process-line"><span /><span className="process-pill"><Icon name="spark" /> Optimización</span><span /></div>
              <div className="optimized-file">
                <div className="image-landscape" aria-hidden="true"><div className="landscape-sun" /><div className="mountain mountain-back" /><div className="mountain mountain-front" /><span className="webp-label">.webp</span></div>
                <div className="optimized-caption"><div><span>LA VERSIÓN QUE CONSERVAMOS</span><strong>Lo mismo que te importa.<br />Solo lo que necesitas.</strong></div><span className="optimized-symbol"><Icon name="image" /></span></div>
              </div>
              <div className="pipeline-bottom"><Icon name="layers" /><span>Contenido idéntico. Una sola copia física.</span></div>
              <span className="pipeline-caption">Vista conceptual del flujo de almacenamiento</span>
            </div>
          </section>
          <section className="process-section" id="proceso" aria-labelledby="process-title">
            <div className="content-width">
              <div className="section-heading"><div><span className="eyebrow">SIMPLE DESDE EL PRINCIPIO</span><h2 id="process-title">Un lugar para tus imágenes.<br />Un mejor uso del espacio.</h2></div><p>Este es el recorrido que guiará nuestra primera versión de SmartStorage.</p></div>
              <div className="steps-grid">{steps.map((step) => <article className="process-card" key={step.number}><div className="process-card-top"><span>{step.number}</span><Icon name={step.icon} /></div><h3>{step.title}</h3><p>{step.description}</p></article>)}</div>
            </div>
          </section>
        </main>
      </div>
      <footer className="site-footer content-width"><Brand /><span>SmartStorage · Ingeniería de Software I</span><ServiceStatus /></footer>
    </div>
  );
}
