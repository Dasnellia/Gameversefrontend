import { useState, useEffect } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerUsuarioAutenticado, actualizarPerfil } from '../../api/apiUsuarios';
import { useUser } from '../../context/UserContext';
import PerfilModal from './PerfilModal';
import { URL_BACKEND } from '../../config';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../../css/Perfil.css';
import '../../css/PagoPerfilModal.css';

function Perfil() {
  const [modalVisible, setModalVisible] = useState(false);
  const [usuario, setUsuario] = useState<any>(null);
  const [nickname, setNickname] = useState('');
  const [correo, setCorreo] = useState('');
  const [pais, setPais] = useState('');
  const [imagen, setImagen] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);  // Para gestionar el estado de carga del botón
  const [usandoDatosLocales, setUsandoDatosLocales] = useState(false); // Nuevo estado
  const navigate = useNavigate();
  const { autenticado } = useUser();

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const datos = await obtenerUsuarioAutenticado();
        setUsuario(datos);
        setNickname(datos.nickname);
        setCorreo(datos.correo);
        setPais(datos.pais || '');
      } catch (error) {
        console.error('Error al cargar datos del usuario:', error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        
        if (errorMessage.includes('autenticado') || errorMessage.includes('401')) {
          // Si hay datos locales, usarlos como fallback
          const usuarioLocal = localStorage.getItem('usuario');
          if (usuarioLocal) {
            try {
              const datosLocales = JSON.parse(usuarioLocal);
              setUsuario(datosLocales);
              setNickname(datosLocales.nickname || '');
              setCorreo(datosLocales.correo || '');
              setPais(datosLocales.pais || '');
              setUsandoDatosLocales(true); // Indicar que se están usando datos locales
              console.log('Usando datos locales como fallback');
              return;
            } catch {
              // Si falla el parsing, continuar con el error normal
            }
          }
          alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        } else {
          alert('Error al cargar los datos del perfil. Verifica tu conexión a internet.');
        }
      }
    };
    
    // Intentar cargar datos solo si el usuario está autenticado localmente
    if (autenticado) {
      cargarDatos();
    }
  }, [autenticado, navigate]);

  // No mostrar loading si no está autenticado localmente
  if (!autenticado) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning">
          <h4>Acceso restringido</h4>
          <p>Necesitas iniciar sesión para acceder a tu perfil.</p>
          <button 
            className="btn btn-primary" 
            onClick={() => navigate('/IniciarSesion')}
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    );
  }

  const manejarCambioTexto = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (id === 'nickname') setNickname(value);
    if (id === 'correo') setCorreo(value);
    if (id === 'pais') setPais(value);
  };

  const manejarCambioImagen = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImagen(e.target.files[0]);
    }
  };

  const manejarGuardarCambios = async (e: FormEvent) => {
    e.preventDefault();
    if (!usuario) return;

    // Evitar hacer clic en el botón mientras se está guardando
    setLoading(true);

    const formData = new FormData();
    if (nickname !== usuario.nickname) formData.append('nickname', nickname);
    if (correo !== usuario.correo) formData.append('correo', correo);
    if (pais !== usuario.pais) formData.append('pais', pais);
    if (imagen) formData.append('imagen', imagen);

    try {
      // Llamada para actualizar el perfil
      await actualizarPerfil(usuario.id, formData);
      setModalVisible(true);  // Mostrar el modal de confirmación
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      // Si ocurre un error, podemos mostrar un mensaje o algo similar
    } finally {
      setLoading(false);  // Restablecer el estado de carga
    }
  };

  const cerrarModal = () => {
    setModalVisible(false);
    navigate('/inicio');  // Redirigir al inicio después de guardar los cambios
  };

  const cerrarSesion = () => {
    localStorage.clear();
    navigate('/IniciarSesion');  // Redirigir al inicio de sesión
  };

  return (
    <div className="perfil-box container py-5">
      {/* Banner informativo cuando se usan datos locales */}
      {usandoDatosLocales && (
        <div className="alert alert-warning alert-dismissible fade show" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          <strong>Modo offline:</strong> No se pudo conectar con el servidor. 
          Mostrando datos guardados localmente. Algunas funciones pueden estar limitadas.
          <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      )}
      
      <div className="row">
        <div className="col-10"></div>
        <div className="col-2 mb-3">
          <button className="btn btn-danger perfil-btn-save d-flex justify-content-center" onClick={cerrarSesion}>
            Cerrar sesión
          </button>
        </div>
      </div>

      <div className="row justify-content-center align-items-start g-4">
        {/* Columna de imagen */}
        <div className="col-md-4 text-center">
          <h2 className="perfil-title mb-4">Edita tu perfil</h2>
          <div className="perfil-image-container mb-3 position-relative d-inline-block">
            <img
              src={
                usuario?.imagen
                  ? `${URL_BACKEND}/static/usuarios/${usuario.imagen}`
                  : `${URL_BACKEND}/static/usuarios/default.jpg`
              }
              alt="Imagen de perfil"
              className="perfil-imagen-preview"
            />
            <label htmlFor="profileImageUpload" className="perfil-change-photo-text">
              Cambiar foto
            </label>
            <input
              type="file"
              id="profileImageUpload"
              accept="image/*"
              onChange={manejarCambioImagen}
              style={{ display: 'none' }}
            />
          </div>
        </div>

        {/* Columna de formulario */}
        <div className="col-md-8">
          <form onSubmit={manejarGuardarCambios}>
            <div className="mb-3">
              <label htmlFor="nickname" className="perfil-form-label">
                Nickname
              </label>
              <input
                type="text"
                className="perfil-form-control"
                id="nickname"
                value={nickname}
                onChange={manejarCambioTexto}
                placeholder="Tu nickname actual"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="correo" className="perfil-form-label">
                Correo electrónico
              </label>
              <input
                type="email"
                className="perfil-form-control"
                id="correo"
                value={correo}
                onChange={manejarCambioTexto}
                placeholder="Tu correo actual"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="pais" className="perfil-form-label">
                País
              </label>
              <input
                type="text"
                className="perfil-form-control"
                id="pais"
                value={pais}
                onChange={manejarCambioTexto}
                placeholder="Tu país actual"
              />
            </div>

            <button type="submit" className="perfil-btn-save w-100" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </form>
        </div>
      </div>

      <PerfilModal visible={modalVisible} onClose={cerrarModal} />
    </div>
  );
}

export default Perfil;
