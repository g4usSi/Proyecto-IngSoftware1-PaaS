import { Link } from 'react-router-dom';
import { Brand } from '../../components/Brand.jsx';
import { Icon } from '../../components/Icon.jsx';

export function AuthPage({ mode }) {
  const register = mode === 'register';

  return (
    <main id="main-content" className="auth-page">
      <section className="auth-story">
        <Brand light />
        <div><div className="auth-mark" aria-hidden="true"><Icon name="layers" /></div><span className="eyebrow">TU PRÓXIMO ESPACIO CREATIVO</span><h1>Cada imagen,<br />un poco<br /><em>más ligera.</em></h1><p>Un solo lugar para tus imágenes.<br />Menos copias. Más posibilidades.</p></div>
        <Link className="auth-back" to="/">← Volver al inicio</Link>
      </section>
      <section className="auth-content" aria-labelledby="auth-title">
        <div className="auth-card">
          <span className="eyebrow">SMARTSTORAGE</span>
          <h2 id="auth-title">{register ? 'Crea tu cuenta.' : 'Bienvenido de vuelta.'}</h2>
          <p className="auth-intro">{register ? 'Tu espacio comienza aquí.' : 'Todo listo para volver a tus imágenes.'}</p>
          <div className="availability-note" id="auth-availability"><Icon name="lock" /><p><strong>Disponible próximamente</strong>Estamos preparando {register ? 'el registro de cuentas' : 'el inicio de sesión'}. Esta vista todavía no recibe ni envía datos.</p></div>
          <fieldset disabled aria-describedby="auth-availability" className="auth-fields">
            <legend className="sr-only">{register ? 'Datos de registro pendientes de habilitar' : 'Credenciales pendientes de habilitar'}</legend>
            {register && <label>Nombre completo<input type="text" name="name" autoComplete="name" placeholder="Tu nombre" /></label>}
            <label>Correo electrónico<input type="email" name="email" autoComplete="email" placeholder="tu@correo.com" /></label>
            <label>Contraseña<input type="password" name="password" autoComplete={register ? 'new-password' : 'current-password'} placeholder="Tu contraseña" /></label>
            <button className="button button-dark" type="button" disabled>{register ? 'Crear cuenta' : 'Iniciar sesión'}<Icon name="arrow" /></button>
          </fieldset>
          <p className="auth-switch">{register ? '¿Ya tienes cuenta?' : '¿Nuevo por aquí?'} <Link to={register ? '/login' : '/register'}>{register ? 'Iniciar sesión' : 'Crear una cuenta'}</Link></p>
          <Link className="explore-link" to="/app/storage">Explorar la vista del proyecto <Icon name="arrow" /></Link>
        </div>
      </section>
    </main>
  );
}
