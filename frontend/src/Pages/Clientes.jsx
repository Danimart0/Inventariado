import React, { useState, useEffect, useMemo } from 'react';
// 1. Importa los iconos que sí usas
import { FaSearch, FaPlus, FaEdit, FaTrash, FaTimes, FaUserCircle } from 'react-icons/fa';
// 2. Importa tu nuevo archivo CSS
import '../Styles/Cliente.css';

// URL de la API
const API_URL = '/api/clientes/';

// --- Componente del Modal ---
function ClienteModal({ modalData, onClose, onSave }) {
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    saldo_actual: '0.00',
    ultimo_pago: '', 
  });

  const isEditMode = modalData.type === 'edit';

  useEffect(() => {
    if (isEditMode && modalData.cliente) {
      setFormData({
        nombre: modalData.cliente.nombre || '',
        direccion: modalData.cliente.direccion || '',
        saldo_actual: modalData.cliente.saldo_actual || '0.00',
        ultimo_pago: modalData.cliente.ultimo_pago || '', 
      });
    } else {
      setFormData({
        nombre: '',
        direccion: '',
        saldo_actual: '0.00',
        ultimo_pago: '',
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
      saldo_actual: parseFloat(formData.saldo_actual) || 0.00,
      ultimo_pago: formData.ultimo_pago || null,
    };
    onSave(dataToSend);
  };

  return (
    // Reemplazamos clases de Tailwind por las del CSS
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>
            {isEditMode ? 'Editar Cliente' : 'Agregar Nuevo Cliente'}
          </h2>
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
              <label htmlFor="direccion">Dirección (Opcional)</label>
              <textarea
                id="direccion"
                name="direccion"
                rows="3"
                value={formData.direccion}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="saldo_actual">Saldo Actual (ej: 150.50)</label>
              <input
                type="number"
                step="0.01"
                id="saldo_actual"
                name="saldo_actual"
                value={formData.saldo_actual}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="ultimo_pago">Fecha de Último Pago (Opcional)</label>
              <input
                type="date"
                id="ultimo_pago"
                name="ultimo_pago"
                value={formData.ultimo_pago}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              {isEditMode ? 'Guardar Cambios' : 'Crear Cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- Componente Principal de la Página ---
// 3. Renombra el archivo a "ClientesPage.jsx" para que coincida con el import
export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState(null); 

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: No se pudo conectar a la API.`);
      }
      const data = await response.json();
      setClientes(data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredClientes = useMemo(() => {
    return clientes.filter((cliente) =>
      cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cliente.direccion && cliente.direccion.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [clientes, searchTerm]);

  const handleSave = async (formData) => {
    const isEditMode = modal.type === 'edit';
    const url = isEditMode ? `${API_URL}${modal.cliente.id}/` : API_URL;
    const method = isEditMode ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(JSON.stringify(errorData));
      }
      setModal(null);
      fetchClientes(); 
    } catch (err) {
      console.error(`Error guardando cliente:`, err);
      setError(`No se pudo guardar: ${err.message}`);
    }
  };

  const handleDelete = async (clienteId) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este cliente?")) {
      return;
    }
    try {
      const response = await fetch(`${API_URL}${clienteId}/`, {
        method: 'DELETE',
      });
      if (!response.ok && response.status !== 204) {
        throw new Error('No se pudo eliminar el cliente.');
      }
      fetchClientes(); 
    } catch (err) {
      console.error(`Error eliminando cliente:`, err);
      setError(err.message);
    }
  };

  // Handlers de UI
  const openModal = (type, cliente = null) => setModal({ type, cliente });
  const closeModal = () => setModal(null);
  
  // Funciones de Formato
  const formatCurrency = (amount) => {
    const numericAmount = parseFloat(amount) || 0;
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(numericAmount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const adjustedDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    return adjustedDate.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // --- Renderizado del Componente ---
  return (
    // 4. Usamos las clases del archivo CSS
    <div className="clientes-page">
      
      <header className="page-header">
        <h1>Gestor de Clientes</h1>
        <div className="header-actions">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Buscar cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button
            onClick={() => openModal('add')}
            className="add-button"
          >
            <FaPlus />
            <span>Agregar</span>
          </button>
        </div>
      </header>

      <div className="table-container">
        {loading && <p className="loading-message">Cargando clientes...</p>}
        {error && <p className="error-message">{error}</p>}
        
        {!loading && !error && (
          <table className="clientes-table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Saldo Actual</th>
                <th>Último Pago</th>
                <th>Acciones</th>
              </tr>
            </thead>
            
            <tbody>
              {filteredClientes.length > 0 ? (
                filteredClientes.map((cliente) => (
                  <tr key={cliente.id}>
                    
                    <td className="cliente-cell">
                      <span className="cliente-avatar">
                        <FaUserCircle size={24} />
                      </span>
                      <div className="cliente-info">
                        <div className="nombre">{cliente.nombre}</div>
                        <div className="detalle">{cliente.direccion || 'Sin dirección'}</div>
                      </div>
                    </td>
                    
                    <td>{formatCurrency(cliente.saldo_actual)}</td>
                    
                    <td>{formatDate(cliente.ultimo_pago)}</td>
                    
                    <td className="actions-cell">
                      <button
                        onClick={() => openModal('edit', cliente)}
                        className="action-btn edit-btn"
                        title="Editar"
                      >
                        <FaEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(cliente.id)}
                        className="action-btn delete-btn"
                        title="Eliminar"
                      >
                        <FaTrash size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="no-data-message">
                    No se encontraron clientes.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* El modal se renderiza aquí si 'modal' no es null */}
      {modal && (
        <ClienteModal
          modalData={modal}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}
    </div>
  );
}