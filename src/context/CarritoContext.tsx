import { createContext, useContext, useState } from "react";
import type { ReactNode } from 'react';

export interface JuegoCarrito {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
}

interface CarritoContextType {
  carrito: JuegoCarrito[];
  agregarAlCarrito: (juego: JuegoCarrito) => void;
  vaciarCarrito: () => void;
}

const CarritoContext = createContext<CarritoContextType | undefined>(undefined);

export const CarritoProvider = ({ children }: { children: ReactNode }) => {
  const [carrito, setCarrito] = useState<JuegoCarrito[]>(
    JSON.parse(localStorage.getItem("carrito") || "[]")
  );

  const guardarEnLocalStorage = (items: JuegoCarrito[]) => {
    localStorage.setItem("carrito", JSON.stringify(items));
    setCarrito(items);
  };

  const agregarAlCarrito = (juego: JuegoCarrito) => {
    const existente = carrito.find((j) => j.id === juego.id);
    if (existente) {
      const actualizado = carrito.map((j) =>
        j.id === juego.id ? { ...j, cantidad: j.cantidad + juego.cantidad } : j
      );
      guardarEnLocalStorage(actualizado);
    } else {
      guardarEnLocalStorage([...carrito, juego]);
    }
  };

  const vaciarCarrito = () => {
    guardarEnLocalStorage([]);
  };

  return (
    <CarritoContext.Provider value={{ carrito, agregarAlCarrito, vaciarCarrito }}>
      {children}
    </CarritoContext.Provider>
  );
};

export const useCarrito = () => {
  const context = useContext(CarritoContext);
  if (!context) throw new Error("useCarrito debe usarse dentro de CarritoProvider");
  return context;
};
