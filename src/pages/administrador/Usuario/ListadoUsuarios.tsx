import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavBarra from "../BarraNavAdmin";
import { useUser } from '../../../context/UserContext';
import '../../../css/ListaUser.css';
import { URL_BACKEND } from "../../../config";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

interface Usuario {
  id: number;
  nickname: string;
  correo: string;
  pais: string | null;
  imagen: string | null;
  tipo: string;
}

const MainContent = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const { usuario } = useUser();

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await axios.get(`${URL_BACKEND}/api/usuarios`, {
          withCredentials: true
        });
        setUsuarios(response.data);
      } catch (error) {
        console.error('Error al obtener usuarios:', error);
      }
    };
    
    if (usuario && usuario.tipo === 'admin') {
      fetchUsuarios();
    }
  }, [usuario]);

  return (
    <div className="main-content">
      <div className="container-fluid px-4 py-3">
        <h1 className="mb-4 display-5">Usuarios</h1>
        <div className="row">
          <div className="col">
            <div className="card">
              <div className="card-body">
                <table className="user-table">
                  <thead>
                    <tr>
                      <th>Id</th>
                      <th>Foto</th>
                      <th>Alias</th>
                      <th>Correo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map(user => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>
                          <img
                            src={
                              user?.imagen
                                ? `${URL_BACKEND}/static/usuarios/${user.imagen}`
                                : `${URL_BACKEND}/imagenes/Usuarios/default.jpg`
                            }
                            alt={user.nickname}
                            className="user-photo"
                          />
                        </td>
                        <td>{user.nickname}</td>
                        <td>{user.correo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ListadoUsuarios = () => {
  const { autenticado, usuario } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!autenticado) {
      navigate('/IniciarSesion');
      return; 
    }

    if (usuario?.tipo.toLowerCase() !== "admin") {
      navigate('/IniciarSesion');
      return;
    }
  }, [autenticado, usuario, navigate]); 

  if (!autenticado || usuario?.tipo.toLowerCase() !== "admin") {
    return (
      <div className="d-flex vh-100">
        <NavBarra />
        <div className="content flex-grow-1 overflow-auto d-flex justify-content-center align-items-center">
          <div className="alert-custom-restringido">
            <h4 className="mb-2">Acceso restringido</h4>
            <p>
              Debes iniciar sesión con una cuenta <strong>administrador</strong> para ver la lista de usuarios.
              <br/>Redirigiendo...
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
        <MainContent />
      </div>
    </div>
  );
};

export default ListadoUsuarios;
