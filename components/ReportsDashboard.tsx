import React, { useMemo } from 'react';
import type { InventoryItem, Movement, Location } from '../types';
import { MovementType } from '../types';
import { DownloadIcon } from './Icons';

// Declare global variables from CDN scripts
declare var XLSX: any;
declare var jspdf: any;

interface ReportsDashboardProps {
  items: InventoryItem[];
  movements: Movement[];
  locations: Location[];
}

interface ChartData {
  date: string;
  total: number;
}

const BarChart: React.FC<{ data: ChartData[] }> = ({ data }) => {
  const maxValue = Math.max(...data.map(d => d.total), 1); // Avoid division by zero
  const chartHeight = 200;
  const barWidth = 30;
  const barMargin = 15;
  const chartWidth = data.length * (barWidth + barMargin);

  return (
    <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-inner overflow-x-auto">
        <svg width={chartWidth} height={chartHeight + 40} className="text-slate-600 dark:text-slate-400">
          <g transform="translate(0, 10)">
            {data.map((d, i) => {
              const barHeight = (d.total / maxValue) * chartHeight;
              return (
                <g key={d.date} transform={`translate(${i * (barWidth + barMargin)}, 0)`}>
                  <rect
                    className="fill-current text-indigo-500 hover:text-indigo-400 transition-colors"
                    x="0"
                    y={chartHeight - barHeight}
                    width={barWidth}
                    height={barHeight}
                    rx="2"
                  />
                  <text className="text-xs fill-current" x={barWidth / 2} y={chartHeight + 15} textAnchor="middle">{d.date}</text>
                  <text className="text-xs font-bold fill-current" x={barWidth / 2} y={chartHeight - barHeight - 5} textAnchor="middle">{d.total > 0 ? d.total : ''}</text>
                </g>
              );
            })}
          </g>
        </svg>
    </div>
  );
};


export const ReportsDashboard: React.FC<ReportsDashboardProps> = ({ items, movements, locations }) => {
  
  const getLocationName = (locationId: number) => {
    return locations.find(l => l.id === locationId)?.name || 'N/A';
  };

  const handleExportExcel = () => {
    const dataToExport = items.map(item => ({
      Nombre: item.name,
      Tipo: item.foodType,
      Marca: item.brand || 'N/A',
      Cantidad: item.quantity,
      Unidad: item.unit,
      Ubicación: getLocationName(item.locationId),
      Expiración: item.expirationDate || 'N/A',
      'Fecha de Adición': item.dateAdded,
    }));
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");
    XLSX.writeFile(workbook, "home-inventory.xlsx");
  };

  const handleExportPDF = () => {
    const doc = new jspdf.jsPDF();
    doc.text("Reporte de Inventario del Hogar", 14, 16);
    (doc as any).autoTable({
        startY: 22,
        head: [['Nombre', 'Tipo', 'Marca', 'Cantidad', 'Unidad', 'Ubicación', 'Expiración']],
        body: items.map(item => [
            item.name,
            item.foodType,
            item.brand || 'N/A',
            item.quantity,
            item.unit,
            getLocationName(item.locationId),
            item.expirationDate || 'N/A'
        ]),
    });
    doc.save('home-inventory.pdf');
  };

  const consumptionData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setHours(0,0,0,0);
        d.setDate(d.getDate() - i);
        return d;
    }).reverse();

    return last7Days.map(date => {
        const dateString = date.toISOString().split('T')[0];
        const total = movements
            .filter(m => (m.type === MovementType.USED || m.type === MovementType.DISCARDED) && m.timestamp.startsWith(dateString))
            .reduce((sum, m) => sum + m.quantityChange, 0);
        return {
            date: date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }),
            total,
        };
    });
  }, [movements]);

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-slate-800 shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Exportar Inventario</h2>
        <div className="flex flex-wrap gap-4">
            <button onClick={handleExportExcel} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800 focus:ring-green-500">
                <DownloadIcon className="w-5 h-5"/>
                Exportar a Excel (.xlsx)
            </button>
            <button onClick={handleExportPDF} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800 focus:ring-red-500">
                <DownloadIcon className="w-5 h-5"/>
                Exportar a PDF (.pdf)
            </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Grafico de Consumo</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Total de artículos usados ​​o descartados en los últimos 7 días.</p>
        <BarChart data={consumptionData} />
      </div>
    </div>
  );
};