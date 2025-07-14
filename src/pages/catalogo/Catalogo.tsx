import { useState, useEffect, useRef } from 'react';
import type { ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { URL_BACKEND } from '../../config';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../../css/Catalogo.css';
import 'rc-slider/assets/index.css';
import Logo from '../../imagenes/LogoRecuperarContraseña.png';
import Footer from './Footer';
import DetalleJuego from './DetalleJuego';
import type { Juego as JuegoType, Comentario as ComentarioType } from './DetalleJuego';
import BarraCarrito from '../carrito/BarraCarrito';
import { handleAgregarAlCarrito, mostrarMensajeToast } from '../../context/carrito';
import { useUser } from '../../context/UserContext';
import Slider from 'rc-slider';
import { Dropdown } from 'react-bootstrap';

// Definición local de PlataformaType si DetalleJuego.tsx no la exporta.
interface Plataforma {
    id: number;
    nombre: string;
}

// Extensión de la interfaz ComentarioType para incluir 'juegoId' para la gestión interna.
interface ComentarioConJuegoId extends ComentarioType {
    juegoId: number;
}

function Catalogo() {
    const [nombreBusqueda, setNombreBusqueda] = useState('');
    const [productosFiltrados, setProductosFiltrados] = useState<JuegoType[]>([]);
    const [sugerenciasBusqueda, setSugerenciasBusqueda] = useState<JuegoType[]>([]);
    const [mostrarSugerenciasBusqueda, setMostrarSugerenciasBusqueda] = useState(false);
    const [rangoPrecio, setRangoPrecio] = useState<[number, number]>([0, 1000]);
    const [maxPrecioGlobal, setMaxPrecioGlobal] = useState<number>(1000); // Estado para el precio máximo global del slider
    const [mostrarFiltroLateral, setMostrarFiltroLateral] = useState(false);
    const [juegoSeleccionado, setJuegoSeleccionado] = useState<JuegoType | null>(null);
    const [mostrarModalDetalle, setMostrarModalDetalle] = useState(false);
    const [listaProductos, setListaProductos] = useState<JuegoType[]>([]);
    const [plataformasSeleccionadas, setPlataformasSeleccionadas] = useState<string[]>([]);
    const [todasLasPlataformas, setTodasLasPlataformas] = useState<Plataforma[]>([]); // Estado para todas las plataformas únicas
    const refBusqueda = useRef<HTMLInputElement>(null);
    const [mensajeError, setMensajeError] = useState('');
    const { autenticado } = useUser();

    // Efecto para cargar los juegos y establecer rangos de precio/plataformas iniciales
    useEffect(() => {
        fetch(`${URL_BACKEND}/api/juegos`)
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then((data: JuegoType[]) => {
                setListaProductos(data);

                if (data.length > 0) {
                    const precios = data.map((p: JuegoType) => p.precio);
                    const calculatedMaxPrecio = Math.max(...precios);
                    setMaxPrecioGlobal(calculatedMaxPrecio); // Establece el máximo para el slider
                    setRangoPrecio([0, calculatedMaxPrecio]); // Inicializa el rango del filtro

                    // Recopilar todas las plataformas únicas de los juegos cargados
                    const plataformasUnicas = Array.from(
                        new Map(data.flatMap(p => p.plataformas).map(plat => [plat.id, plat])).values()
                    );
                    setTodasLasPlataformas(plataformasUnicas);
                } else {
                    // Valores por defecto si no hay juegos
                    setMaxPrecioGlobal(1000);
                    setRangoPrecio([0, 1000]);
                    setTodasLasPlataformas([]);
                }
            })
            .catch(error => {
                console.error("Error al cargar los juegos:", error);
                setMensajeError("Error al cargar los juegos. Inténtalo de nuevo más tarde.");
            });
    }, []);

    // Efecto para aplicar filtros cada vez que cambian las dependencias
    useEffect(() => {
        aplicarFiltrosProductos();
    }, [nombreBusqueda, rangoPrecio, plataformasSeleccionadas, listaProductos]);

    const aplicarFiltrosProductos = () => {
        const nombreNormalizado = nombreBusqueda.toLowerCase();
        const [precioMinimo, precioMaximo] = rangoPrecio;

        const productosFiltradosActuales = listaProductos.filter((producto: JuegoType) => {
            const coincideNombre = producto.nombre.toLowerCase().includes(nombreNormalizado);
            const coincidePrecio = producto.precio >= precioMinimo && producto.precio <= precioMaximo;
            const coincidePlataforma = plataformasSeleccionadas.length === 0 ||
                producto.plataformas.some(p =>
                    plataformasSeleccionadas.includes(p.nombre)
                );
            return coincideNombre && coincidePrecio && coincidePlataforma;
        });

        setProductosFiltrados(productosFiltradosActuales);
    };

    // `obtenerTodasLasPlataformas` fue movido dentro del useEffect
    // y se usa el estado `todasLasPlataformas` en su lugar.
    // Esta función ya no es necesaria aquí como función de cálculo en línea.


    const handleCambioNombreBusqueda = (evento: ChangeEvent<HTMLInputElement>) => {
        const nuevoNombre = evento.target.value;
        setNombreBusqueda(nuevoNombre);

        const nuevasSugerencias = listaProductos.filter((producto: JuegoType) =>
            producto.nombre.toLowerCase().includes(nuevoNombre.toLowerCase()) && nuevoNombre.length > 0
        );
        setSugerenciasBusqueda(nuevasSugerencias);
        setMostrarSugerenciasBusqueda(nuevasSugerencias.length > 0);
    };

    const handleClicBuscar = () => {
        aplicarFiltrosProductos();
        setMostrarSugerenciasBusqueda(false);
        mostrarMensajeToast(`Búsqueda realizada para: "${nombreBusqueda}"`);
    };

    const seleccionarSugerenciaBusqueda = (nombre: string) => {
        setNombreBusqueda(nombre);
        setSugerenciasBusqueda([]);
        setMostrarSugerenciasBusqueda(false);
        aplicarFiltrosProductos();
    };

    const alternarFiltroLateral = () => {
        setMostrarFiltroLateral(!mostrarFiltroLateral);
    };

    const handleCambioPlataforma = (e: React.ChangeEvent<HTMLInputElement>) => {
        const nombre = e.target.value;
        setPlataformasSeleccionadas(prev =>
            e.target.checked
                ? [...prev, nombre]
                : prev.filter(p => p !== nombre)
        );
    };

    const handleAgregarJuegoAlCarrito = (evento: React.MouseEvent<HTMLButtonElement>) => {
        if (!autenticado) {
            setMensajeError('Debes iniciar sesión o registrarte para agregar este juego al carrito.');
            setTimeout(() => setMensajeError(''), 4000);
            return;
        }

        const boton = evento.currentTarget;
        const id = parseInt(boton.dataset.id || '', 10);
        const nombre = boton.dataset.nombre;
        const precioString = boton.dataset.precio;
        const precio = precioString ? parseFloat(precioString) : undefined;
        const imagen = boton.dataset.imagen;

        if (id && nombre && precio !== undefined && imagen) {
            handleAgregarAlCarrito(evento);
            mostrarMensajeToast(`"${nombre}" ha sido añadido al carrito!`);
            // No recargar la página después de añadir al carrito, es mala UX
            setTimeout(() => window.location.reload(), 1000); 
        }
    };

    // Esta función recibe el comentario con la forma que DetalleJuego.tsx espera (Omit<Comentario, 'id' | 'date'>).
    // Sin embargo, para actualizar el estado interno de Catalogo, necesitamos añadirle 'id', 'date' y 'juegoId'.
    const handleAgregarComentario = (juegoId: number, comentario: Omit<ComentarioType, 'id' | 'date'>) => {
        // Creamos un nuevo comentario con la estructura completa, incluyendo 'id', 'date' y 'juegoId'
        const nuevoComentarioCompleto: ComentarioConJuegoId = {
            ...comentario,
            id: Date.now(), // Generar un ID único simple
            date: new Date().toISOString(),
            juegoId: juegoId
        };

        setListaProductos(prev =>
            prev.map(juego =>
                juego.id === juegoId
                    ? {
                        ...juego,
                        comentarios: [
                            ...juego.comentarios,
                            nuevoComentarioCompleto
                        ]
                    }
                    : juego
            )
        );

        // Si el juego seleccionado es el mismo al que se agregó el comentario,
        // actualizamos sus comentarios también.
        if (juegoSeleccionado && juegoSeleccionado.id === juegoId) {
            setJuegoSeleccionado({
                ...juegoSeleccionado,
                comentarios: [...juegoSeleccionado.comentarios, nuevoComentarioCompleto]
            });
        }
    };

    return (
        <div id="catalogo-page-container">
            {/* navbar 1 */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
                <div className="container">
                    <Link className="navbar-brand" to="/Inicio">
                        <img src={Logo} alt="Game Verse Logo" width="45" className="rounded-circle border border-danger" /> Game Verse
                    </Link>

                    <form className="d-flex mx-auto position-relative w-50" id="barraBusquedaContainer">
                        {/* INICIO DEL BLOQUE DE FILTRO - BOTÓN DEL FILTRO */}
                        <button className="btn btn-outline-light me-2" type="button" onClick={alternarFiltroLateral}>
                            <i className="bi bi-sliders"></i>
                        </button>
                        {/* FIN DEL BLOQUE DE FILTRO - BOTÓN DEL FILTRO */}
                        <input
                            ref={refBusqueda}
                            className="form-control me-4"
                            type="search"
                            placeholder="Buscar juegos..."
                            aria-label="Buscar"
                            value={nombreBusqueda}
                            onChange={handleCambioNombreBusqueda}
                        />
                        <button className="btn btn-outline-light" type="button" onClick={handleClicBuscar}>
                            Buscar
                        </button>

                        {mostrarSugerenciasBusqueda && sugerenciasBusqueda.length > 0 && (
                            <ul className="list-group position-absolute mt-2 w-100 bg-light border rounded shadow-sm" style={{ zIndex: 1000, top: '100%' }}>
                                {sugerenciasBusqueda.map(producto => (
                                    <li
                                        key={producto.id}
                                        className="list-group-item list-group-item-action"
                                        onClick={() => seleccionarSugerenciaBusqueda(producto.nombre)}
                                    >
                                        {producto.nombre}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </form>

                    <Link className="btn btn-sm btn-outline-light" to="/Perfil">
                        <i className="bi bi-person-fill"> Mi Cuenta </i>
                    </Link>
                </div>
            </nav>

            {/* navbar 2 */}
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container">
                    <div className="w-100">
                        <ul className="nav justify-content-center">
                            <Dropdown as="li" className="nav-item">
                                <Dropdown.Toggle as={Link} to="#" className="nav-link">Inicio</Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item as={Link} to="/Inicio">Destacados</Dropdown.Item>
                                    <Dropdown.Item as={Link} to="/Inicio">Ofertas</Dropdown.Item>
                                    <Dropdown.Item as={Link} to="/Inicio">Próximos lanzamientos</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                            <li className="nav-item"><Link className="nav-link" to="/Catalogo">Catálogo</Link></li>
                            <Dropdown as="li" className="nav-item">
                                <Dropdown.Toggle as={Link} to="#" className="nav-link">Plataformas</Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {/* Mapea dinámicamente las plataformas para el menú desplegable también */}
                                    {todasLasPlataformas.map(plataforma => (
                                        <Dropdown.Item key={plataforma.id} as={Link} to={`/Catalogo?platform=${plataforma.nombre}`}>
                                            {plataforma.nombre}
                                        </Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                            <li className="nav-item"><Link className="nav-link" to="/MasVendidos">Más vendidos</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/MejorValorados">Mejor valorados</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/Carrito"><i className="bi bi-cart-fill"></i> Carrito</Link></li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Filtros y catálogo */}
            <div className="container-fluid mt-4">
                <div className="row">
                    {/* INICIO DEL BLOQUE DE FILTRO LATERAL */}
                    {mostrarFiltroLateral && (
                        <div className="col-md-3 filtro-lateral bg-dark p-3 shadow-sm">
                            <h5 className="mb-3 text-white">Filtrar por Precio</h5>
                            <Slider
                                range
                                min={0}
                                max={maxPrecioGlobal} // Utiliza el precio máximo global para el slider
                                value={rangoPrecio}
                                onChange={(valor) => setRangoPrecio(valor as [number, number])}
                                trackStyle={[{ backgroundColor: 'red' }]}
                                handleStyle={[{ borderColor: 'red', backgroundColor: 'red' }, { borderColor: 'red', backgroundColor: 'red' }]}
                            />
                            <div className="d-flex justify-content-between mt-2 text-white">
                                <span>Min: S/ {rangoPrecio[0].toFixed(2)}</span>
                                <span>Max: S/ {rangoPrecio[1].toFixed(2)}</span>
                            </div>

                            <h5 className="mb-2 mt-4 text-white">Plataformas</h5>
                            {todasLasPlataformas.map(plataforma => ( // Usa el estado `todasLasPlataformas`
                                <div key={plataforma.id} className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        value={plataforma.nombre}
                                        id={`plataforma-${plataforma.id}`}
                                        onChange={handleCambioPlataforma}
                                        checked={plataformasSeleccionadas.includes(plataforma.nombre)}
                                    />
                                    <label className="form-check-label text-white" htmlFor={`plataforma-${plataforma.id}`}>
                                        {plataforma.nombre}
                                    </label>
                                </div>
                            ))}

                            <button className="btn btn-secondary w-100 mt-3" onClick={alternarFiltroLateral}>
                                Cerrar Filtro
                            </button>
                        </div>
                    )}
                    {/* FIN DEL BLOQUE DE FILTRO LATERAL */}

                    <div className={`col ${mostrarFiltroLateral ? 'ms-md-3' : ''}`}>
                        <div className="container mt-5">
                            <h1 className="page-title">Catálogo de Juegos</h1>
                            {mensajeError && (
                                <div className="alert alert-danger text-center fw-bold" role="alert">
                                    {mensajeError}
                                </div>
                            )}
                            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                                {productosFiltrados.map(producto => (
                                    <div className="col" key={producto.id}>
                                        <div className="card h-100">
                                            {producto.descuento > 0 && (
                                                <div className="discount-badge">-{producto.descuento}%</div>
                                            )}
                                            <img
                                                src={producto.imagen}
                                                className="card-img-top game-cover"
                                                alt={`Portada de ${producto.nombre}`}
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = 'ruta/a/imagen/placeholder.jpg'; // Considera tener una imagen de placeholder real
                                                }}
                                            />
                                            <div className="card-body">
                                                <h5 className="card-title">{producto.nombre}</h5>
                                                <div className="mb-2">
                                                    {producto.plataformas.map(plataforma => (
                                                        <span key={plataforma.id} className="badge bg-secondary platform-badge">
                                                            {plataforma.nombre}
                                                        </span>
                                                    ))}
                                                </div>
                                                <p className="card-text">{producto.descripcion?.substring(0, 80)}...</p>
                                                <div className="rating mb-2">
                                                    {[...Array(Math.floor(producto.rating))].map((_, i) => (
                                                        <i key={`star-full-${producto.id}-${i}`} className="bi bi-star-fill text-warning"></i>
                                                    ))}
                                                    {producto.rating % 1 !== 0 && <i className="bi bi-star-half text-warning"></i>}
                                                    {[...Array(5 - Math.ceil(producto.rating))].map((_, i) => (
                                                        <i key={`star-empty-${producto.id}-${i}`} className="bi bi-star text-warning"></i>
                                                    ))}
                                                    <span className="text-muted ms-2">{producto.rating}/5</span>
                                                </div>
                                                <p className="precio">
                                                    {producto.descuento > 0 ? (
                                                        <>
                                                            <span className="old-price">
                                                                S/ {(producto.precio / (1 - producto.descuento / 100)).toFixed(2)}
                                                            </span>
                                                            <span className="new-price">
                                                                S/ {producto.precio.toFixed(2)}
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <span className="new-price">S/ {producto.precio.toFixed(2)}</span>
                                                    )}
                                                </p>
                                            </div>
                                            <div className="card-footer d-flex justify-content-between">
                                                <button
                                                    className="btn btn-sm btn-primary"
                                                    data-id={producto.id}
                                                    data-nombre={producto.nombre}
                                                    data-precio={producto.precio.toFixed(2)}
                                                    data-imagen={producto.imagen}
                                                    onClick={handleAgregarJuegoAlCarrito}
                                                >
                                                    Agregar al carrito
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-secondary"
                                                    onClick={() => {
                                                        setJuegoSeleccionado(producto);
                                                        setMostrarModalDetalle(true);
                                                    }}
                                                >
                                                    Detalles
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {productosFiltrados.length === 0 && (
                                    <div className="col-12 text-center">
                                        <p>No se encontraron juegos que coincidan con los filtros aplicados.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {juegoSeleccionado && (
                <DetalleJuego
                    juego={juegoSeleccionado}
                    show={mostrarModalDetalle}
                    onHide={() => setMostrarModalDetalle(false)}
                    onAddComment={handleAgregarComentario}
                />
            )}
            <BarraCarrito />
            <Footer />
        </div>
    );
}

export default Catalogo;