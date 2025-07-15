import '../../css/EditarNoticia.css';

export interface CarritoItem {
  id: number;
  nombre: string;
  precio?: number;
  cantidad: number;
  imagen?: string;
}

interface DetalleCarritoProps {
  item: CarritoItem;
  onIncrementar: (id: number) => void;
  onDecrementar: (id: number) => void;
  onEliminar: (id: number) => void;
}

function DetalleCarrito({ item, onIncrementar, onDecrementar, onEliminar }: DetalleCarritoProps) {
  return (
    <div className="detalle-carrito-card">
      <div className="detalle-carrito-imagen">
        <img
          src={item.imagen || 'https://via.placeholder.com/100'} 
          alt={item.nombre}
          className="detalle-carrito-img"
          style={{ width: '100px', height: '100px', objectFit: 'cover' }}
        />
      </div>
      <div className="detalle-carrito-info">
        <h5 className="detalle-carrito-nombre">{item.nombre}</h5>
        <p className="detalle-carrito-precio">S/ {(item.precio || 0).toFixed(2)}</p>
        <div className="detalle-carrito-controles">
          <button onClick={() => onDecrementar(item.id)} className="detalle-carrito-btn">-</button>
          <span className="detalle-carrito-cantidad">{item.cantidad}</span>
          <button onClick={() => onIncrementar(item.id)} className="detalle-carrito-btn">+</button>
          <button onClick={() => onEliminar(item.id)} className="detalle-carrito-btn eliminar">
            <i className="bi bi-trash3-fill"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default DetalleCarrito;