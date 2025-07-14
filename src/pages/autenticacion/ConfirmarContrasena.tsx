import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import LogoRecuperar from '../../imagenes/LogoRecuperarContraseña.png';
import { URL_BACKEND } from '../../config';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/ConfirmarContrasena.css';

function ConfirmarContrasena() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [codigo, setCodigo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  // Verificación automática por URL
  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      fetch(`${URL_BACKEND}/api/usuarios/verificar/${token}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.mensaje) {
            setMensaje(data.mensaje);
            setTimeout(() => navigate('/IniciarSesion'), 3000);
          } else {
            setError(data.error || 'Error al verificar la cuenta.');
          }
        })
        .catch(() => {
          setError('Error en la verificación automática.');
        });
    }
  }, [searchParams, navigate]);

  // Verificación manual
  const validarManual = () => {
    if (!codigo.trim()) {
      setError('Por favor, ingresa el código de verificación.');
      return;
    }

    fetch(`${URL_BACKEND}/api/usuarios/verificar/${codigo}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.mensaje) {
          setMensaje(data.mensaje);
          setTimeout(() => navigate('/IniciarSesion'), 3000);
        } else {
          setError(data.error || 'Token inválido.');
        }
      })
      .catch(() => {
        setError('Error al intentar verificar el código.');
      });
  };

  return (
    <div className="recuperar-contenedor">
      {/* Fondo animado */}
      <div className="fondo-animado"></div>

      {/* Contenido principal */}
      <div className="contenedor-principal">
        {/* Logo */}
        <div className="logo-container">
          <img src={LogoRecuperar} alt="Game Verse Logo" className="logo" />
        </div>

        {/* Título */}
        <h2 className="titulo-principal">Confirme su identidad</h2>

        {/* Mensaje de estado */}
        {mensaje && <div className="alert alert-success">{mensaje}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        {/* Descripción */}
        <p className="descripcion">
          Para confirmar su registro, se envió un correo con un código de verificación. Revisa tu bandeja de entrada.
        </p>

        <p className="descripcion">Ingrese el código de verificación:</p>

        {/* Formulario */}
        <form id="div5" onSubmit={(e) => e.preventDefault()}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Ingrese el código"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              required
            />
          </div>
        </form>

        {/* Botón */}
        <button className="boton-enviar" onClick={validarManual}>
          Validar Código
        </button>
      </div>
    </div>
  );
}

export default ConfirmarContrasena;
