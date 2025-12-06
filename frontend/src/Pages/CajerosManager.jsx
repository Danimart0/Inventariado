import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Styles/CajerosManager.css'; 

const API_URL = 'http://127.0.0.1:8000/api/cajeros/';

const CajerosManager = () => {
  const [cajeros, setCajeros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    codigo_empleado: '',
    telefono: '',
    email: '',
    activo: true
  });

  // Estado para saber si estamos editando (guarda el ID del cajero)
  const [editingId, setEditingId] = useState(null);

  // --- 1. Cargar Datos (GET) ---
  const fetchCajeros = async () => {
    try {
      const response = await axios.get(API_URL);
      setCajeros(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error al conectar con la API');
      setLoading(false);
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCajeros();
  }, []);

  // --- 2. Manejar Inputs del Formulario ---
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // --- 3. Enviar Datos (POST o PUT) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // MODO EDICIÓN (PUT)
        await axios.put(`${API_URL}${editingId}/`, formData);
        alert('Cajero actualizado correctamente');
      } else {
        // MODO CREACIÓN (POST)
        await axios.post(API_URL, formData);
        alert('Cajero creado correctamente');
      }
      resetForm();
      fetchCajeros(); // Recargar lista
    } catch (err) {
      console.error(err);
      alert('Error al guardar. Verifica que el Código de Empleado no esté repetido.');
    }
  };

  // --- 4. Eliminar (DELETE) ---
  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este cajero?')) {
      try {
        await axios.delete(`${API_URL}${id}/`);
        fetchCajeros(); // Recargar lista
      } catch (err) {
        console.error(err);
        alert('Error al eliminar');
      }
    }
  };

  // --- 5. Preparar Edición ---
  const handleEdit = (cajero) => {
    setEditingId(cajero.id);
    setFormData({
      nombre: cajero.nombre,
      apellidos: cajero.apellidos,
      codigo_empleado: cajero.codigo_empleado,
      telefono: cajero.telefono || '',
      email: cajero.email || '',
      activo: cajero.activo
    });
    // Scroll suave hacia el formulario
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- 6. Limpiar Formulario ---
  const resetForm = () => {
    setEditingId(null);
    setFormData({
      nombre: '',
      apellidos: '',
      codigo_empleado: '',
      telefono: '',
      email: '',
      activo: true
    });
  };

  if (loading) return <div className="loader">Cargando cajeros...</div>;

  return (
    <div className="container">
      <h1 className="title">Gestión de Cajeros</h1>

      {/* --- FORMULARIO --- */}
      <div className="form-card">
        <h2>{editingId ? '✏️ Editar Cajero' : '➕ Nuevo Cajero'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="apellidos"
              placeholder="Apellidos"
              value={formData.apellidos}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="codigo_empleado"
              placeholder="Código Empleado (Único)"
              value={formData.codigo_empleado}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="telefono"
              placeholder="Teléfono"
              value={formData.telefono}
              onChange={handleInputChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Correo Electrónico"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="checkbox-container">
            <label>
              <input
                type="checkbox"
                name="activo"
                checked={formData.activo}
                onChange={handleInputChange}
              />
              Cajero Activo
            </label>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editingId ? 'Actualizar' : 'Guardar'}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="btn btn-secondary">
                Cancelar Edición
              </button>
            )}
          </div>
        </form>
      </div>

      {/* --- LISTA DE TARJETAS --- */}
      <div className="cards-grid">
        {cajeros.map((cajero) => (
          <div key={cajero.id} className={`card ${!cajero.activo ? 'inactive' : ''}`}>
            <div className="card-header">
              <h3>{cajero.nombre} {cajero.apellidos}</h3>
              <span className="badge">{cajero.codigo_empleado}</span>
            </div>
            
            <div className="card-body">
              <p><strong>📞:</strong> {cajero.telefono || 'N/A'}</p>
              <p><strong>📧:</strong> {cajero.email || 'N/A'}</p>
              <p><strong>Estado:</strong> {cajero.activo ? '🟢 Activo' : '🔴 Inactivo'}</p>
            </div>

            <div className="card-footer">
              <button onClick={() => handleEdit(cajero)} className="btn btn-edit">
                Editar
              </button>
              <button onClick={() => handleDelete(cajero.id)} className="btn btn-delete">
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CajerosManager;