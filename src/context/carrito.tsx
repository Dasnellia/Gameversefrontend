export interface CarritoItem {
  id: number;
  nombre: string;
  precio?: number;
  cantidad: number;
  imagen?: string;
}

export function handleAgregarAlCarrito(evento: React.MouseEvent<HTMLButtonElement>) {
  const boton = evento.currentTarget;
  const id = parseInt(boton.dataset.id || '', 10);
  const nombre = boton.dataset.nombre;
  const precio = boton.dataset.precio ? parseFloat(boton.dataset.precio) : undefined;
  const imagen = boton.dataset.imagen;

  if (!id || !nombre || precio === undefined || !imagen) return;

  const nuevoItem: CarritoItem = {
    id,
    nombre,
    precio,
    cantidad: 1,
    imagen
  };

  const carritoExistente = localStorage.getItem('carrito');
  const carrito: CarritoItem[] = carritoExistente ? JSON.parse(carritoExistente) : [];

  const index = carrito.findIndex(item => item.id === nuevoItem.id);
  if (index !== -1) {
    carrito[index].cantidad += 1;
  } else {
    carrito.push(nuevoItem);
  }

  localStorage.setItem('carrito', JSON.stringify(carrito));
}

export function mostrarMensajeToast(mensaje: string) {
  const toast = document.getElementById('toast');
  if (toast) {
    toast.textContent = mensaje;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  }
}
