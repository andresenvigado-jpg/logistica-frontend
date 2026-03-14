import { useNavigate } from 'react-router-dom';

export default function BackButton({ to = '/' }) {
  const navigate = useNavigate();
  return (
    <button className="btn-back" onClick={() => navigate(to)}>
      ← Volver
    </button>
  );
}
