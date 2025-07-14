import { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useUser } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import NavBarra from './BarraNavAdmin';
import { URL_BACKEND } from '../../config';
import '../../css/ListaJuegos.css';

interface Plataforma {
  id: number;
  nombre: string;
}

interface Categoria {
  id: number;
  nombre: string;
}

interface Juego {
  id: number;
  nombre: string;
  precio: number;
  plataformas: Plataforma[];
  descuento: number;
  imagen: string;
  lanzamiento: string;
  categoria: Categoria;
}

const ListaJuegos = () => {
  const [juegos, setJuegos] = useState<Juego[]>([]);
  const [filteredJuegos, setFilteredJuegos] = useState<Juego[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    fecha: '',
    categoria: '',
    precioMin: '',
    precioMax: ''
  });

  const { usuario, autenticado } = useUser();
  const navigate = useNavigate();

  // Protección de ruta
  useEffect(() => {
    if (!autenticado) {
      navigate('/IniciarSesion');
    } else if (usuario?.tipo !== 'admin') {
      navigate('/IniciarSesion');
    }
  }, [autenticado, usuario, navigate]);

  useEffect(() => {
    fetch(`${URL_BACKEND}/api/juegos`)
      .then(res => res.json())
      .then((data: Juego[]) => {
        setJuegos(data);
        setFilteredJuegos(data);
      });
  }, []);

  const toggleFilters = () => setShowFilters(!showFilters);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({ fecha: '', categoria: '', precioMin: '', precioMax: '' });
    setFilteredJuegos(juegos);
    setShowFilters(false);
  };

  const applyFilters = () => {
    const filtrados = juegos.filter(juego => {
      if (filters.fecha) {
        const juegoFecha = new Date(juego.lanzamiento).toISOString().split('T')[0];
        if (juegoFecha !== filters.fecha) return false;
      }
      if (filters.categoria && juego.categoria.nombre !== filters.categoria) return false;
      if (filters.precioMin && juego.precio < parseFloat(filters.precioMin)) return false;
      if (filters.precioMax && juego.precio > parseFloat(filters.precioMax)) return false;
      console.log(juego.categoria);
      return true;
    });
    setFilteredJuegos(filtrados);
    setShowFilters(false);
  };

  return (
    <div className="d-flex vh-100">
      <div className="sidebar">
        <NavBarra />
      </div>
      <div className="content flex-grow-1 overflow-auto">
        <div className="main-content">
          <div className="container-fluid px-4 py-3">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="display-5 mb-0">Juegos</h1>
              <button className="btn btn-outline-light" onClick={toggleFilters}>
                <i className="bi bi-funnel me-2"></i>Filtro
              </button>
            </div>

            <Modal show={showFilters} onHide={toggleFilters} centered>
              <Modal.Header closeButton className="bg-dark text-white">
                <Modal.Title>Filtrar Juegos</Modal.Title>
              </Modal.Header>
              <Modal.Body className="bg-dark text-white">
                <div className="mb-3">
                  <label className="form-label">Fecha de lanzamiento</label>
                  <input type="date" className="form-control bg-secondary text-white" name="fecha" value={filters.fecha} onChange={handleFilterChange} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Género</label>
                  <select className="form-select bg-secondary text-white" name="categoria" value={filters.categoria} onChange={handleFilterChange}>
                    <option value="">Todos los géneros</option>
                    <option value="RPG">RPG</option>
                    <option value="Aventura">Aventura</option>
                    <option value="Acción">Acción</option>
                    <option value="Terror">Terror</option>
                    <option value="Exploración">Exploración</option>
                    <option value="Sandbox">Sandbox</option>
                    <option value="Mundo Abierto">Mundo Abierto</option>
                    <option value="Supervivencia">Supervivencia</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Rango de precio</label>
                  <div className="row g-2">
                    <div className="col">
                      <input type="number" className="form-control bg-secondary text-white" placeholder="Mínimo" name="precioMin" value={filters.precioMin} onChange={handleFilterChange} min="0" step="0.01" />
                    </div>
                    <div className="col">
                      <input type="number" className="form-control bg-secondary text-white" placeholder="Máximo" name="precioMax" value={filters.precioMax} onChange={handleFilterChange} min="0" step="0.01" />
                    </div>
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer className="bg-dark">
                <button className="btn btn-secondary" onClick={resetFilters}>Cancelar</button>
                <button className="btn btn-primary" onClick={applyFilters}>Aplicar Filtros</button>
              </Modal.Footer>
            </Modal>

            <div className="row">
              <div className="col">
                <div className="card">
                  <div className="card-body">
                    <table className="user-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Imagen</th>
                          <th>Nombre</th>
                          <th>Plataformas</th>
                          <th>Lanzamiento</th>
                          <th>Precio</th>
                          <th>Descuento</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredJuegos.map(juego => (
                          <tr key={juego.id}>
                            <td>{juego.id}</td>
                            <td><img src={juego.imagen} alt={juego.nombre} className="game-photo" /></td>
                            <td>{juego.nombre}</td>
                            <td>{juego.plataformas.join(', ')}</td>
                            <td>{new Date(juego.lanzamiento).toISOString().split('T')[0]}</td>
                            <td>S/ {juego.precio.toFixed(2)}</td>
                            <td>{juego.descuento > 0 ? `${juego.descuento}%` : '-'}</td>
                            <td>
                              <div className="d-flex justify-content-center align-items-center gap-2">
                                <button className="btn btn-sm btn-warning"><i className="bi bi-pencil-fill"></i></button>
                                <button className="btn btn-sm btn-danger"><i className="bi bi-trash-fill"></i></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {filteredJuegos.length === 0 && (
                      <p className="mt-3 text-center text-muted">No se encontraron juegos con los filtros seleccionados.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListaJuegos;
