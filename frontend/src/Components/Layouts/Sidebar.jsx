import React from 'react';
import { NavLink } from 'react-router-dom';
import '../../Styles/Sidebar.css';

import logoImage from '../../assets/lupita.png'; 


import { 
    FaShoppingCart, 
    FaBox, 
    FaCashRegister, 
    FaShoppingBag, 
    FaBars,
    FaUsers,      
    FaUserTie,    
    FaChartBar    
} from 'react-icons/fa'; 


function Sidebar({ isOpen, toggleSidebar }) {
    
    const sidebarClassName = isOpen ? "sidebar open" : "sidebar";

    return (
        <div className={sidebarClassName}>
            <div className="sidebar-header">
               <img src={logoImage} alt="Logo de la empresa" className="logo-image" />
            </div>

            <nav className="nav-menu">
                <NavLink to="/ventas" className="nav-item">
                    <FaShoppingCart className="nav-icon" />
                    <span className="nav-text">Ventas</span>
                </NavLink>
                <NavLink to="/cajeros" className="nav-item">
                    <FaCashRegister className="nav-icon" />
                    <span className="nav-text">Cajeros</span>
                </NavLink>
                <NavLink to="/inventario" className="nav-item">
                    <FaBox className="nav-icon" />
                    <span className="nav-text">Inventario</span>
                </NavLink>
                <NavLink to="/Movimientos" className="nav-item">
                    <FaShoppingBag className="nav-icon" />
                    <span className="nav-text">Movimientos</span>
                </NavLink>

                <NavLink to="/clientes" className="nav-item">
                    <FaUsers className="nav-icon" />
                    <span className="nav-text">Clientes</span>
                </NavLink>
                
                <NavLink to="/trabajadores" className="nav-item">
                    <FaUserTie className="nav-icon" />
                    <span className="nav-text">Trabajadores</span>
                </NavLink>

                <NavLink to="/reportes" className="nav-item">
                    <FaChartBar className="nav-icon" />
                    <span className="nav-text">Reportes</span>
                </NavLink>
            </nav>
        </div>
    );
}

export default Sidebar;