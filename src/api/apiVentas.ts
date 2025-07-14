import { URL_BACKEND } from '../config';

export async function verificarCompra(usuarioId: number, juegoId: number) {
  const res = await fetch(`${URL_BACKEND}/api/ventas/verificar-compra/${usuarioId}/${juegoId}`);
  const data = await res.json();
  return data.comprado;
}