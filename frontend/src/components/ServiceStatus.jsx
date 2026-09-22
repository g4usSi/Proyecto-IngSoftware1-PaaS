import { useEffect, useState } from 'react';
import { apiRequest } from '../services/api.js';

export function ServiceStatus() {
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    apiRequest('/health', { signal: controller.signal })
      .then(() => { if (active) setStatus('online'); })
      .catch(() => { if (active) setStatus('offline'); })
      .finally(() => clearTimeout(timeout));

    return () => {
      active = false;
      clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  const labels = { checking: 'Comprobando conexión', online: 'API conectada', offline: 'API sin conexión' };
  return <span className={`service-status ${status}`} role="status"><span aria-hidden="true" />{labels[status]}</span>;
}
