import axios from 'axios';
import { URL_BACKEND } from '../config';

const API_URL = `${URL_BACKEND}/api/noticias`;

// Obtener todas las noticias
export const listarNoticias = async () => {
  const respuesta = await axios.get(API_URL);
  return respuesta.data;
};

// Crear nueva noticia (requiere FormData con campos: name, descripcion, foto)
export const crearNoticia = async (formData: FormData) => {
  const respuesta = await axios.post(`${URL_BACKEND}/api/noticias`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    withCredentials: true,
  });
  return respuesta.data;
};

// Editar una noticia (puede ser con o sin imagen)
export const editarNoticia = async (id: number, formData: FormData) => {
  const respuesta = await axios.put(`${URL_BACKEND}/api/noticias/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    withCredentials: true,
  });
  return respuesta.data;
};

export const eliminarNoticia = async (id: number) => {
  const res = await axios.delete(`${URL_BACKEND}/api/noticias/${id}`, {
    withCredentials: true,
  });
  return res.data;
};