import React, { useState, useEffect, useMemo } from 'react';
// Importa los iconos
import { FaSearch, FaPlus, FaEdit, FaTrash, FaTimes, FaUserCircle } from 'react-icons/fa';
import '../Styles/TrabajadoresPage.css';

// URL de la API (de tu router)
const API_URL = '/api/trabajadores/';

// --- Componente del Modal ---
function TrabajadorModal({ modalData, onClose, onSave }) {
  // Campos del modelo Trabajador
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    numero: '', 
  });

  const isEditMode = modalData.type === 'edit';

  // Cargar datos en el formulario si estamos editando
  useEffect(() => {
    if (isEditMode && modalData.trabajador) {
      setFormData({
        nombre: modalData.trabajador.nombre || '',
        correo: modalData.trabajador.correo || '',
        numero: modalData.trabajador.numero || '',
      });
    } else {
      // Resetear para modo "agregar"
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
    // Prepara los datos (asegura que 'numero' sea null si está vacío, no "")
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
          <h2>
            {isEditMode ? 'Editar Trabajador' : 'Agregar Nuevo Trabajador'}
          </h2>
          <button onClick={onClose} className="close-btn">
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="modal-body">
            
            {/* Campo Nombre */}
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
            
            {/* Campo Correo */}
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

            {/* Campo Número */}
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
              {isEditMode ? 'Guardar Cambios' : 'Crear Trabajador'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- Componente Principal de la Página ---
export default function TrabajadoresPage() {
  const [trabajadores, setTrabajadores] = useState([]); // Estado para trabajadores
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState(null); 

  useEffect(() => {
    fetchTrabajadores(); // Cargar trabajadores al inicio
  }, []);

  // Función para cargar trabajadores
  const fetchTrabajadores = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: No se pudo conectar a la API.`);
      }
      const data = await response.json();
      setTrabajadores(data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar trabajadores por nombre o correo
  const filteredTrabajadores = useMemo(() => {
    return trabajadores.filter((trabajador) =>
      trabajador.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trabajador.correo.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [trabajadores, searchTerm]);

  // Guardar (Crear o Editar)
  const handleSave = async (formData) => {
    const isEditMode = modal.type === 'edit';
    const url = isEditMode ? `${API_URL}${modal.trabajador.id}/` : API_URL;
    const method = isEditMode ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        // El error más común será correo duplicado
        let errorMsg = JSON.stringify(errorData);
        if (errorData.correo) {
            errorMsg = `Correo: ${errorData.correo[0]}`;
        }
        throw new Error(errorMsg);
      }
      setModal(null);
      fetchTrabajadores(); // Recargar la lista
    } catch (err) {
      console.error(`Error guardando trabajador:`, err);
      setError(`No se pudo guardar: ${err.message}`);
    }
  };

  // Eliminar
  const handleDelete = async (trabajadorId) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este trabajador?")) {
      return;
    }
    try {
      const response = await fetch(`${API_URL}${trabajadorId}/`, {
        method: 'DELETE',
      });
      if (!response.ok && response.status !== 204) {
        throw new Error('No se pudo eliminar el trabajador.');
      }
      fetchTrabajadores(); 
    } catch (err) {
      console.error(`Error eliminando trabajador:`, err);
      setError(err.message);
    }
  };

  // Handlers de UI
  const openModal = (type, trabajador = null) => setModal({ type, trabajador });
  const closeModal = () => setModal(null);
  
  // --- Renderizado del Componente ---
  return (
    <div className="trabajadores-page"> {/* Clase CSS principal */}
      
      <header className="page-header">
        <h1>Gestor de Trabajadores</h1> {/* Título cambiado */}
        <div className="header-actions">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Buscar trabajador..." /* Texto cambiado */
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
        {loading && <p className="loading-message">Cargando trabajadores...</p>}
        {error && <p className="error-message">{error}</p>}
        
        {!loading && !error && (
          <table className="trabajadores-table"> {/* Clase CSS de tabla */}
            <thead>
              <tr>
                {/* Columnas cambiadas */}
                <th>Trabajador</th>
                <th>Número</th>
                <th>Acciones</th>
              </tr>
            </thead>
            
            <tbody>
              {filteredTrabajadores.length > 0 ? (
                filteredTrabajadores.map((trabajador) => (
                  <tr key={trabajador.id}>
                    
                    {/* Celda de Trabajador (Nombre y Correo) */}
                    <td className="trabajador-cell">
                      <span className="trabajador-avatar">
                        <FaUserCircle size={24} />
                      </span>
                      <div className="trabajador-info">
                        <div className="nombre">{trabajador.nombre}</div>
                        <div className="detalle">{trabajador.correo}</div>
                      </div>
                    </td>
                    
                    {/* Celda de Número */}
                    <td>{trabajador.numero || 'N/A'}</td>
                    
                    {/* Celda de Acciones */}
                    <td className="actions-cell">
                      <button
                        onClick={() => openModal('edit', trabajador)}
                        className="action-btn edit-btn"
                        title="Editar"
                      >
                        <FaEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(trabajador.id)}
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
                  <td colSpan="3" className="no-data-message">
                    No se encontraron trabajadores.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* El modal se renderiza aquí */}
      {modal && (
        <TrabajadorModal
          modalData={modal}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}
    </div>
  );
}