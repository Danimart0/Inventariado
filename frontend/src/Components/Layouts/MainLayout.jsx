import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import '../../Styles/MainLayout.css';

function MainLayout() {

    const [isSidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="main-layout">
            <Sidebar 
                isOpen={isSidebarOpen} 
                toggleSidebar={toggleSidebar} 
            />

            <div className="main-content-area">
               
                <Header userName="Daniel Martínez" />
                
                
                <div className="page-content">
                    <Outlet /> 
                </div>
            </div>
        </div>
    );
}

export default MainLayout;