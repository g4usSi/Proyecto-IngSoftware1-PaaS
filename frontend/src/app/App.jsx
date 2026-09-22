import { useEffect } from 'react';
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { LandingPage } from './LandingPage.jsx';
import { AppLayout } from './AppLayout.jsx';
import { AuthPage } from '../features/auth/AuthPage.jsx';
import { StoragePage } from '../features/storage/StoragePage.jsx';
import { PlansPage } from '../features/subscriptions/PlansPage.jsx';
import { Brand } from '../components/Brand.jsx';

const titles = {
  '/': 'Imágenes con menos espacio',
  '/login': 'Iniciar sesión',
  '/register': 'Crear cuenta',
  '/app/storage': 'Mis imágenes',
  '/app/plans': 'Planes',
};

export function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    document.title = `SmartStorage · ${titles[pathname] ?? 'Página no encontrada'}`;
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <a className="skip-link" href="#main-content">Saltar al contenido</a>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/register" element={<AuthPage mode="register" />} />
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<Navigate to="storage" replace />} />
          <Route path="storage" element={<StoragePage />} />
          <Route path="plans" element={<PlansPage />} />
        </Route>
        <Route path="*" element={
          <main id="main-content" className="not-found">
            <Brand />
            <span className="eyebrow">404</span>
            <h1>Esta página no está aquí.</h1>
            <p>Vuelve al inicio para seguir explorando SmartStorage.</p>
            <Link className="button button-dark" to="/">Volver al inicio</Link>
          </main>
        } />
      </Routes>
    </>
  );
}
