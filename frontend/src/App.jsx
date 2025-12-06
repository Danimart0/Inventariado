import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./Components/Layouts/MainLayout";
import InventoryPage from "./Pages/InventoryPage";
import Clientes from "./Pages/Clientes";
import TrabajadoresPage from "./Pages/TrabajadoresPage";
import Login from "./Pages/login"; 
import Ventas from "./Pages/Ventas"; 
import ReporteSaldos from "./Pages/ReporteSaldos"; 
import MovimientosStock from "./Pages/MovimientosStock"; 
import CajerosManager from "./Pages/CajerosManager"; 



const SalesPage = () => <h2>Página de Ventas</h2>;




const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        >
          <Route path="/" element={<Navigate to="/inventario" replace />} />
          <Route path="/ventas" element={<Ventas />} />
          <Route path="/inventario" element={<InventoryPage />} />
          <Route path="/cajeros" element={< CajerosManager/>} />
          <Route path="/Movimientos" element={<MovimientosStock/>} />
          <Route path="/clientes" element={<Clientes />} />
            <Route path="/Reportes" element={<ReporteSaldos />} />
          <Route path="/trabajadores" element={<TrabajadoresPage />} />
       
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
