import { useState, useEffect } from 'react';
import { getPuertos, createPuerto, updatePuerto, deletePuerto } from '../services/puertosService';
import BackButton from '../components/BackButton';
import Modal from '../components/Modal';

const emptyForm = { nombre: '', ciudad: '', pais: '', tipo: 'nacional' };

export default function PuertosPage() {
  const [puertos, setPuertos] = useState([]);
  const [modal, setModal]     = useState(null);
  const [form, setForm]       = useState(emptyForm);
  const [editId, setEditId]   = useState(null);
  const [error, setError]     = useState('');
  const [msg, setMsg]         = useState('');

  const load = async () => { const { data } = await getPuertos(); setPuertos(data); };
  useEffect(() => { load(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const openCreate = () => { setForm(emptyForm); setEditId(null); setModal('form'); setError(''); };
  const openEdit   = (p) => { setForm(p); setEditId(p.id_puerto); setModal('form'); setError(''); };
  const closeModal = ()  => { setModal(null); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    try {
      if (editId) await updatePuerto(editId, form);
      else        await createPuerto(form);
      setMsg(editId ? 'Puerto actualizado ✔' : 'Puerto creado ✔');
      closeModal(); load();
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al guardar');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este puerto?')) return;
    try { await deletePuerto(id); load(); }
    catch { alert('No se pudo eliminar el puerto'); }
  };

  return (
    <div className="page">
      <BackButton to="/" />
      <div className="page-header">
        <h2>⚓ Puertos</h2>
        <button className="btn-primary" onClick={openCreate}>+ Nuevo puerto</button>
      </div>
      {msg && <div className="alert alert-success">{msg}</div>}
      <table className="table">
        <thead>
          <tr><th>ID</th><th>Nombre</th><th>Ciudad</th><th>País</th><th>Tipo</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          {puertos.map((p) => (
            <tr key={p.id_puerto}>
              <td>{p.id_puerto}</td><td>{p.nombre}</td>
              <td>{p.ciudad}</td><td>{p.pais}</td>
              <td><span className={`badge badge-${p.tipo}`}>{p.tipo}</span></td>
              <td>
                <button className="btn-edit" onClick={() => openEdit(p)}>Editar</button>
                <button className="btn-delete" onClick={() => handleDelete(p.id_puerto)}>Eliminar</button>
              </td>
            </tr>
          ))}
          {puertos.length === 0 && <tr><td colSpan={6} className="empty">Sin registros</td></tr>}
        </tbody>
      </table>

      {modal === 'form' && (
        <Modal title={editId ? 'Editar puerto' : 'Nuevo puerto'} onClose={closeModal}>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            {[['nombre','Nombre'],['ciudad','Ciudad'],['pais','País']].map(([name, label]) => (
              <div key={name}>
                <label>{label}</label>
                <input name={name} value={form[name] || ''} onChange={handleChange} required />
              </div>
            ))}
            <div>
              <label>Tipo</label>
              <select name="tipo" value={form.tipo} onChange={handleChange}>
                <option value="nacional">Nacional</option>
                <option value="internacional">Internacional</option>
              </select>
            </div>
            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={closeModal}>Cancelar</button>
              <button type="submit" className="btn-primary">Guardar</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
