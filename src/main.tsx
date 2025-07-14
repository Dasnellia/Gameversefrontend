import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Registro from './pages/autenticacion/Registro';
import IniciarSesion from './pages/autenticacion/IniciarSesion';
import RecuperarContrasena from './pages/autenticacion/RecuperarContrasena';
import ConfirmarContrasena from './pages/autenticacion/ConfirmarContrasena';
import Inicio from './pages/catalogo/Inicio';
import Catalogo from './pages/catalogo/Catalogo';
import CarritoPage from './pages/carrito/Carrito';
import Perfil from './pages/usuario/Perfil';
import Pago from './pages/carrito/Pago';
import Estadisticas from './pages/administrador/Estadisticas';
import MasVendidos from './pages/catalogo/MasVendidos';
import ListadoUsuarios from './pages/administrador/Usuario/ListadoUsuarios';
import Noticias from './pages/administrador/Noticias/ListadoNoticias';
import MejorValorados from './pages/catalogo/MejorValorados';
import ListaJuegos from './pages/administrador/ListaJuegos';

import { UserProvider } from './context/UserContext';
import { CarritoProvider } from './context/CarritoContext'; // 👈 lo importaste, pero no lo estabas usando
import ErrorBoundary from './components/ErrorBoundary';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('No se encontró el elemento #root');

createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <UserProvider>
        <CarritoProvider>
          <BrowserRouter basename="/GVFront">
            <Routes>
              <Route path="/" element={<Navigate to="/IniciarSesion" />} />
              <Route path="/IniciarSesion" element={<IniciarSesion />} />
              <Route path="/Registro" element={<Registro />} />
              <Route path="/RecuperarContrasena" element={<RecuperarContrasena />} />
              <Route path="/ConfirmarContrasena" element={<ConfirmarContrasena />} />
              <Route path="/Inicio" element={<Inicio />} />
              <Route path="/Catalogo" element={<Catalogo />} />
              <Route path="/Carrito" element={<CarritoPage />} />
              <Route path="/Perfil" element={<Perfil />} />
              <Route path="/Pago" element={<Pago />} />
              <Route path="/Estadisticas" element={<Estadisticas />} />
              <Route path="/MasVendidos" element={<MasVendidos />} />
              <Route path="/ListadoUsuarios" element={<ListadoUsuarios />} />
              <Route path="/Noticias" element={<Noticias />} />
              <Route path="/MejorValorados" element={<MejorValorados />} />
              <Route path="/ListaJuegos" element={<ListaJuegos />} />
            </Routes>
          </BrowserRouter>
        </CarritoProvider>
      </UserProvider>
    </ErrorBoundary>
  </StrictMode>
);
