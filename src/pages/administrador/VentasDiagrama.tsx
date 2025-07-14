import { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { URL_BACKEND } from '../../config';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/Estadisticas.css';

const DiagramadeVentas = () => {
  const [totales, setTotales] = useState<number[]>([]);
  const [año, setAño] = useState<number>(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const res = await fetch(`${URL_BACKEND}/api/estadisticas/ventas-por-mes`, {
          credentials: 'include'
        });

        if (!res.ok) {
          throw new Error('Error al obtener datos de ventas');
        }

        const data = await res.json();

        setTotales(data.totalesPorMes || []);
        setAño(new Date().getFullYear());

      } catch (error) {
        console.error('Error obteniendo datos:', error);
        setError('Error al cargar el gráfico de ventas');
      } finally {
        setLoading(false);
      }
    };

    obtenerDatos();
  }, []);

  if (loading) {
    return <div className="text-center p-4">Cargando gráfico...</div>;
  }

  if (error) {
    return <div className="alert alert-danger m-3">{error}</div>;
  }

  const options = {
    chart: {
      type: 'spline',
      backgroundColor: 'transparent',
      style: { fontFamily: 'inherit' }
    },
    title: {
      text: '',
      style: { color: '#f8f9fa' }
    },
    xAxis: {
      categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      labels: { style: { color: '#f8f9fa' } },
      lineColor: 'rgba(255, 255, 255, 0.2)',
      tickColor: 'rgba(255, 255, 255, 0.2)'
    },
    yAxis: {
      title: {
        text: 'Ventas (S/)',
        style: { color: '#f8f9fa' }
      },
      labels: { style: { color: '#f8f9fa' } },
      gridLineColor: 'rgba(255, 255, 255, 0.1)',
      lineColor: 'rgba(255, 255, 255, 0.2)'
    },
    legend: { itemStyle: { color: '#f8f9fa' } },
    tooltip: {
      shared: true,
      valuePrefix: 'S/ ',
      valueDecimals: 2
    },
    series: [{
      name: `Ventas ${año}`,
      data: totales,
      color: '#d10000',
      marker: {
        fillColor: '#ffffff',
        lineWidth: 2,
        lineColor: '#d10000'
      }
    }],
    credits: { enabled: false },
    exporting: {
      enabled: true,
      buttons: {
        contextButton: {
          symbolStroke: '#f8f9fa',
          theme: { fill: 'transparent' }
        }
      }
    }
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default DiagramadeVentas;
