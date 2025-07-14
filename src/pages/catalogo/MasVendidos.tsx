import { useEffect, useState } from "react";
import BarraNav from "./BarraNavUser";
import BarraCarrito from "../carrito/BarraCarrito";
import Footer from "./Footer";
import { Link } from "react-router-dom";
import { URL_BACKEND } from "../../config";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../../css/MasVendidos.css";
import "../../css/Inicio.css";
import "../../css/Catalogo.css";
import "rc-slider/assets/index.css";
import DetalleJuego from "./DetalleJuego";
import type { Juego } from "./DetalleJuego";

interface PaginacionProps {
  paginaActual: number;
  totalPaginas: number;
  onCambiarPagina: (pagina: number) => void;
}

const Paginacion = ({ paginaActual, totalPaginas, onCambiarPagina }: PaginacionProps) => (
  <nav className="mt-4" aria-label="Paginación de juegos">
    <ul className="pagination justify-content-center">
      <li className={`page-item ${paginaActual === 1 ? "disabled" : ""}`}>
        <button className="page-link" onClick={() => onCambiarPagina(paginaActual - 1)}>Anterior</button>
      </li>
      {[...Array(totalPaginas)].map((_, i) => (
        <li key={i} className={`page-item ${paginaActual === i + 1 ? "active" : ""}`}>
          <button className="page-link" onClick={() => onCambiarPagina(i + 1)}>{i + 1}</button>
        </li>
      ))}
      <li className={`page-item ${paginaActual === totalPaginas ? "disabled" : ""}`}>
        <button className="page-link" onClick={() => onCambiarPagina(paginaActual + 1)}>Siguiente</button>
      </li>
    </ul>
  </nav>
);

const DibujarEstrellas = (rating: number) => {
  const total = Math.floor(rating);
  const media = rating % 1 >= 0.5;
  const vacias = 5 - total - (media ? 1 : 0);

  return (
    <>
      {Array.from({ length: total }).map((_, i) => (
        <i key={`full-${i}`} className="bi bi-star-fill text-warning"></i>
      ))}
      {media && <i className="bi bi-star-half text-warning"></i>}
      {Array.from({ length: vacias }).map((_, i) => (
        <i key={`empty-${i}`} className="bi bi-star text-warning"></i>
      ))}
    </>
  );
};

const MasVendidos = () => {
  const [juegos, setJuegos] = useState<Juego[]>([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const juegosPorPagina = 10;
  const [juegoSeleccionado, setJuegoSeleccionado] = useState<Juego | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    fetch(`${URL_BACKEND}/api/juegos`)
      .then(res => res.json())
      .then((data: Juego[]) => {
        const ordenados = data.sort((a, b) => b.rating - a.rating);
        setJuegos(ordenados);
      })
      .catch(err => console.error("Error al cargar juegos:", err));
  }, []);

  const juegosPaginados = juegos.slice((paginaActual - 1) * juegosPorPagina, paginaActual * juegosPorPagina);
  const totalPaginas = Math.ceil(juegos.length / juegosPorPagina);

  const abrirModal = (juego: Juego) => {
    setJuegoSeleccionado(juego);
    setMostrarModal(true);
  };

  return (
    <div id="mas-vendidos-page-container">
      <BarraNav />

      <div className="container mt-4">
        <h1 className="page-title">
          Descubre los <strong>más vendidos</strong>
        </h1>

        <div className="table-responsive">
          <table className="table table-dark table-hover align-middle">
            <thead>
              <tr>
                <th>#</th>
                <th>Portada</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Plataformas</th>
                <th>Valoración</th>
                <th>Lanzamiento</th>
                <th>Precio</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {juegosPaginados.map((juego, index) => (
                <tr key={juego.id}>
                  <td>{(paginaActual - 1) * juegosPorPagina + index + 1}</td>
                  <td><img src={juego.imagen} alt={juego.nombre} className="game-cover" /></td>
                  <td><strong>{juego.nombre}</strong></td>
                  <td>{juego.categoria.nombre}</td>
                  <td>
                    {juego.plataformas.map(p => (
                      <span key={p.id} className="badge bg-secondary me-1">{p.nombre}</span>
                    ))}
                  </td>
                  <td>
                    {DibujarEstrellas(juego.rating)}
                    <span className="text-muted ms-2">{juego.rating.toFixed(1)}</span>
                  </td>
                  <td>{juego.lanzamiento.split("T")[0]}</td>
                  <td>S/ {juego.precio.toFixed(2)}</td>
                  <td>
                    <Link to="/Catalogo" className="btn btn-sm btn-primary w-100 mb-1">Comprar</Link>
                    <button className="btn btn-sm btn-secondary w-100" onClick={() => abrirModal(juego)}>Detalles</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Paginacion
          paginaActual={paginaActual}
          totalPaginas={totalPaginas}
          onCambiarPagina={setPaginaActual}
        />
      </div>

      {juegoSeleccionado && (
        <DetalleJuego
          juego={juegoSeleccionado}
          show={mostrarModal}
          onHide={() => setMostrarModal(false)}
          onAddComment={() => {}} // Aquí podrías pasar la función si manejas comentarios
        />
      )}

      <BarraCarrito />
      <Footer />
    </div>
  );
};

export default MasVendidos;
