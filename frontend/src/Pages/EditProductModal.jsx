// src/components/EditProductModal.js

import React, { useState } from 'react';
import axios from 'axios';
import '../Styles/AddProductModal.css'; 

function EditProductModal({ product, onClose, onProductUpdated }) {

    const [nombre, setNombre] = useState(product.nombre);
    const [idProducto, setIdProducto] = useState(product.id_producto || '');
    const [precioVenta, setPrecioVenta] = useState(product.precio_venta);
    const [stock, setStock] = useState(product.stock);
    const [stockMinimo, setStockMinimo] = useState(product.stock_minimo);
    const [stockMaximo, setStockMaximo] = useState(product.stock_maximo);
    const [descripcion, setDescripcion] = useState(product.descripcion || '');
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

        const formData = new FormData();
        
        formData.append('nombre', nombre);
        formData.append('precio_venta', parseFloat(precioVenta));
        formData.append('stock', parseInt(stock, 10));
        formData.append('stock_minimo', parseInt(stockMinimo, 10));
        formData.append('stock_maximo', parseInt(stockMaximo, 10));
        formData.append('id_producto', idProducto);
        formData.append('descripcion', descripcion);
        
    
        if (foto) {
            formData.append('foto', foto);
        }

        try {
        
            const response = await axios.put(
                `http://127.0.0.1:8000/api/productos/${product.id}/`, 
                formData
            );

            setLoading(false);
            onProductUpdated(response.data);
            onClose(); 

        } catch (err) {
            setLoading(false);
            console.error("Error al actualizar el producto:", err.response);
            if (err.response && err.response.data) {
                const errors = err.response.data;
                if (errors.nombre) setError(`Nombre: ${errors.nombre[0]}`);
                else if (errors.id_producto) setError(`ID Producto: ${errors.id_producto[0]}`);
                else setError('Error de validación. Revisa los campos.');
            } else {
                setError('No se pudo conectar al servidor.');
            }
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                {/* 5. EL TÍTULO ES DIFERENTE */}
                <h2>Editar Producto</h2>
                
                <form onSubmit={handleSubmit}>
                    
                    <div className="form-group">
                        <label>Nombre del Producto *</label>
                        {/* 6. LOS INPUTS USAN LOS ESTADOS LOCALES */}
                        <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                    </div>

                    <div className="form-group">
                        <label>ID Producto (SKU)</label>
                        <input type="text" value={idProducto} onChange={(e) => setIdProducto(e.target.value)} />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Precio de Venta ($) *</label>
                            <input type="number" value={precioVenta} onChange={(e) => setPrecioVenta(e.target.value)} required step="0.01" min="0" />
                        </div>
                        <div className="form-group">
                            <label>Stock *</label>
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
                        <label>Cambiar Foto (Opcional)</label>
                        <input type="file" onChange={handleFileChange} accept="image/*" />
                    </div>
                    
                    <div className="form-group">
                        <label>Descripción</label>
                        <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)}></textarea>
                    </div>

                    {error && <p className="error-message">{error}</p>}
                    
                    <div className="modal-actions">
                        <button type="button" onClick={onClose} className="btn-cancel" disabled={loading}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn-submit" disabled={loading}>
                            {loading ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditProductModal;