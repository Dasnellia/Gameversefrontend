import { useEffect, useState } from 'react';
import {
  listarNoticias,
  eliminarNoticia
} from '../../../api/apiNoticias';
import EditarNoticia from './EditarNoticia';
import EliminarNoticia from './EliminarNoticia';
import AgregarNoticia from './AgregarNoticia';
import NavBarra from '../BarraNavAdmin';
import { URL_BACKEND } from '../../../config';
import '../../../css/ListaNoticias.css';
import { useUser } from '../../../context/UserContext';

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export interface DetalleNoticia {
  id: number;
  titulo: string; 
  contenido: string;
  imagen?: string;
}

const ListadoNoticias = () => {
  
  const [datosNoticias, setDatosNoticias] = useState<DetalleNoticia[]>([]);
  const [isEditarModalOpen, setIsEditarModalOpen] = useState(false);
  const [noticiaIdAEditar, setNoticiaIdAEditar] = useState<number | null>(null);
  const [isEliminarModalOpen, setIsEliminarModalOpen] = useState(false);
  const [noticiaAEliminar, setNoticiaAEliminar] = useState<DetalleNoticia | null>(null);
  const [isAgregarModalOpen, setIsAgregarModalOpen] = useState(false);

  const { usuario } = useUser();

  // 🔒 Protección por autenticación y rol
  useEffect(() => {
    if (usuario && usuario.tipo === 'admin') {
      cargarNoticias();
    }
  }, [usuario]);

  const cargarNoticias = async () => {
    try {
      const noticias = await listarNoticias();
      setDatosNoticias(noticias);
    } catch (err) {
      console.error('❌ Error al cargar noticias:', err);
    }
  };

  useEffect(() => {
    cargarNoticias();
  }, []);

  const handleEditarClick = (id: number) => {
    setNoticiaIdAEditar(id);
    setIsEditarModalOpen(true);
  };

  const handleCerrarEditarModal = () => {
    setIsEditarModalOpen(false);
    setNoticiaIdAEditar(null);
  };

  const handleGuardarCambios = async () => {
    await cargarNoticias();
    handleCerrarEditarModal();
  };

  const getNoticiaToEdit = (): DetalleNoticia | null => {
    return datosNoticias.find(noticia => noticia.id === noticiaIdAEditar) || null;
  };

  const handleEliminarClick = (noticia: DetalleNoticia) => {
    setNoticiaAEliminar(noticia);
    setIsEliminarModalOpen(true);
  };

  const handleCerrarEliminarModal = () => {
    setIsEliminarModalOpen(false);
    setNoticiaAEliminar(null);
  };

  const confirmarEliminarNoticia = async (id: number) => {
    try {
      await eliminarNoticia(id);
      await cargarNoticias();
      handleCerrarEliminarModal();
    } catch (err) {
      console.error('❌ Error al eliminar noticia:', err);
    }
  };

  const handleAgregarClick = () => {
    setIsAgregarModalOpen(true);
  };

  const handleCerrarAgregarModal = () => {
    setIsAgregarModalOpen(false);
  };

  const handleAgregarNoticia = async () => {
    await cargarNoticias();
    handleCerrarAgregarModal();
  };

  if (!usuario || usuario.tipo?.toLowerCase() !== "admin") { // Added ?. for safety if usuario.tipo somehow missing
    return (
      <div className="d-flex vh-100">
        <NavBarra />
        <div className="content flex-grow-1 overflow-auto d-flex justify-content-center align-items-center">
          <div className="alert-custom-restringido">
            <h4 className="mb-2">Acceso restringido</h4>
            <p>
              Debes iniciar sesión con una cuenta <strong>administrador</strong> para ver y gestionar las noticias.
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="d-flex vh-100">
      <NavBarra />
      <div className="content flex-grow-1 overflow-auto">
        <div className="main-content container-fluid px-4 py-3">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h1 className="mb-0 display-5">Noticias</h1>
            <button className="btn" onClick={handleAgregarClick}>
              <i className="bi bi-plus-circle-fill"></i> Agregar
            </button>
          </div>
          <div className="card">
            <div className="card-body">
              <table className="news-table user-table">
                <thead>
                  <tr>
                    <th>Id</th>
                    <th>Foto</th>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th className="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {datosNoticias.map((noticia) => (
                    <tr key={noticia.id}>
                      <td>{noticia.id}</td>
                      <td>
                        <div className="user-foto">
                          {noticia.imagen && (
                            <img
                              src={`${URL_BACKEND}${noticia.imagen}`}
                              alt={noticia.titulo}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          )}
                        </div>
                      </td>
                      <td>{noticia.titulo}</td>
                      <td>{noticia.contenido}</td>
                      <td className="news-actions text-center">
                        <i
                          className="bi bi-pencil-square"
                          onClick={() => handleEditarClick(noticia.id)}
                          style={{ cursor: 'pointer' }}
                        ></i>
                        <i
                          className="bi bi-trash3"
                          onClick={() => handleEliminarClick(noticia)}
                          style={{ cursor: 'pointer', marginLeft: '10px', color: '#dc3545' }}
                        ></i>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Modales */}
              {isEditarModalOpen && noticiaIdAEditar !== null && (
                <EditarNoticia
                  show={isEditarModalOpen}
                  onCerrar={handleCerrarEditarModal}
                  onGuardar={handleGuardarCambios}
                  noticiaActual={getNoticiaToEdit()}
                />
              )}

              {isEliminarModalOpen && noticiaAEliminar !== null && (
                <EliminarNoticia
                  show={isEliminarModalOpen}
                  onCerrar={handleCerrarEliminarModal}
                  noticiaId={noticiaAEliminar.id}
                  nombreNoticia={noticiaAEliminar.contenido}
                  onEliminar={confirmarEliminarNoticia}
                />
              )}

              {isAgregarModalOpen && (
                <AgregarNoticia
                  show={isAgregarModalOpen}
                  onCerrar={handleCerrarAgregarModal}
                  onAgregar={handleAgregarNoticia}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListadoNoticias;
