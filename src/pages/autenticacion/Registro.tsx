import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
import { registrarUsuario } from '../../api/usuarios';
import LogoSesionCrear from '../../imagenes/LogoSesionCrear.png';
import LogoPrincipal from '../../imagenes/LogoPrincipal.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/Registro.css';

function Registro() {
  const [correo, setCorreo] = useState('');
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [pais, setPais] = useState('');
  const [error, setError] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');
  const navegar = useNavigate();

  const manejarEnvio = async (evento: React.FormEvent) => {
    evento.preventDefault();
    setError('');
    setMensajeExito('');

    if (!correo.includes('@')) {
      setError('Correo inválido.');
      return;
    }

    if (contrasena !== confirmarContrasena) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    const nuevoUsuario = {
      correo,
      nickname: nombreUsuario,
      contrasena,
      confirmarContrasena,
      pais
    };

    try {
      const respuesta = await registrarUsuario(nuevoUsuario);
      if (respuesta.errores) {
        console.log('Errores desde backend:', respuesta.errores);
        setError(respuesta.errores.join(' '));
      } else {
        setMensajeExito('Registro exitoso. Serás redirigido en unos segundos.');
        setTimeout(() => navegar('/ConfirmarContrasena'), 3000);
      }
    } catch (error) {
      setError('Error al registrar. Intenta nuevamente.');
    }
  };

  return (
    <div className="registro-container">
      <div className="form-section">
        <div className="logo-header">
          <img src={LogoPrincipal} alt="Game Verse Logo" className="logo-img" />
          <h1 className="logo-title">Game Verse</h1>
        </div>

        <div className="form-wrapper">
          <Form onSubmit={manejarEnvio} className="registro-form">
            <h2 className="form-title">Regístrate en Game Verse</h2>

            {error && <Alert variant="danger">{error}</Alert>}
            {mensajeExito && <Alert variant="success">{mensajeExito}</Alert>}

            <Form.Group className="mb-3" controlId="correo">
              <Form.Label>Correo Electrónico</Form.Label>
              <Form.Control
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="nombreUsuario">
              <Form.Label>Usuario</Form.Label>
              <Form.Control
                type="text"
                value={nombreUsuario}
                onChange={(e) => setNombreUsuario(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="contrasena">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="confirmarContrasena">
              <Form.Label>Confirmar Contraseña</Form.Label>
              <Form.Control
                type="password"
                value={confirmarContrasena}
                onChange={(e) => setConfirmarContrasena(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="pais">
              <Form.Label>País/Región</Form.Label>
              <Form.Select value={pais} onChange={(e) => setPais(e.target.value)}>
                <option value="" disabled>Selecciona tu país</option>
                <option value="Perú">Perú</option>
                <option value="Argentina">Argentina</option>
                <option value="Colombia">Colombia</option>
                <option value="Chile">Chile</option>
                <option value="México">México</option>
              </Form.Select>
            </Form.Group>

            <Button type="submit" className="submit-btn">
              Continuar
            </Button>
          </Form>
        </div>
      </div>

      <div className="image-section">
        <img src={LogoSesionCrear} alt="Fondo" className="background-img" />
        <div className="image-content">
          <h2 className="image-title">Crea tu cuenta gratis</h2>
          <p className="image-subtitle">Explora tus juegos favoritos y juega sin restricciones</p>
        </div>
      </div>
    </div>
  );
}

export default Registro;
