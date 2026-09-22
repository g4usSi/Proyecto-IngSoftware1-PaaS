import { Icon } from './Icon.jsx';

export function PendingState({ icon, title, eyebrow = 'En preparación', children }) {
  return (
    <div className="pending-state">
      <span className="pending-icon"><Icon name={icon} /></span>
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      <p>{children}</p>
    </div>
  );
}
