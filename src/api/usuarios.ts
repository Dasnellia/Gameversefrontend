import { URL_BACKEND } from '../config';

const API_URL = `${URL_BACKEND}/api/usuarios`;

export const registrarUsuario = async (usuario: any) => {
  const res = await fetch(`${API_URL}/registro`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(usuario),
  });
  return res.json();
};

export const iniciarSesion = async (credenciales: any) => {
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credenciales),
  });
  return res.json();
};

export const obtenerJuegos = async () => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Error al obtener juegos');
  return res.json();
};

export const obtenerJuegoPorId = async (id: number) => {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error('Juego no encontrado');
  return res.json();
};

export const filtrarJuegos = async (nombre?: string, categoria?: string, plataforma?: string) => {
  const params = new URLSearchParams();
  if (nombre) params.append('nombre', nombre);
  if (categoria) params.append('categoria', categoria);
  if (plataforma) params.append('plataforma', plataforma);

  const res = await fetch(`${API_URL}/filtros/buscar?${params.toString()}`);
  if (!res.ok) throw new Error('Error al filtrar juegos');
  return res.json();
};