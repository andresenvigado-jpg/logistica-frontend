import { useState, useEffect } from 'react';
import { getClientes, createCliente, updateCliente, deleteCliente } from '../services/clientesService';
import BackButton from '../components/BackButton';
import Modal from '../components/Modal';

const emptyForm = { nombre: '', apellido: '', email: '', telefono: '', direccion: '' };

export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [modal, setModal]       = useState(null); // 'create' | 'edit'
  const [form, setForm]         = useState(emptyForm);
  const [editId, setEditId]     = useState(null);
  const [error, setError]       = useState('');
  const [msg, setMsg]           = useState('');

  const load = async () => {
    const { data } = await getClientes();
    setClientes(data);
  };

  useEffect(() => { load(); }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const openCreate = () => { setForm(emptyForm); setEditId(null); setModal('form'); setError(''); };
  const openEdit   = (c)  => { setForm(c); setEditId(c.id_cliente); setModal('form'); setError(''); };
  const closeModal = ()   => { setModal(null); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editId) await updateCliente(editId, form);
      else        await createCliente(form);
      setMsg(editId ? 'Cliente actualizado ✔' : 'Cliente creado ✔');
      closeModal();
      load();
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al guardar');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este cliente?')) return;
    try {
      await deleteCliente(id);
      load();
    } catch {
      alert('No se pudo eliminar el cliente');
    }
  };

  return (
    <div className="page">
      <BackButton to="/" />
      <div className="page-header">
        <h2>👥 Clientes</h2>
        <button className="btn-primary" onClick={openCreate}>+ Nuevo cliente</button>
      </div>
      {msg && <div className="alert alert-success">{msg}</div>}
      <table className="table">
        <thead>
          <tr>
            <th>ID</th><th>Nombre</th><th>Apellido</th>
            <th>Email</th><th>Teléfono</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((c) => (
            <tr key={c.id_cliente}>
              <td>{c.id_cliente}</td>
              <td>{c.nombre}</td>
              <td>{c.apellido}</td>
              <td>{c.email}</td>
              <td>{c.telefono}</td>
              <td>
                <button className="btn-edit" onClick={() => openEdit(c)}>Editar</button>
                <button className="btn-delete" onClick={() => handleDelete(c.id_cliente)}>Eliminar</button>
              </td>
            </tr>
          ))}
          {clientes.length === 0 && (
            <tr><td colSpan={6} className="empty">Sin registros</td></tr>
          )}
        </tbody>
      </table>

      {modal === 'form' && (
        <Modal title={editId ? 'Editar cliente' : 'Nuevo cliente'} onClose={closeModal}>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            {[['nombre','Nombre'],['apellido','Apellido'],['email','Email'],
              ['telefono','Teléfono'],['direccion','Dirección']].map(([name, label]) => (
              <div key={name}>
                <label>{label}</label>
                <input name={name} value={form[name] || ''} onChange={handleChange} required={name !== 'direccion'} />
              </div>
            ))}
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
