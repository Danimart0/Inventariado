import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { FaSearch, FaUserCircle } from 'react-icons/fa';
import '../Styles/ReporteSaldos.css'; 

const API_BASE_URL = 'http://localhost:8000';
const API_URL = `${API_BASE_URL}/api/clientes/`;

export default function ReporteSaldos() {
  const [clientes, setClientes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchClientes();
  }, []);
    
  const fetchClientes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_URL);
      setClientes(response.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError('No se pudo conectar con la API');
    } finally {
      setLoading(false);
    }
  };

  const filteredClientes = useMemo(() => {
    return clientes.filter((cliente) =>
      cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [clientes, searchTerm]);

  const totalDeuda = useMemo(() => {
    return filteredClientes.reduce(
      (sum, cliente) => sum + (parseFloat(cliente.saldo_actual) || 0),
      0
    );
  }, [filteredClientes]);

  const formatCurrency = (amount) => {
    const numericAmount = parseFloat(amount) || 0;
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(numericAmount);
  };

  const handleAceptar = () => {
    alert("Función 'Aceptar' no implementada.");
  };

  return (
    <div className="reporte-saldos-container">
      <h3>Reporte de saldos</h3>

      <div className="reporte-search-bar">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Filtrar búsqueda"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="reporte-table-container">
        {loading && <p className="loading-message">Cargando...</p>}
        {error && <p className="error-message">{error}</p>}

        {!loading && !error && (
          <table className="reporte-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}></th>
                <th>Id</th>
                <th>Nombre</th>
                <th>Deuda Actual</th>
              </tr>
            </thead>
            <tbody>
              {filteredClientes.length > 0 ? (
                filteredClientes.map((cliente) => (
                  <tr key={cliente.id}>
                    <td>
                      <FaUserCircle size={20} className="user-icon" />
                    </td>
                    <td>{cliente.id}</td>
                    <td>{cliente.nombre}</td>
                    <td>{formatCurrency(cliente.saldo_actual)}</td>
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
            {filteredClientes.length > 0 && (
              <tfoot>
                <tr>
                  <td colSpan="3" className="total-label">
                    Total
                  </td>
                  <td className="total-amount">
                    {formatCurrency(totalDeuda)}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        )}
      </div>

      <div className="reporte-footer">
        <button onClick={handleAceptar} className="btn-aceptar">
          Aceptar
        </button>
      </div>
    </div>
  );
}
