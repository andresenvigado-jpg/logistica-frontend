import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">🚛 Logística SAS</Link>
      </div>
      {isLoggedIn && (
        <ul className="navbar-links">
          <li><Link to="/clientes">Clientes</Link></li>
          <li><Link to="/bodegas">Bodegas</Link></li>
          <li><Link to="/puertos">Puertos</Link></li>
          <li><Link to="/envios/terrestres">Terrestres</Link></li>
          <li><Link to="/envios/maritimos">Marítimos</Link></li>
          <li>
            <button className="btn-logout" onClick={handleLogout}>Cerrar sesión</button>
          </li>
        </ul>
      )}
    </nav>
  );
}
