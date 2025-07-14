import BarraCarrito from '../carrito/BarraCarrito';
import { handleAgregarAlCarrito } from '../../context/carrito';
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import { URL_BACKEND } from '../../config';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../../css/MejorValorados.css';

import type { Juego, Comentario } from './DetalleJuego';
import DetalleJuego from './DetalleJuego';
import Logo from '../../imagenes/LogoRecuperarContraseña.png';
import Footer from './Footer';

function MejorValorados() {
  const [nombreBusqueda, setNombreBusqueda] = useState('');
  const [sugerenciasBusqueda, setSugerenciasBusqueda] = useState<Juego[]>([]);
  const [mostrarResultadosBusqueda, setMostrarResultadosBusqueda] = useState(false);
  const referenciaBusqueda = useRef<HTMLInputElement>(null);
  const [juegosFiltrados, setJuegosFiltrados] = useState<Juego[]>([]);
  const [juegoSeleccionado, setJuegoSeleccionado] = useState<Juego | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    fetch(`${URL_BACKEND}/api/juegos`)
      .then(res => res.json())
      .then((data: Juego[]) => {
        const ordenados = [...data].sort((a, b) => b.rating - a.rating);
        setJuegosFiltrados(ordenados);
      });
  }, []);

  const manejarCambioNombre = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    setNombreBusqueda(valor);

    fetch(`${URL_BACKEND}/api/juegos`)
      .then(res => res.json())
      .then((data: Juego[]) => {
        const sugerencias = data.filter(j =>
          j.nombre.toLowerCase().includes(valor.toLowerCase()) && valor.length > 0
        );
        setSugerenciasBusqueda(sugerencias);
        setMostrarResultadosBusqueda(sugerencias.length > 0);
      });
  };

  const manejarClickBuscar = () => {
    filtrarJuegos(nombreBusqueda);
    setMostrarResultadosBusqueda(false);
  };

  const seleccionarSugerencia = (nombre: string) => {
    setNombreBusqueda(nombre);
    setMostrarResultadosBusqueda(false);
    filtrarJuegos(nombre);
  };

  const filtrarJuegos = (nombre: string) => {
    fetch(`${URL_BACKEND}/api/juegos`)
      .then(res => res.json())
      .then((data: Juego[]) => {
        const filtrados = data
          .filter(j => j.nombre.toLowerCase().includes(nombre.toLowerCase()))
          .sort((a, b) => b.rating - a.rating);
        setJuegosFiltrados(filtrados);
      });
  };

  const abrirModal = (juego: Juego) => {
    setJuegoSeleccionado(juego);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setJuegoSeleccionado(null);
  };

  const agregarComentario = (_juegoId: number, comentario: Omit<Comentario, 'id' | 'date'>) => {
    if (!juegoSeleccionado) return;

    const juegoActualizado: Juego = {
      ...juegoSeleccionado,
      comentarios: [
        ...juegoSeleccionado.comentarios,
        { id: juegoSeleccionado.comentarios.length + 1, ...comentario, date: new Date().toISOString().split('T')[0] }
      ]
    };

    setJuegoSeleccionado(juegoActualizado);
  };

  return (
    <div id="mejor-valorados-page-container">
      {/* Barra de navegación */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
        <div className="container">
          <Link className="navbar-brand" to="/Inicio">
            <img src={Logo} alt="Game Verse Logo" width="45" className="rounded-circle border border-danger me-2" />
            Game Verse
          </Link>

          <form className="d-flex mx-auto position-relative w-50" id="barraBusquedaContainer">
            <input
              ref={referenciaBusqueda}
              className="form-control me-2"
              type="search"
              placeholder="Buscar juegos..."
              value={nombreBusqueda}
              onChange={manejarCambioNombre}
            />
            <button className="btn btn-outline-light btn-sm me-4" type="button" onClick={manejarClickBuscar}>
              Buscar
            </button>

            {mostrarResultadosBusqueda && sugerenciasBusqueda.length > 0 && (
              <ul className="list-group position-absolute mt-2 w-100 bg-light border rounded shadow-sm" style={{ zIndex: 1000 }}>
                {sugerenciasBusqueda.map(j => (
                  <li key={j.id} className="list-group-item list-group-item-action" onClick={() => seleccionarSugerencia(j.nombre)}>
                    {j.nombre}
                  </li>
                ))}
              </ul>
            )}
          </form>

          <Link className="btn btn-outline-light btn-sm me-4" to="/Perfil">
            <i className="bi bi-person-fill"></i> Mi Cuenta
          </Link>
        </div>
      </nav>

      {/* Submenú */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <ul className="nav justify-content-center w-100">
            <Dropdown className="nav-item">
              <Dropdown.Toggle variant="dark" className="nav-link" style={{ backgroundColor: 'transparent' }}>
                Inicio
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item as={Link} to="/Inicio">Destacados</Dropdown.Item>
                <Dropdown.Item as={Link} to="/Inicio">Ofertas</Dropdown.Item>
                <Dropdown.Item as={Link} to="/Inicio">Próximos lanzamientos</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <li className="nav-item"><Link className="nav-link" to="/Catalogo">Catálogo</Link></li>
            <Dropdown className="nav-item">
              <Dropdown.Toggle variant="dark" className="nav-link" style={{ backgroundColor: 'transparent' }}>
                Plataformas
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item as={Link} to="/Catalogo">PC</Dropdown.Item>
                <Dropdown.Item as={Link} to="/Catalogo">PlayStation 5</Dropdown.Item>
                <Dropdown.Item as={Link} to="/Catalogo">Xbox</Dropdown.Item>
                <Dropdown.Item as={Link} to="/Catalogo">Nintendo Switch</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <li className="nav-item"><Link className="nav-link" to="/MasVendidos">Más vendidos</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/MejorValorados">Mejor valorados</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/Carrito"><i className="bi bi-cart-fill"></i> Carrito</Link></li>
          </ul>
        </div>
      </nav>

      {/* Contenido principal */}
      <div className="container mt-4">
        <h1 className="mb-4 page-title">Juegos Mejor Valorados</h1>
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {juegosFiltrados.map(juego => (
            <div className="col" key={juego.id}>
              <div className="card h-100">
                {juego.descuento > 0 && <div className="discount-badge">-{juego.descuento}%</div>}
                <img src={juego.imagen} className="card-img-top game-cover" alt={juego.nombre} />
                <div className="card-body">
                  <h5 className="card-title">{juego.nombre}</h5>
                  <div className="mb-2">
                    {juego.plataformas.map(p => (
                      <span key={p.id} className="badge bg-secondary me-1">{p.nombre}</span>
                    ))}
                  </div>
                  <div className="rating mb-2">
                    {[...Array(Math.floor(juego.rating))].map((_, i) => <i key={i} className="bi bi-star-fill text-warning"></i>)}
                    {juego.rating % 1 !== 0 && <i className="bi bi-star-half text-warning"></i>}
                    {[...Array(5 - Math.ceil(juego.rating))].map((_, i) => <i key={i} className="bi bi-star text-warning"></i>)}
                    <span className="text-muted ms-2">{juego.rating}/5</span>
                  </div>
                  <p className="price">
                    {juego.descuento > 0 && (
                      <span className="old-price">S/ {(juego.precio / (1 - juego.descuento / 100)).toFixed(2)}</span>
                    )}
                    <span className="new-price">S/ {juego.precio.toFixed(2)}</span>
                  </p>
                </div>
                <div className="card-footer d-flex justify-content-between">
                  <button
                    className="btn btn-sm btn-primary"
                    data-id={juego.id}
                    data-nombre={juego.nombre}
                    data-precio={juego.precio}
                    data-imagen={juego.imagen}
                    onClick={handleAgregarAlCarrito}
                  >
                    Agregar al carrito
                  </button>
                  <button className="btn btn-sm btn-secondary" onClick={() => abrirModal(juego)}>
                    Detalles
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {juegoSeleccionado && (
        <DetalleJuego juego={juegoSeleccionado} show={mostrarModal} onHide={cerrarModal} onAddComment={agregarComentario} />
      )}

      <BarraCarrito />
      <Footer />
    </div>
  );
}

export default MejorValorados;
