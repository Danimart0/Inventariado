import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch, FaPlusCircle, FaEllipsisV, FaTrash } from 'react-icons/fa';
import '../Styles/InventoryPage.css'; // Asegúrate de que la ruta a tu CSS sea correcta
import AddProductModal from './AddProductModal';
import EditProductModal from './EditProductModal';

const API_BASE_URL = 'http://127.0.0.1:8000';

function InventoryPage() {
    const [inventoryData, setInventoryData] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Estados para Modales
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null); 

    // --- LÓGICA DE STOCK (SEMÁFORO) ---
    const getStockConfig = (stock) => {
        // 1. STOCK BAJO (< 50): Rojo y barra proporcional
        if (stock < 50) {
            // Calcula cuánto llenar de la barra roja (ej. 25 es la mitad de 50)
            const percentage = (stock / 50) * 100;
            return { 
                color: 'red', 
                width: `${Math.max(percentage, 10)}%` // Mínimo 10% para que se vea
            };
        } 
        
        // 2. STOCK REGULAR (50 a 99): Amarillo y barra a medias (50%)
        else if (stock >= 50 && stock < 100) {
            return { 
                color: 'yellow', 
                width: '50%' 
            };
        } 
        
        // 3. STOCK ALTO (>= 100): Verde y barra entera (100%)
        else {
            return { 
                color: 'green', 
                width: '100%' 
            };
        }
    };

    // --- FORMATEAR DATOS ---
    const formatProductData = (item) => {
        const fullImageUrl = (item.imageUrl && item.imageUrl.startsWith('/'))
            ? `${API_BASE_URL}${item.imageUrl}`
            : item.imageUrl || 'https://via.placeholder.com/52';

        // Obtenemos la configuración visual (color y ancho)
        const stockStatus = getStockConfig(item.stock);

        return {
            ...item, 
            id: item.id,
            productName: item.nombre || 'Producto sin nombre',
            imageUrl: fullImageUrl,
            lastRegistry: new Date(item.ultimo_registro).toLocaleDateString('es-MX'),
            price: item.precio_venta,
            
            // Aplicamos la lógica visual calculada arriba
            stockColor: stockStatus.color,
            stockPercentage: stockStatus.width,
            
            idProducto: item.id_producto || `N/A-${item.id}`
        };
    };

    // --- CARGAR INVENTARIO (GET) ---
    const fetchInventory = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/api/productos/`);
            const formattedData = response.data.map(formatProductData);
            setInventoryData(formattedData); 
        } catch (error) {
            console.error("Error al cargar el inventario:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchInventory();
    }, []);

    // --- MANEJAR CAMBIOS ---
    const handleProductAdded = (newProduct) => {
        const formattedProduct = formatProductData(newProduct);
        setInventoryData(prevData => [formattedProduct, ...prevData]);
    };

    const handleProductUpdated = (updatedProduct) => {
        const formattedProduct = formatProductData(updatedProduct);
        setInventoryData(prevData => 
            prevData.map(item => item.id === formattedProduct.id ? formattedProduct : item)
        );
        setEditingProduct(null); 
    };

    // --- ELIMINAR (DELETE) ---
    const handleDeleteProduct = async (id) => {
        const confirmDelete = window.confirm("¿Estás seguro de que quieres eliminar este producto?");
        
        if (confirmDelete) {
            try {
                await axios.delete(`${API_BASE_URL}/api/productos/${id}/`);
                setInventoryData(prevData => prevData.filter(item => item.id !== id));
                // Aquí podrías poner una alerta de éxito si quisieras
            } catch (error) {
                console.error("Error al eliminar el producto:", error);
                alert("Hubo un error al intentar eliminar el producto.");
            }
        }
    };

    if (loading) return <div className="loader-container">Cargando inventario...</div>;

    return (
        <div className="inventory-page">
            {/* CABECERA */}
            <header className="page-header">
                <h1>Inventario</h1>
                <div className="header-actions">
                    <div className="search-bar">
                        <FaSearch className="search-icon" />
                        <input type="text" placeholder="Buscar..." />
                    </div>
            
                    <button className="add-button" onClick={() => setIsAddModalOpen(true)}>
                        Agregar Producto <FaPlusCircle />
                    </button>
                </div>
            </header>

            {/* TABLA */}
            <div className="table-container">
                <table className="inventory-table">
                    <thead>
                        <tr>
                            <th><input type="checkbox" /></th>
                            <th>PRODUCTO</th>
                            <th>ID PRODUCTO</th>
                            <th>ÚLTIMO REGISTRO</th>
                            <th>STOCK</th>
                            <th>STOCK MÍN.</th>
                            <th>STOCK MÁX.</th>
                            <th>PRECIO</th>
                            <th>ACCIONES</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inventoryData.map((item) => (
                            <tr key={item.id}>
                                <td><input type="checkbox" /></td>
                                
                                {/* 1. Producto (Imagen + Nombre) */}
                                <td className="product-cell">
                                    <img src={item.imageUrl} alt={item.productName} className="product-image" />
                                    <span className="product-name">{item.productName}</span>
                                </td>
                                
                                {/* 2. Datos simples */}
                                <td>{item.idProducto}</td>
                                <td>{item.lastRegistry}</td>
                                
                                {/* 3. Stock Dinámico (Barra + Número) */}
                                <td>
                                    <div className="stock-cell">
                                        <div className="stock-bar-container">
                                            <div 
                                                className={`stock-bar-fill ${item.stockColor}`}
                                                style={{ width: item.stockPercentage }} 
                                            ></div>
                                        </div>
                                        <span className="stock-number">{item.stock}</span>
                                    </div>
                                </td>
                                
                                <td>{item.stock_minimo}</td>
                                <td>{item.stock_maximo}</td>
                                
                                <td className="price-text">${item.price}</td>
                                
                                {/* 4. Acciones (Editar / Eliminar) */}
                                <td>
                                    <div className="actions-cell">
                                        <button 
                                            className="action-btn edit" 
                                            onClick={() => setEditingProduct(item)}
                                            title="Editar"
                                        >
                                            <FaEllipsisV />
                                        </button>
                                        
                                        <button 
                                            className="action-btn delete" 
                                            onClick={() => handleDeleteProduct(item.id)}
                                            title="Eliminar"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* MODALES */}
            {isAddModalOpen && (
                <AddProductModal 
                    onClose={() => setIsAddModalOpen(false)} 
                    onProductAdded={handleProductAdded}
                />
            )}
        
            {editingProduct && (
                <EditProductModal
                    product={editingProduct}
                    onClose={() => setEditingProduct(null)}
                    onProductUpdated={handleProductUpdated}
                />
            )}
        </div>
    );
};

export default InventoryPage;