import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

interface Usuario {
  id: number;
  nickname: string;
  correo: string;
  tipo: string;
  imagen?: string;
  pais?: string;
}

interface UserContextType {
  usuario: Usuario | null;
  autenticado: boolean;
  isLoading: boolean;
  login: (datos: Usuario) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser debe usarse dentro de un UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [usuario, setUsuario] = useState<Usuario | null>(() => {
    const userGuardado = localStorage.getItem('usuario');
    return userGuardado ? JSON.parse(userGuardado) : null;
  });

  const [autenticado, setAutenticado] = useState<boolean>(() => {
    const estadoGuardado = localStorage.getItem('autenticado');
    return estadoGuardado === 'true';
  });

  // Initialize loading state
  useEffect(() => {
    setIsLoading(false);
  }, []);

  const login = (datos: Usuario) => {
    setUsuario(datos);
    setAutenticado(true);
    localStorage.setItem('usuario', JSON.stringify(datos));
    localStorage.setItem('autenticado', 'true');
  };

  const logout = () => {
    setUsuario(null);
    setAutenticado(false);
    localStorage.removeItem('usuario');
    localStorage.removeItem('autenticado');
    localStorage.removeItem('token'); // 🔥 TAMBIÉN LIMPIAR EL TOKEN
  };
  
  // ✅ Verificar sesión con cookie al montar
  useEffect(() => {
    fetch('https://be-60j9.onrender.com/api/usuarios/perfil', {
      credentials: 'include'
    })
      .then(res => {
        if (!res.ok) throw new Error('No autenticado');
        return res.json();
      })
      .then(data => {
        console.log('✅ Usuario autenticado desde cookie:', data);
        login(data);
      })
      .catch(err => {
        console.warn('⚠️ No hay sesión activa (cookie expirada o inválida):', err.message);
        logout(); // Por si había info vieja en localStorage
      });
  }, []);

  return (
    <UserContext.Provider value={{ usuario, autenticado, isLoading, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

