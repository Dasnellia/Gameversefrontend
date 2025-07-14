import React, { useEffect, useState } from "react";
import NavBarra from "./BarraNavAdmin";
import DiagramadeVentas from "./VentasDiagrama";
import { useUser } from "../../context/UserContext";
import { URL_BACKEND } from "../../config";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../../css/Estadisticas.css";

interface StatCardProps {
  title: string;
  value: string;
  percentage: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, percentage }) => {
  return (
    <div className="card stat-card h-100 shadow">
      <div className="card-body d-flex flex-column">
        <h3 className="card-title">{title}</h3>
        <div className="display-4 my-3">
          <p>{value}</p>
        </div>
        <div
          className={`mt-auto fs-5 ${
            percentage >= 0 ? "text-success" : "text-danger"
          }`}
        >
          <i
            className={percentage >= 0 ? "bi bi-arrow-up" : "bi bi-arrow-down"}
          ></i>
          {Math.abs(percentage)}% vs ayer
        </div>
      </div>
    </div>
  );
};

const MainContent = () => {
  const [ventasHoy, setVentasHoy] = useState(0);
  const [usuarios, setUsuarios] = useState(0);
  const [crecimiento, setCrecimiento] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarDatos = async () => {
    try {
      const [ventasRes, usuariosRes] = await Promise.all([
        fetch(`${URL_BACKEND}/api/estadisticas/ventas-hoy`, {
          credentials: 'include',
        }),
        fetch(`${URL_BACKEND}/api/estadisticas/total-usuarios`, {
          credentials: 'include',
        }),
      ]);

      if (!ventasRes.ok || !usuariosRes.ok) {
        const errorVentas = !ventasRes.ok ? await ventasRes.text() : "";
        const errorUsuarios = !usuariosRes.ok ? await usuariosRes.text() : "";
        console.error("Error ventas:", errorVentas);
        console.error("Error usuarios:", errorUsuarios);
        throw new Error("Error al obtener estadísticas");
      }

      const ventasData = await ventasRes.json();
      const usuariosData = await usuariosRes.json();

      setVentasHoy(Number(ventasData?.totalHoy) || 0);
      setCrecimiento(Number(ventasData?.crecimiento) || 0);
      setUsuarios(Number(usuariosData?.total) || 0);
    } catch (error) {
      console.error("Error cargando datos:", error);
      setError("Error al cargar las estadísticas");
    } finally {
      setLoading(false);
    }
  };

  cargarDatos();
  }, []);

  if (loading) {
    return <div className="text-center p-4">Cargando estadísticas...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="main-content">
      <div className="container-fluid px-4 py-3">
        <h1 className="mb-4 display-5">Dashboard de Ventas</h1>

        <div className="row g-4 mb-4">
          <div className="col-md-6">
            <StatCard title="Ventas Hoy" value={`S/ ${ventasHoy.toLocaleString()}`} percentage={crecimiento} />
          </div>
          <div className="col-md-6">
            <StatCard title="Usuarios registrados" value={`${usuarios}`} percentage={0} />
          </div>
        </div>

        <div className="row">
          <div className="col">
            <div className="card shadow-lg h-100">
              <div className="card-header">
                <h2 className="m-0">Ventas Mensuales</h2>
              </div>
              <div className="card-body">
                <DiagramadeVentas />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Estadisticas = () => {
  const { autenticado, usuario } = useUser();

    if (!autenticado || usuario?.tipo.toLowerCase() !== "admin") {
      return (
        <div className="d-flex vh-100">
          <NavBarra />
          <div className="content flex-grow-1 overflow-auto d-flex justify-content-center align-items-center">
            <div className="alert-custom-restringido">
              <h4 className="mb-2">Acceso restringido</h4>
              <p>
                Debes iniciar sesión con una cuenta <strong>administrador</strong> para ver el panel de estadísticas.
              </p>
            </div>
          </div>
        </div>
      );
    }

  return (
    <div className="d-flex vh-100">
      <NavBarra />
      <div className="content flex-grow-1 overflow-auto">
        <MainContent />
      </div>
    </div>
  );
};

export default Estadisticas;
