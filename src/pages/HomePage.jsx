import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const modules = [
  { path: '/clientes',          icon: '👥', label: 'Clientes' },
  { path: '/bodegas',           icon: '🏭', label: 'Bodegas' },
  { path: '/puertos',           icon: '⚓', label: 'Puertos' },
  { path: '/envios/terrestres', icon: '🚛', label: 'Envíos Terrestres' },
  { path: '/envios/maritimos',  icon: '🚢', label: 'Envíos Marítimos' },
];

export default function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('token')) navigate('/login');
  }, []);

  return (
    <div className="page">
      <div className="welcome">
        <h2>🚛 Sistema de Gestión Logística</h2>
        <p>Selecciona un módulo para comenzar</p>
      </div>
      <div className="card-grid">
        {modules.map((m) => (
          <Link key={m.path} to={m.path} style={{ textDecoration: 'none' }}>
            <div className="module-card">
              <span className="module-icon">{m.icon}</span>
              <span className="module-label">{m.label}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
