import { useState } from "react";
import { Link } from 'react-router-dom';
import AdminLogo from '../../imagenes/LogoPrincipal.png';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle'; 
import 'bootstrap-icons/font/bootstrap-icons.css';

import '../../css/Barra.css';

const NavBarra = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <>
      <div className={`sidebar ${collapsed ? 'collapsed' : ''}`} id="sidebar">
        <div className="sidebar-header position-relative">
        <div className="d-flex flex-column align-items-center"> 
          <img src={AdminLogo} className="logo-principal" alt="Admin Logo" />
          {!collapsed && <span className="mt-2">Administrador</span>} 
        </div>
        <button className="toggle-btn" onClick={toggleSidebar}>
          <i className={`bi ${collapsed ? 'bi-chevron-right' : 'bi-chevron-left'}`}></i>
        </button>
      </div>
        
        {/* Sección de Usuarios */}
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link className="nav-link active" to="/ListadoUsuarios">
              <i className="bi bi-person-circle texto-rojo"></i>
              {!collapsed &&
                <span className="sidebar-text texto-rojo">Usuarios</span>}
            </Link>
          </li>

          {/* Sección de Juegos con dropdown */}
          <li className="nav-item">
            <Link className="nav-link" to="/ListaJuegos">
              <i className="bi bi-controller me-2"></i>
              {!collapsed && <span className="sidebar-text texto-rojo">Juegos</span>}
            </Link>
          </li>
          
          {/* Sección de Estadisticas */}
          <li className="nav-item">
            <Link className="nav-link active" to="/Estadisticas">
              <i className="bi bi-speedometer2 me-2"></i>
              {!collapsed && 
              <span className="sidebar-text texto-rojo">Estadísticas</span>}
            </Link>
          </li>
          
          {/* Sección de Noticias */}
          <li className="nav-item">
            <Link className="nav-link active" to="/Noticias">
              <i className="bi bi-newspaper texto-rojo"></i>
              {!collapsed && 
              <span className="sidebar-text texto-rojo">Noticias</span>}
            </Link>
          </li>
        </ul>
      
          {/* Log Out */}
          <div className="mb-4 mt-auto">
            <hr/>
              <div className="nav-item">
                <Link className="nav-link active" to="/IniciarSesion">
                  <i className="bi bi-door-open-fill"></i>
                  {!collapsed && <span className="sidebar-text">Log Out</span>}
                </Link>
              </div>
          </div> 
      </div>
    </>
  );
};

export default NavBarra;