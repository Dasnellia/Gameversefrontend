import { URL_BACKEND } from '../config';

const URL = `${URL_BACKEND}/api/usuarios`;

// Obtener usuario autenticado
export const obtenerUsuarioAutenticado = async () => {
  try {
    // Intentar obtener token del localStorage si existe
    const token = localStorage.getItem('token');
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    // Si hay token, incluirlo en los headers
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${URL}/perfil`, {
      method: 'GET',
      headers,
      credentials: 'include', // Similar a `withCredentials: true` en Axios
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Limpiar localStorage si el token es inválido
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        localStorage.removeItem('autenticado');
        throw new Error('Sesión expirada - Usuario no autenticado');
      }
      if (response.status === 404) {
        throw new Error('Usuario no encontrado');
      }
      throw new Error(`Error del servidor: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener usuario autenticado:', error);
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Error de conexión con el servidor');
    }
    throw error;
  }
};

// Actualizar perfil
export const actualizarPerfil = async (id: number, datos: FormData) => {
  try {
    // Intentar obtener token del localStorage si existe
    const token = localStorage.getItem('token');
    
    const headers: HeadersInit = {};
    
    // Si hay token, incluirlo en los headers
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    // NO establecer Content-Type para FormData, el navegador lo hace automáticamente
    const response = await fetch(`${URL}/perfil/${id}`, {
      method: 'PUT',
      headers,
      body: datos,
      credentials: 'include', // Similar a `withCredentials: true` en Axios
    });

    if (!response.ok) {
      throw new Error('Error al actualizar el perfil');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Iniciar sesión
export const iniciarSesion = async (datos: { correo: string; contrasena: string }) => {
  try {
    const response = await fetch(`${URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datos),
      credentials: 'include', // Similar a `withCredentials: true` en Axios
    });

    if (!response.ok) {
      throw new Error('Credenciales inválidas');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
