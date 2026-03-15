import { useState, useEffect } from 'react';
import { getBodegas, createBodega, updateBodega, deleteBodega } from '../services/bodegasService';
import BackButton from '../components/BackButton';
import Modal from '../components/Modal';

const emptyForm = { nombre: '', direccion: '', ciudad: '', pais: '', tipo: 'nacional' };

export default function BodegasPage() {
  const [bodegas, setBodegas] = useState([]);
  const [modal, setModal]     = useState(null);
  const [form, setForm]       = useState(emptyForm);
  const [editId, setEditId]   = useState(null);
  const [error, setError]     = useState('');
  const [msg, setMsg]         = useState('');

  const load = async () => { const { data } = await getBodegas(); setBodegas(data); };
  useEffect(() => { load(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const openCreate = () => { setForm(emptyForm); setEditId(null); setModal('form'); setError(''); };
  const openEdit   = (b) => { setForm(b); setEditId(b.id_bodega); setModal('form'); setError(''); };
  const closeModal = ()  => { setModal(null); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    try {
      if (editId) await updateBodega(editId, form);
      else        await createBodega(form);
      setMsg(editId ? 'Bodega actualizada ✔' : 'Bodega creada ✔');
      closeModal(); load();
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al guardar');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta bodega?')) return;
    try { await deleteBodega(id); load(); }
    catch { alert('No se pudo eliminar la bodega'); }
  };

  return (
    <div className="page">
      <BackButton to="/" />
      <div className="page-header">
        <h2>🏭 Bodegas</h2>
        <button className="btn-primary" onClick={openCreate}>+ Nueva bodega</button>
      </div>
      {msg && <div className="alert alert-success">{msg}</div>}
      <table className="table">
        <thead>
          <tr><th>ID</th><th>Nombre</th><th>Ciudad</th><th>País</th><th>Tipo</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          {bodegas.map((b) => (
            <tr key={b.id_bodega}>
              <td>{b.id_bodega}</td><td>{b.nombre}</td>
              <td>{b.ciudad}</td><td>{b.pais}</td><td>{b.tipo}</td>
              <td>
                <button className="btn-edit" onClick={() => openEdit(b)}>Editar</button>
                <button className="btn-delete" onClick={() => handleDelete(b.id_bodega)}>Eliminar</button>
              </td>
            </tr>
          ))}
          {bodegas.length === 0 && <tr><td colSpan={6} className="empty">Sin registros</td></tr>}
        </tbody>
      </table>

      {modal === 'form' && (
        <Modal title={editId ? 'Editar bodega' : 'Nueva bodega'} onClose={closeModal}>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            {[['nombre','Nombre'],['direccion','Dirección'],['ciudad','Ciudad'],['pais','País']].map(([name, label]) => (
              <div key={name}>
                <label>{label}</label>
                <input name={name} type="text" value={form[name] || ''}
                  onChange={handleChange} required={['nombre','pais'].includes(name)} />
              </div>
            ))}
            <div>
              <label>Tipo</label>
              <select name="tipo" value={form.tipo || 'nacional'} onChange={handleChange} required>
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
