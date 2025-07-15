import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../../css/Carrito.css';
import type { CarritoItem } from '../carrito/DetalleCarrito'; 
import { useNavigate } from 'react-router-dom';

import CarroVacio from '../../imagenes/CarroVacio.png';
import BarraNav from '../catalogo/BarraNavUser';

function CarritoPage() {
  const navigate = useNavigate();

  const obtenerCarrito = (): CarritoItem[] => {
    const carritoGuardado = localStorage.getItem('carrito');
    return carritoGuardado ? JSON.parse(carritoGuardado) : [];
  };

  const [carritoItems, setCarritoItems] = useState<CarritoItem[]>(obtenerCarrito());

  useEffect(() => {
    const handleStorageChange = () => {
      setCarritoItems(obtenerCarrito());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const guardarCarrito = (carrito: CarritoItem[]) => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  };

  const actualizarCarrito = (nuevoCarrito: CarritoItem[]) => {
    guardarCarrito(nuevoCarrito);
    setCarritoItems(nuevoCarrito);
  };

  const handleCantidadChange = (itemId: number, newCantidad: number) => {
    const nuevoCarrito = carritoItems.map((item) =>
      item.id === itemId ? { ...item, cantidad: Math.max(1, newCantidad) } : item
    );
    actualizarCarrito(nuevoCarrito);
  };

  const handleEliminarItem = (itemId: number) => {
    const nuevoCarrito = carritoItems.filter((item) => item.id !== itemId);
    actualizarCarrito(nuevoCarrito);
  };

  const handleVaciarCarrito = () => {
    localStorage.removeItem('carrito');
    setCarritoItems([]);
  };

  const envio = 15.0;
  const subtotal = carritoItems.reduce((acc, item) => acc + (item.precio || 0) * item.cantidad, 0);
  const total = subtotal + envio;

  const handleFinalizarCompra = () => {
    navigate('/Pago');
  };

  return (
    <div className="inicio-page">
      <BarraNav />
      <div className="contenedor-principal">
        <div className="container row">
          <div className="col-md-7" id="contenedor-carrito">
            {carritoItems.length === 0 ? (
              <div className="contenedor-carrito-vacio">
                <div id="carrito-vacio" className="mensaje-carrito-vacio d-flex flex-column align-items-center">
                  <img src={CarroVacio} alt="Carrito Vacío" className="icono-carrito-vacio" />
                  <p className="text-center mb-0">El carrito está vacío.</p>
                </div>
              </div>
            ) : (
              <div className="tabla-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>Artículo</th>
                      <th>Descripción</th>
                      <th>Cantidad</th>
                      <th>Total</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {carritoItems.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div className="item-info">
                            {item.imagen && (
                              <img
                                src={item.imagen}
                                alt={item.nombre}
                                style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                              />
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="item-details">
                            <h6 className="nombre-juego">{item.nombre}</h6>
                            <p className="text-secondary">S/ {item.precio?.toFixed(2)}</p>
                          </div>
                        </td>
                        <td>
                          <div className="input-group selector-cantidad">
                            <button className="btn btn-sm" onClick={() => handleCantidadChange(item.id, item.cantidad - 1)}>-</button>
                            <input
                              type="number"
                              className="form-control form-control-sm cantidad"
                              value={item.cantidad}
                              min="1"
                              onChange={(e) => handleCantidadChange(item.id, parseInt(e.target.value))}
                            />
                            <button className="btn btn-sm" onClick={() => handleCantidadChange(item.id, item.cantidad + 1)}>+</button>
                          </div>
                        </td>
                        <td className="text-end">S/ {(item.precio || 0 * item.cantidad).toFixed(2)}</td>
                        <td className="text-center">
                          <button className="btn btn-sm eliminar" onClick={() => handleEliminarItem(item.id)}>
                            <i className="bi bi-trash3"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {carritoItems.length > 0 && (
              <div className="text-end mt-3">
                <button className="btn btn-danger d-flex align-items-center" onClick={handleVaciarCarrito}>
                  <i className="bi bi-trash3-fill me-2" style={{ fontSize: '1.2rem' }}></i>
                  Vaciar Carrito
                </button>
              </div>
            )}
          </div>

          {/* Resumen del pedido */}
          <div className="col-md-4" id="resumen-pedido">
            <h4>Resumen del pedido</h4>
            <div className="resumen-linea">
              <span>Subtotal:</span>
              <span className="monto-subtotal">S/ {subtotal.toFixed(2)}</span>
            </div>
            <div className="resumen-linea">
              <span>Comisión:</span>
              <span className="monto-envio">
                {carritoItems.length > 0 ? `S/ ${envio.toFixed(2)}` : 'S/ 0.00'}
              </span>
            </div>
            <div className="resumen-linea total">
              <span>Total:</span>
              <span className="monto-total">
                {carritoItems.length > 0 ? `S/ ${total.toFixed(2)}` : `S/ ${subtotal.toFixed(2)}`}
              </span>
            </div>
            <button className="boton-finalizar-compra" disabled={subtotal === 0} onClick={handleFinalizarCompra}>
              Finalizar compra
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CarritoPage;