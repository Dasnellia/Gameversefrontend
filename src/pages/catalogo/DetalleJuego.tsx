import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import '../../css/DetalleJuego.css';
import { handleAgregarAlCarrito } from '../../context/carrito';
import { useUser } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { verificarCompra } from '../../api/apiVentas';
import { useEffect } from 'react';
import { obtenerUsuarioAutenticado } from '../../api/apiUsuarios';
import { URL_BACKEND } from '../../config';

export interface Comentario {
  id: number;
  user: string;
  rating: number;
  text: string;
  date: string;
}

export interface Juego {
  id: number;
  nombre: string;
  precio: number;
  plataformas: {
    id: number;
    nombre: string;
  }[];
  descuento: number;
  rating: number;
  imagen: string;
  descripcion?: string;
  descripcionLarga: string;
  trailerURL: string;
  galeria: string[];
  caracteristicas: string[];
  categoria: {
    id: number;
    nombre: string;
  };
  comentarios: Comentario[];
  lanzamiento: string;
}

interface DetalleJuegoProps {
  juego: Juego | null;
  show: boolean;
  onHide: () => void;
  onAddComment: (juegoId: number, comentario: Omit<Comentario, 'id' | 'date'>) => void;
}

function DetalleJuego({ juego, show, onHide, onAddComment: _onAddComment }: DetalleJuegoProps) {
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [usuarioRating, setUsuarioRating] = useState(5);
  const [comentarios, setComentarios] = useState<Comentario[]>([]);

  const { autenticado, usuario } = useUser();
  const navigate = useNavigate();
  const [puedeComentar, setPuedeComentar] = useState(false);
  const [yaComprado, setYaComprado] = useState(false);

  useEffect(() => {
    const fetchComentarios = async () => {
      if (juego?.id) {
        try {
          const response = await fetch(`${URL_BACKEND}/api/comentarios/${juego.id}`);
          if (!response.ok) {
            throw new Error('Error al obtener los comentarios');
          }
          const data = await response.json();
          setComentarios(data);
        } catch (error) {
          console.error(error);
        }
      }
    };
  
    fetchComentarios();
  }, [juego]);

  useEffect(() => {
    const checkCompra = async () => {
      if (autenticado && juego?.id && usuario?.id) {
        const comprado = await verificarCompra(usuario.id, juego.id);
        setPuedeComentar(comprado);
        setYaComprado(comprado);
      }
    };
    checkCompra();
  }, [autenticado, juego]);

  if (!juego) return null;

  const handleRatingClick = (rating: number) => {
    setUsuarioRating(rating);
  };

  const handleJugar = () => {
    if (juego?.trailerURL) {
      window.open(juego.trailerURL, '_blank');  // Redirige al video del juego en YouTube
    }
  };


  const handleAddComment = async () => {
    if (nuevoComentario.trim() === '') return;
  
    try {
      const usuario = await obtenerUsuarioAutenticado();

      const comentario = {
        juegoId: juego.id,
        user: usuario.nickname,
        rating: usuarioRating,
        text: nuevoComentario,
      };
  
      const response = await fetch(`${URL_BACKEND}/api/comentarios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(comentario),
      });
  
      if (!response.ok) {
        throw new Error('Error al agregar el comentario');
      }
  
      // Volver a obtener los comentarios después de agregar uno nuevo
      const responseComentarios = await fetch(`${URL_BACKEND}/api/comentarios/${juego.id}`);
      const dataComentarios = await responseComentarios.json();
      setComentarios(dataComentarios);
  
      setNuevoComentario('');  // Limpiar el campo de texto
    } catch (error) {
      console.error('Error al agregar el comentario o autenticarse:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('autenticado') || errorMessage.includes('401')) {
        alert('Debes iniciar sesión para comentar');
      } else {
        alert('Error al agregar el comentario');
      }
    }
  };

  const handleComprar = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!autenticado) {
      alert('Debes iniciar sesión o registrarte para comprar este juego.');
      navigate('/IniciarSesion');
      return;
    }

    handleAgregarAlCarrito(e);
    setTimeout(() => window.location.reload(), 500);
  };

  const formatoFecha = (fechaStr: string): string => {
    const fecha = new Date(fechaStr);
    return fecha.toISOString().split('T')[0];
  };

  return (
    <Modal show={show} onHide={onHide} size="xl" centered scrollable contentClassName="custom-backdrop" id="detalle-juego-modal">
      <Modal.Header closeButton className="custom-modal-header">
        <Modal.Title className="custom-modal-title">{juego.nombre}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="custom-modal-body">
        <div className="row mt-5">
          <div className="col-md-6 d-flex flex-column">
            <div className="ratio ratio-16x9 mb-3">
              <iframe
                src={juego.trailerURL}
                title={`${juego.nombre} Trailer`}
                allowFullScreen
                className="custom-iframe"
              ></iframe>
            </div>
  
            <div className="mt-3">
              <h6 className="custom-gallery-title">Galería</h6>
              <div className="row row-cols-4 g-2">
                {juego.galeria.map((img, index) => (
                  <div className="col" key={index}>
                    <img
                      src={img}
                      alt={`${juego.nombre} ${index + 1}`}
                      className="img-thumbnail cursor-pointer custom-image-thumbnail"
                      style={{ width: '100%', height: '100px', objectFit: 'cover' }}
                      onClick={() => setExpandedImage(img)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
  
          <Modal show={expandedImage !== null} onHide={() => setExpandedImage(null)} centered size="xl">
            <Modal.Header closeButton>
              <Modal.Title>{juego.nombre}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center">
              <img
                src={expandedImage || ''}
                alt="Ampliación"
                className="img-fluid"
                style={{ maxHeight: '70vh' }}
              />
            </Modal.Body>
          </Modal>
  
          <div className="col-md-6 d-flex flex-column">
            <h6 className="custom-description-title">Descripción</h6>
            <p className="custom-description-text">{juego.descripcionLarga}</p>
  
            <div className="mb-3">
              <h6 className="custom-release-date-title">Fecha de lanzamiento</h6>
              <p className="custom-release-date-text">{formatoFecha(juego.lanzamiento)}</p>
            </div>
  
            <div className="mb-3">
              <h6 className="custom-platforms-title">Plataformas</h6>
              <div>
                {juego.plataformas.map((plataforma: { id: number; nombre: string }) => (
                  <span key={plataforma.id} className="badge bg-secondary me-1">{plataforma.nombre}</span>
                ))}
              </div>
            </div>
  
            <div className="mb-3">
              <h6 className="custom-features-title">Características</h6>
              <ul className="list-unstyled custom-features-list">
                {juego.caracteristicas.map((caracteristica, index) => (
                  <li key={index} className="custom-feature-item">{caracteristica}</li>
                ))}
              </ul>
            </div>
  
            <div className="mb-3">
              <h6 className="custom-genres-title">Categoría</h6>
              <span className="badge bg-info me-1">{juego.categoria.nombre}</span>
            </div>
  
            <div className="d-flex flex-grow-1 align-items-center justify-content-between mb-0">
              <div>
                <h6 className="mb-0 custom-price-text">Precio: <span className="text-danger">S/ {juego.precio.toFixed(2)}</span></h6>
                {juego.descuento > 0 && (
                  <small className="text-danger custom-discount-text">
                    {juego.descuento}% de descuento
                  </small>
                )}
              </div>
              {yaComprado ? (
                <button className="btn btn-sm btn-success" onClick={handleJugar}>
                  Jugar
                </button>
              ) : (
                <button
                  className="btn btn-sm btn-primary"
                  data-id={juego.id}
                  data-nombre={juego.nombre}
                  data-precio={juego.precio.toFixed(2)}
                  data-imagen={juego.imagen}
                  onClick={handleComprar}
                >
                  Agregar al carrito
                </button>
              )}
            </div>
          </div>
        </div>
  
        <div id="toast" className="toast"></div>
  
        <div id="toast" className="toast"></div>
  
        <div className="mt-4">
          <h5 className="custom-reviews-title">Reseñas</h5>
          {comentarios.map((comentario) => (
            <div key={comentario.id} className="card mb-2 custom-review-card">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <h6 className="card-title custom-review-user">{comentario.user}</h6>
                  <div>
                    {[...Array(5)].map((_, i) => (
                      <i
                        key={i}
                        className={`bi ${i < comentario.rating ? 'bi-star-fill text-warning' : 'bi-star'} custom-review-star`}
                      ></i>
                    ))}
                  </div>
                </div>
                <p className="card-text custom-review-text">{comentario.text}</p>
                <small className="text-muted custom-review-date">{comentario.date}</small>
              </div>
            </div>
          ))}
  
          {puedeComentar ? (
            <div className="mt-4 custom-add-review">
              <h5 className="custom-reviews-title">Añadir tu reseña</h5>
              <div className="mb-3">
                <label className="form-label text-white">Puntuación</label>
                <div>
                  {[...Array(5)].map((_, i) => (
                    <i
                      key={i}
                      className={`bi ${i < usuarioRating ? 'bi-star-fill text-warning' : 'bi-star'} fs-4 me-1 custom-rating-star`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleRatingClick(i + 1)}
                    ></i>
                  ))}
                </div>
              </div>
              <div className="mb-3">
                <textarea
                  className="form-control custom-review-textarea"
                  rows={3}
                  placeholder="Escribe tu reseña..."
                  value={nuevoComentario}
                  onChange={(e) => setNuevoComentario(e.target.value)}
                ></textarea>
              </div>
              <button
                className="btn btn-danger custom-submit-review-button"
                onClick={handleAddComment}
                disabled={!nuevoComentario.trim()}
              >
                Enviar reseña
              </button>
            </div>
          ) : (
            <p className="text-light mt-3">Debes comprar este juego para dejar una reseña.</p>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer className="custom-modal-footer">
        <button type="button" className="btn btn-danger" onClick={onHide}>Cerrar</button>
      </Modal.Footer>
    </Modal>
  );
}

export default DetalleJuego;