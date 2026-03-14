import { useState, useEffect } from 'react';
import { getTerrestres, createTerresre, deleteTerresre } from '../services/enviosService';
import { getClientes } from '../services/clientesService';
import { getBodegas }  from '../services/bodegasService';
import BackButton from '../components/BackButton';
import Modal from '../components/Modal';

const today = new Date().toISOString().slice(0, 10);
const emptyForm = {
  id_cliente: '', id_tipo_producto: 1, cantidad: '',
  fecha_registro: today, fecha_entrega: '', id_bodega: '',
  precio_envio: '', placa: '', numero_guia: '',
};

export default function EnviosTerrestresPage() {
  const [envios,   setEnvios]   = useState([]);
  const [clientes, setClientes] = useState([]);
  const [bodegas,  setBodegas]  = useState([]);
  const [modal,    setModal]    = useState(null);
  const [form,     setForm]     = useState(emptyForm);
  const [error,    setError]    = useState('');
  const [msg,      setMsg]      = useState('');

  const load = async () => {
    const [e, c, b] = await Promise.all([getTerrestres(), getClientes(), getBodegas()]);
    setEnvios(e.data); setClientes(c.data); setBodegas(b.data);
  };
  useEffect(() => { load(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const openCreate = () => { setForm(emptyForm); setModal('form'); setError(''); };
  const closeModal = ()  => { setModal(null); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    try {
      await createTerresre({
        ...form,
        id_cliente: Number(form.id_cliente),
        id_tipo_producto: Number(form.id_tipo_producto),
        cantidad: Number(form.cantidad),
        id_bodega: Number(form.id_bodega),
        precio_envio: Number(form.precio_envio),
        placa: form.placa.toUpperCase(),
        numero_guia: form.numero_guia.toUpperCase(),
      });
      setMsg('Envío terrestre creado ✔');
      closeModal(); load();
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(typeof detail === 'string' ? detail : JSON.stringify(detail));
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este envío?')) return;
    try { await deleteTerresre(id); load(); }
    catch { alert('No se pudo eliminar'); }
  };

  return (
    <div className="page">
      <BackButton to="/" />
      <div className="page-header">
        <h2>🚛 Envíos Terrestres</h2>
        <button className="btn-primary" onClick={openCreate}>+ Nuevo envío</button>
      </div>
      {msg && <div className="alert alert-success">{msg}</div>}
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th><th>Guía</th><th>Cliente</th><th>Cantidad</th>
              <th>Precio</th><th>Desc.%</th><th>Placa</th>
              <th>F.Entrega</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {envios.map((e) => (
              <tr key={e.id_envio}>
                <td>{e.id_envio}</td>
                <td><code>{e.numero_guia}</code></td>
                <td>{clientes.find(c => c.id_cliente === e.id_cliente)?.nombre || e.id_cliente}</td>
                <td>{e.cantidad}</td>
                <td>${Number(e.precio_envio).toLocaleString()}</td>
                <td>{e.descuento_porcentaje > 0
                  ? <span className="badge badge-desc">{e.descuento_porcentaje}%</span>
                  : '—'}
                </td>
                <td><code>{e.placa}</code></td>
                <td>{e.fecha_entrega}</td>
                <td>
                  <button className="btn-delete" onClick={() => handleDelete(e.id_envio)}>Eliminar</button>
                </td>
              </tr>
            ))}
            {envios.length === 0 && <tr><td colSpan={9} className="empty">Sin registros</td></tr>}
          </tbody>
        </table>
      </div>

      {modal === 'form' && (
        <Modal title="Nuevo envío terrestre" onClose={closeModal}>
          {error && <div className="alert alert-error">{error}</div>}
          <p className="tip">💡 Si la cantidad es mayor a 10, se aplica descuento del 5%</p>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Cliente</label>
              <select name="id_cliente" value={form.id_cliente} onChange={handleChange} required>
                <option value="">-- Selecciona --</option>
                {clientes.map(c => (
                  <option key={c.id_cliente} value={c.id_cliente}>{c.nombre} {c.apellido}</option>
                ))}
              </select>
            </div>
            <div>
              <label>Bodega destino</label>
              <select name="id_bodega" value={form.id_bodega} onChange={handleChange} required>
                <option value="">-- Selecciona --</option>
                {bodegas.map(b => (
                  <option key={b.id_bodega} value={b.id_bodega}>{b.nombre} - {b.ciudad}</option>
                ))}
              </select>
            </div>
            <div className="form-row">
              <div>
                <label>Cantidad</label>
                <input type="number" name="cantidad" min="1" value={form.cantidad} onChange={handleChange} required />
              </div>
              <div>
                <label>Precio envío</label>
                <input type="number" name="precio_envio" min="0.01" step="0.01" value={form.precio_envio} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-row">
              <div>
                <label>Fecha registro</label>
                <input type="date" name="fecha_registro" value={form.fecha_registro} onChange={handleChange} required />
              </div>
              <div>
                <label>Fecha entrega</label>
                <input type="date" name="fecha_entrega" value={form.fecha_entrega} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-row">
              <div>
                <label>Placa (AAA123)</label>
                <input name="placa" value={form.placa} onChange={handleChange} placeholder="AAA123" maxLength={6} required />
              </div>
              <div>
                <label>Nº Guía (10 alfanum.)</label>
                <input name="numero_guia" value={form.numero_guia} onChange={handleChange} placeholder="AB12345678" maxLength={10} required />
              </div>
            </div>
            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={closeModal}>Cancelar</button>
              <button type="submit" className="btn-primary">Crear envío</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
