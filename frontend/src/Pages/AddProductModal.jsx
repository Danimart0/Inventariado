// src/components/AddProductModal.js
import React, { useState } from 'react';
import axios from 'axios';
import '../Styles/AddProductModal.css'; 

function AddProductModal({ onClose, onProductAdded }) {
 
    const [nombre, setNombre] = useState('');
    const [idProducto, setIdProducto] = useState('');
    const [precioVenta, setPrecioVenta] = useState('');
    const [stock, setStock] = useState('');
    const [stockMinimo, setStockMinimo] = useState('5'); 
    const [stockMaximo, setStockMaximo] = useState('100'); 
    const [descripcion, setDescripcion] = useState('');
    const [foto, setFoto] = useState(null); 
    
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);


    const handleFileChange = (e) => {
        setFoto(e.target.files[0]);
    };

 
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        // 1. Usar FormData para enviar archivos e info
        const formData = new FormData();
        
        formData.append('nombre', nombre);
        formData.append('precio_venta', parseFloat(precioVenta));
        formData.append('stock', parseInt(stock, 10));
        formData.append('stock_minimo', parseInt(stockMinimo, 10));
        formData.append('stock_maximo', parseInt(stockMaximo, 10));

      
        if (idProducto) {
            formData.append('id_producto', idProducto);
        }
        if (descripcion) {
            formData.append('descripcion', descripcion);
        }
        if (foto) {
            formData.append('foto', foto);
        }

        try {
           
            const response = await axios.post('http://127.0.0.1:8000/api/productos/', formData);
            setLoading(false);
            onProductAdded(response.data); // Llama a la función del padre
            onClose(); 

        } catch (err) {
            setLoading(false);
            console.error("Error al crear el producto:", err.response);
            if (err.response && err.response.data) {
    
                const errors = err.response.data;
                if (errors.nombre) {
                    setError(`Nombre: ${errors.nombre[0]}`);
                } else if (errors.id_producto) {
                    setError(`ID Producto: ${errors.id_producto[0]}`);
                } else {
                    setError('Error de validación. Revisa los campos.');
                }
            } else {
                setError('No se pudo conectar al servidor.');
            }
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2>Agregar Nuevo Producto</h2>
                
                <form onSubmit={handleSubmit}>
                    
                    <div className="form-group">
                        <label>Nombre del Producto *</label>
                        <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                    </div>

                    <div className="form-group">
                        <label>ID Producto (SKU) (Opcional)</label>
                        <input type="text" value={idProducto} onChange={(e) => setIdProducto(e.target.value)} />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Precio de Venta ($) *</label>
                            <input type="number" value={precioVenta} onChange={(e) => setPrecioVenta(e.target.value)} required step="0.01" min="0" />
                        </div>
                        <div className="form-group">
                            <label>Stock Inicial *</label>
                            <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} required step="1" min="0" />
                        </div>
                    </div>
                    
                    <div className="form-row">
                        <div className="form-group">
                            <label>Stock Mínimo *</label>
                            <input type="number" value={stockMinimo} onChange={(e) => setStockMinimo(e.target.value)} required step="1" min="0" />
                        </div>
                        <div className="form-group">
                            <label>Stock Máximo *</label>
                            <input type="number" value={stockMaximo} onChange={(e) => setStockMaximo(e.target.value)} required step="1" min="0" />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Foto (Opcional)</label>
                        <input type="file" onChange={handleFileChange} accept="image/*" />
                    </div>
                    
                    <div className="form-group">
                        <label>Descripción (Opcional)</label>
                        <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)}></textarea>
                    </div>

                    {error && <p className="error-message">{error}</p>}
                    
                    <div className="modal-actions">
                        <button type="button" onClick={onClose} className="btn-cancel" disabled={loading}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn-submit" disabled={loading}>
                            {loading ? 'Guardando...' : 'Guardar Producto'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddProductModal;