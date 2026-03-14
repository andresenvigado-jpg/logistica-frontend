import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar               from './components/Navbar';
import HomePage             from './pages/HomePage';
import LoginPage            from './pages/LoginPage';
import RegisterPage         from './pages/RegisterPage';
import ClientesPage         from './pages/ClientesPage';
import BodegasPage          from './pages/BodegasPage';
import PuertosPage          from './pages/PuertosPage';
import EnviosTerrestresPage from './pages/EnviosTerrestresPage';
import EnviosMaritimosPage  from './pages/EnviosMaritimosPage';
import './App.css';

// Guard: redirige a /login si no hay token
function PrivateRoute({ children }) {
  return localStorage.getItem('token') ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Públicas */}
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Privadas */}
        <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
        <Route path="/clientes" element={<PrivateRoute><ClientesPage /></PrivateRoute>} />
        <Route path="/bodegas"  element={<PrivateRoute><BodegasPage /></PrivateRoute>} />
        <Route path="/puertos"  element={<PrivateRoute><PuertosPage /></PrivateRoute>} />
        <Route path="/envios/terrestres" element={<PrivateRoute><EnviosTerrestresPage /></PrivateRoute>} />
        <Route path="/envios/maritimos"  element={<PrivateRoute><EnviosMaritimosPage /></PrivateRoute>} />

        {/* Ruta no encontrada */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
