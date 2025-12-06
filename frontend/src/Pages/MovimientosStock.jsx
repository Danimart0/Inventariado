import React, { useState, useEffect, useMemo } from 'react'; // Importamos useMemo
import axios from 'axios';
import { FaArrowDown, FaArrowUp, FaSync } from 'react-icons/fa';
import '../Styles/MovimientosStock.css'; 

const API_BASE_URL = 'http://127.0.0.1:8000';

// --- Componente del Historial (Modificado) ---
// Ahora recibe 'productos' para poder "traducir" los IDs
function HistorialMovimientos({ historial, loading, fetchHistorial, productos }) {
  
 
  // Creamos un "mapa" para buscar nombres de productos por ID.
  // Esto es mucho más eficiente que buscar en el array cada vez.
  // Se recalcula solo si la lista de 'productos' cambia.
  const productoMap = useMemo(() => {
    
    return new Map(productos.map(p => [p.id, p.nombre]));
  }, [productos]);
  // --- FIN DE LÓGICA CLAVE ---

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };
  
  return (
    <div className="historial-container">
      <div className="historial-header">
        <h3>Historial de Movimientos</h3>
        <button onClick={fetchHistorial} disabled={loading} className="refresh-btn">
          <FaSync className={loading ? 'spinning' : ''} />
          Refrescar
        </button>
      </div>
      
      {loading && <p>Cargando historial...</p>}
      
      {!loading && (
        <table className="historial-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Tipo</th>
              <th>Cantidad</th>
              <th>Nota</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {historial.length > 0 ? (
              historial.map(mov => (
                <tr key={mov.id}>
                  <td>
                    {/* Aquí usamos el 'productoMap' para buscar el nombre.
                      'mov.producto' es el ID (ej: 5)
                      'productoMap.get(mov.producto)' nos da el nombre (ej: 'Coca-Cola')
                    */}
                    {productoMap.get(mov.producto) || `ID: ${mov.producto}`}
                  </td>
                  <td>
                    <span className={`tipo-badge ${mov.tipo === 'entrada' ? 'tipo-entrada' : 'tipo-salida'}`}>
                      {mov.tipo}
                    </span>
                  </td>
                  <td className={mov.tipo === 'entrada' ? 'text-entrada' : 'text-salida'}>
                    {mov.tipo === 'entrada' ? '+' : '-'}{mov.cantidad}
                  </td>
                  <td>{mov.nota || 'N/A'}</td>
                  <td>{formatDate(mov.fecha)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No hay movimientos registrados.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}


// --- Componente Principal (MovimientosStock) ---
export default function MovimientosStock() {
    // Estados de productos (para el dropdown)
    const [productos, setProductos] = useState([]);
    const [loadingProductos, setLoadingProductos] = useState(true);
    const [error, setError] = useState(null);

    // Estados del formulario
    const [selectedProducto, setSelectedProducto] = useState('');
    const [tipoMovimiento, setTipoMovimiento] = useState('entrada');
    const [cantidad, setCantidad] = useState(1);
    const [nota, setNota] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedback, setFeedback] = useState(null);

    // Estados del historial
    const [historial, setHistorial] = useState([]);
    const [loadingHistorial, setLoadingHistorial] = useState(true);

    // Carga la lista de productos
    const fetchProductos = async () => {
        setLoadingProductos(true);
        setError(null);
        try {
            const response = await axios.get(`${API_BASE_URL}/api/productos/`);
            setProductos(response.data);
        } catch (error) {
            console.error("Error al cargar productos:", error);
            setError("No se pudieron cargar los productos.");
        } finally {
            setLoadingProductos(false);
        }
    };

    // Carga el historial de movimientos
    const fetchHistorial = async () => {
        setLoadingHistorial(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/api/movimientos/`);
            setHistorial(response.data); 
        } catch (error) {
            console.error("Error al cargar historial:", error);
        } finally {
            setLoadingHistorial(false);
        }
    };

    // Carga inicial de datos
    useEffect(() => {
        fetchProductos();
        fetchHistorial();
    }, []); 

    // Envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedProducto || cantidad <= 0) {
            setFeedback({ type: 'error', message: 'Por favor, selecciona un producto y una cantidad válida.' });
            return;
        }

        setIsSubmitting(true);
        setFeedback(null);

        const movimientoData = {
            producto: selectedProducto, // Envía el ID
            tipo: tipoMovimiento,
            cantidad: parseInt(cantidad, 10),
            nota: nota,
        };

        try {
            await axios.post(`${API_BASE_URL}/api/movimientos/`, movimientoData);
            setFeedback({ type: 'success', message: `¡Movimiento de ${tipoMovimiento} registrado con éxito!` });
            
            // Limpiar formulario
            setSelectedProducto('');
            setCantidad(1);
            setNota('');
            
            // Refrescar AMBAS listas
            fetchHistorial();
            fetchProductos(); // Para que el stock en el dropdown se actualice

        } catch (error) {
            console.error("Error al registrar movimiento:", error.response);
            let errorMessage = 'Hubo un error al guardar. Intenta de nuevo.';
            if (error.response && error.response.data) {
                const errors = error.response.data;
                if (errors.non_field_errors) {
                    errorMessage = errors.non_field_errors[0]; 
                } else if (typeof errors === 'object') {
                    errorMessage = Object.values(errors).flat().join(' ');
                }
            }
            setFeedback({ type: 'error', message: errorMessage });
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- Renderizado ---

    if (loadingProductos) {
        return <div className="movimientos-page"><h1>Cargando productos...</h1></div>;
    }

    if (error) {
        return <div className="movimientos-page error-message"><h1>{error}</h1></div>;
    }

    return (
        <div className="movimientos-page">
            <header className="page-header">
                <h1>Registrar Movimiento de Stock</h1>
            </header>

            {/* --- Formulario de Registro (sin cambios) --- */}
            <div className="movimiento-form-container">
                <form onSubmit={handleSubmit} className="movimiento-form">
                    {feedback && (
                        <div className={`feedback-message ${feedback.type}`}>
                            {feedback.message}
                        </div>
                    )}
                    <div className="form-group">
                        <label htmlFor="producto">Producto</label>
                        <select 
                            id="producto" 
                            value={selectedProducto} 
                            onChange={(e) => setSelectedProducto(e.target.value)}
                            required
                        >
                            <option value="" disabled>-- Selecciona un producto --</option>
                            {productos.map(prod => (
                                <option key={prod.id} value={prod.id}>
                                    {prod.nombre} (Stock actual: {prod.stock})
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="form-group">
                        <label>Tipo de Movimiento</label>
                        <div className="tipo-movimiento-options">
                            <label className={`radio-option ${tipoMovimiento === 'entrada' ? 'active' : ''}`}>
                                <input type="radio" name="tipoMovimiento" value="entrada" checked={tipoMovimiento === 'entrada'} onChange={(e) => setTipoMovimiento(e.target.value)} />
                                <FaArrowDown /> Entrada
                            </label>
                            <label className={`radio-option ${tipoMovimiento === 'salida' ? 'active' : ''}`}>
                                <input type="radio" name="tipoMovimiento" value="salida" checked={tipoMovimiento === 'salida'} onChange={(e) => setTipoMovimiento(e.target.value)} />
                                <FaArrowUp /> Salida
                            </label>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="cantidad">Cantidad</label>
                        <input type="number" id="cantidad" value={cantidad} onChange={(e) => setCantidad(e.target.value)} min="1" required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="nota">Nota (Opcional)</label>
                        <textarea id="nota" rows="3" value={nota} onChange={(e) => setNota(e.target.value)} placeholder="Ej: Compra a proveedor X, Ajuste..." />
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="submit-btn" disabled={isSubmitting}>
                            {isSubmitting ? 'Guardando...' : 'Registrar Movimiento'}
                        </button>
                    </div>
                </form>
            </div>

            {/* --- Contenedor del Historial (Modificado) --- */}
            <HistorialMovimientos 
                historial={historial}
                loading={loadingHistorial}
                fetchHistorial={fetchHistorial}
                productos={productos} /* ¡Le pasamos la lista de productos! */
            />

        </div>
    );
}