import React, { useState } from 'react';
import LogoRecuperar from '../../imagenes/LogoRecuperarContraseña.png';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
import { URL_BACKEND } from '../../config';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/RecuperarContrasena.css';

function RecuperarContrasena() {
  const [correo, setCorreo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [paso, setPaso] = useState<'solicitar' | 'restablecer'>('solicitar');
  const [token, setToken] = useState('');
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');

  const navegar = useNavigate();

  const handleSolicitarRestablecimiento = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    try {
      const res = await fetch(`${URL_BACKEND}/api/usuarios/enviar-token-contrasena`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Error al solicitar restablecimiento');
      } else {
        setMensaje(data.mensaje || 'Revisa tu correo para continuar con el restablecimiento.');
        setPaso('restablecer');
      }
    } catch (err) {
      setError('Error al conectar con el servidor.');
    }
  };

  const handleRestablecerContrasena = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    if (nuevaContrasena !== confirmarContrasena) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      const res = await fetch(`${URL_BACKEND}/api/usuarios/cambiar-contrasena`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, nuevaContrasena }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Error al cambiar la contraseña');
      } else {
        setMensaje(data.mensaje || 'Contraseña actualizada correctamente.');
        setTimeout(() => navegar('/IniciarSesion'), 3000);
      }
    } catch (err) {
      setError('Error al conectar con el servidor.');
    }
  };

  return (
    <div className="recuperar-contenedor">
      <div className="fondo-animado"></div>
      <div className="contenedor-principal">
        <div className="logo-container">
          <img src={LogoRecuperar} alt="Logo Recuperar" className="logo" />
        </div>

        <h2 className="titulo-principal">Restablecer contraseña</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        {mensaje && <Alert variant="info">{mensaje}</Alert>}

        {paso === 'solicitar' && (
          <Form onSubmit={handleSolicitarRestablecimiento}>
            <p className="descripcion">Ingresa tu correo para recibir el código de verificación:</p>
            <Form.Group className="mb-3">
              <Form.Control
                type="email"
                placeholder="Correo electrónico"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
              />
            </Form.Group>
            <Button type="submit" className="boton-enviar">Enviar código</Button>
          </Form>
        )}

        {paso === 'restablecer' && (
          <Form onSubmit={handleRestablecerContrasena}>
            <p className="descripcion">Ingresa el código recibido y tu nueva contraseña:</p>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="Código de verificación (token)"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="password"
                placeholder="Nueva contraseña"
                value={nuevaContrasena}
                onChange={(e) => setNuevaContrasena(e.target.value)}
                required
                minLength={8}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="password"
                placeholder="Confirmar contraseña"
                value={confirmarContrasena}
                onChange={(e) => setConfirmarContrasena(e.target.value)}
                required
              />
            </Form.Group>
            <Button type="submit" className="boton-enviar">Restablecer</Button>
          </Form>
        )}
      </div>
    </div>
  );
}

export default RecuperarContrasena;
