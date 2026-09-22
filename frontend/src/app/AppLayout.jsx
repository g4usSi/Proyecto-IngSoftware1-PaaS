import { Link, NavLink, Outlet } from 'react-router-dom';
import { Brand } from '../components/Brand.jsx';
import { Icon } from '../components/Icon.jsx';
import { ServiceStatus } from '../components/ServiceStatus.jsx';

export function AppLayout() {
  return (
    <div className="app-layout">
      <aside className="app-sidebar">
        <Brand light />
        <span className="sidebar-label">TU ESPACIO</span>
        <nav className="app-nav" aria-label="Secciones del proyecto">
          <NavLink to="/app/storage"><Icon name="grid" /> Mis imágenes</NavLink>
          <NavLink to="/app/plans"><Icon name="plan" /> Planes</NavLink>
        </nav>
        <div className="sidebar-bottom"><span className="sidebar-flower" aria-hidden="true">✳</span><p>Más espacio para<br />lo que imaginas.</p><Link to="/">Volver al inicio <Icon name="arrow" /></Link></div>
      </aside>
      <div className="workspace">
        <header className="workspace-header"><span className="preview-badge">Vista base del proyecto</span><Link className="text-link" to="/login"><Icon name="lock" /> Iniciar sesión</Link></header>
        <main className="workspace-content" id="main-content"><Outlet /></main>
        <footer className="workspace-footer"><span>SmartStorage · Primera versión</span><ServiceStatus /></footer>
      </div>
    </div>
  );
}
