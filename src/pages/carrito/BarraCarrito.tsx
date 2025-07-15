import { useState, useEffect } from 'react';
import '../../css/BarraCarrito.css';
import { Link } from 'react-router-dom';
import type { CarritoItem } from '../carrito/DetalleCarrito'; 

const BarraCarrito = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [carritoItems, setCarritoItems] = useState<CarritoItem[]>(() => {
    const carritoGuardado = localStorage.getItem('carrito');
    return carritoGuardado ? JSON.parse(carritoGuardado) : [];
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const carritoGuardado = localStorage.getItem('carrito');
      setCarritoItems(carritoGuardado ? JSON.parse(carritoGuardado) : []);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const mostrarCarrito = () => {
    setIsVisible(!isVisible);
  };

  const itemsMostrados = carritoItems.slice(0, 7);
  const cantidadItemsRestantes = carritoItems.length - itemsMostrados.length;

  const handleEliminarItem = (id: number) => {
    const nuevoCarrito = carritoItems.filter(item => item.id !== id);
    localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
    setCarritoItems(nuevoCarrito);
  };

  return (
    <div className="barra-carrito-container">
      <button className="barra-carrito-toggle-btn fixed-bottom-left" onClick={mostrarCarrito}>
        <i className="bi bi-cart3"></i>
      </button>

      <div className={`barra-carrito-slide ${isVisible ? 'visible' : ''}`}>
        <div className="carrito-contenido">
          {carritoItems.length === 0 ? (
            <p className="carrito-vacio-mensaje">El carrito está vacío.</p>
          ) : (
            <ul>
              {itemsMostrados.map(item => (
                <li key={item.id} className="carrito-item">
                  <div className="item-visual">
                    {item.imagen && (
                      <img src={item.imagen} alt={item.nombre} className="item-imagen" />
                    )}
                    <button onClick={() => handleEliminarItem(item.id)} className="eliminar-item-btn">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <span className="item-nombre">{item.nombre}</span>
                </li>
              ))}
              {cantidadItemsRestantes > 0 && (
                <li className="carrito-item more-items">
                  <Link to="/carrito" className="more-items-link">
                    +{cantidadItemsRestantes}
                  </Link>
                </li>
              )}
            </ul>
          )}
        </div>
        <div className="carrito-actions">
          <Link to="/carrito" className="ir-a-carrito-btn">
            Ver Carrito Completo
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BarraCarrito;