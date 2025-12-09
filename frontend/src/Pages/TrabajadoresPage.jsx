import React, { useState, useEffect, useMemo } from 'react';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaTimes, FaUserCircle } from 'react-icons/fa';
import '../Styles/TrabajadoresPage.css';

const API_BASE_URL = process.env.API_URL || 'http://127.0.0.1:8000';
const API_URL = `${API_BASE_URL}/api/trabajadores/`;

function TrabajadorModal({ modalData, onClose, onSave }) {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    numero: '',
  });

  const isEditMode = modalData.type === 'edit';

  useEffect(() => {
    if (isEditMode && modalData.trabajador) {
      setFormData({
        nombre: modalData.trabajador.nombre || '',
        correo: modalData.trabajador.correo || '',
        numero: modalData.trabajador.numero || '',
      });
    } else {
      setFormData({
        nombre: '',
        correo: '',
        numero: '',
      });
    }
  }, [modalData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSend = {
      ...formData,
      numero: formData.numero || null,
    };
    onSave(dataToSend);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{isEditMode ? 'Editar Trabajador' : 'Agregar Nuevo Trabajador'}</h2>
          <button onClick={onClose} className="close-btn">
            <FaTimes size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="nombre">Nombre</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="correo">Correo Electrónico</label>
              <input
                type="email"
                id="correo"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="numero">Número (Opcional)</label>
              <input
                type="tel"
                id="numero"
                name="numero"
                value={formData.numero}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              {isEditMode ? 'Guardar Cambios' : 'Crear Trabajador'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function TrabajadoresPage() {
  const [trabajadores, setTrabajadores] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState(null);

  useEffect(() => {
    fetchTrabajadores();
  }, []);

  const fetchTrabajadores = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error(`Error ${response.status}: No se pudo conectar a la API.`);
      const data = await response.json();
      setTrabajadores(data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredTrabajadores = useMemo(() => {
    return trabajadores.filter(
      (t) =>
        t.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.correo.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [trabajadores, searchTerm]);

  const handleSave = async (formData) => {
    const isEditMode = modal.type === 'edit';
    const url = isEditMode ? `${API_URL}${modal.trabajador.id}/` : API_URL;
    const method = isEditMode ? 'PUT' : 'POST';
    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        let errorMsg = JSON.stringify(errorData);
        if (errorData.correo) errorMsg = `Correo: ${errorData.correo[0]}`;
        throw new Error(errorMsg);
      }
      setModal(null);
      fetchTrabajadores();
    } catch (err) {
      console.error(`Error guardando trabajador:`, err);
      setError(`No se pudo guardar: ${err.message}`);
    }
  };

  const handleDelete = async (trabajadorId) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este trabajador?")) return;
    try {
      const response = await fetch(`${API_URL}${trabajadorId}/`, { method: 'DELETE' });
      if (!response.ok && response.status !== 204) throw new Error('No se pudo eliminar el trabajador.');
      fetchTrabajadores();
    } catch (err) {
      console.error(`Error eliminando trabajador:`, err);
      setError(err.message);
    }
  };

  const openModal = (type, trabajador = null) => setModal({ type, trabajador });
  const closeModal = () => setModal(null);

  return (
    <div className="trabajadores-page">
      <header className="page-header">
        <h1>Gestor de Trabajadores</h1>
        <div className="header-actions">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Buscar trabajador..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button onClick={() => openModal('add')} className="add-button">
            <FaPlus />
            <span>Agregar</span>
          </button>
        </div>
      </header>
      <div className="table-container">
        {loading && <p className="loading-message">Cargando trabajadores...</p>}
        {error && <p className="error-message">{error}</p>}
        {!loading && !error && (
          <table className="trabajadores-table">
            <thead>
              <tr>
                <th>Trabajador</th>
                <th>Número</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrabajadores.length > 0 ? (
                filteredTrabajadores.map((trabajador) => (
                  <tr key={trabajador.id}>
                    <td className="trabajador-cell">
                      <span className="trabajador-avatar">
                        <FaUserCircle size={24} />
                      </span>
                      <div className="trabajador-info">
                        <div className="nombre">{trabajador.nombre}</div>
                        <div className="detalle">{trabajador.correo}</div>
                      </div>
                    </td>
                    <td>{trabajador.numero || 'N/A'}</td>
                    <td className="actions-cell">
                      <button onClick={() => openModal('edit', trabajador)} className="action-btn edit-btn" title="Editar">
                        <FaEdit size={18} />
                      </button>
                      <button onClick={() => handleDelete(trabajador.id)} className="action-btn delete-btn" title="Eliminar">
                        <FaTrash size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="no-data-message">
                    No se encontraron trabajadores.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
      {modal && <TrabajadorModal modalData={modal} onClose={closeModal} onSave={handleSave} />}
    </div>
  );
}
