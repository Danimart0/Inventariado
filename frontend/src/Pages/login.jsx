import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../Styles/login.css';
import logoImage from "../assets/lupita.png";


export default function Login() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (user === "admin" && password === "admin") {
      localStorage.setItem("isAuthenticated", "true");
      navigate("/inventario");
    } else {
      setError("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div className="login-container">

      {/* 👇 Imagen usando la importación */}
      <img src={logoImage} alt="logo" className="login-logo" />

      <div className="login-box">
        <h2>Comenzar Nuevo turno</h2>

        <form onSubmit={handleSubmit}>
          <label>Usuario</label>
          <input
            type="text"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />

          <label>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="login-buttons">
            <button type="submit">Acceder</button>
            <button type="button" onClick={() => window.location.reload()}>
              Salir
            </button>
          </div>
        </form>

        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}
