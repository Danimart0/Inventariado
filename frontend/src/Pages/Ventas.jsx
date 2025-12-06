import React, { useEffect, useState } from "react";
import '../Styles/Ventas.css';
export default function Ventas() {
  const [ventas, setVentas] = useState([]);

  
  useEffect(() => {
    const data = [
      {
        id: 1,
        cliente: "JUANITO",
        productos: [
          { nombre: "X10 POLLOS CRUDOS", precio: 1000 },
          { nombre: "X4 REJA DE HUEVOS", precio: 120 },
          { nombre: "X2 VARILLAS", precio: 300 },
        ],
      },
      {
        id: 2,
        cliente: "PEDRITO",
        productos: [
          { nombre: "X8 POLLOS CRUDOS", precio: 800 },
          { nombre: "X1 REJA DE HUEVOS", precio: 30 },
        ],
      },
      {
        id: 3,
        cliente: "MARÍA",
        productos: [
          { nombre: "X12 POLLOS CRUDOS", precio: 1200 },
          { nombre: "X5 REJAS DE HUEVOS", precio: 150 },
          { nombre: "X3 VARILLAS", precio: 450 },
        ],
      },
    ];
    setVentas(data);
  }, []);

  return (
    <div className="ventas-container">
      

      <main className="main-content">
        <header className="ventas-header">
          <h2>Ventas del día</h2>
          <div className="empleado-box">
            Le atiende: <strong>Nombre del empleado</strong>
          </div>
        </header>

        <div className="ventas-toolbar">
          <input type="text" placeholder="🔍 Buscar orden..." />
          <button>Crear PDF ⬇</button>
        </div>

        <div className="ventas-grid">
          {ventas.map((venta) => {
            const total = venta.productos.reduce((sum, p) => sum + p.precio, 0);
            return (
              <div key={venta.id} className="venta-card">
                <div className="venta-placeholder">🛒</div>
                <h3>ORDEN #{venta.id}</h3>
                <p>
                  <strong>CLIENTE:</strong> {venta.cliente}
                </p>
                <div className="productos">
                  {venta.productos.map((p, i) => (
                    <p key={i}>
                      {p.nombre} <span>${p.precio}</span>
                    </p>
                  ))}
                </div>
                <h4>TOTAL: ${total}</h4>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
