import React from 'react';
import type { Movement } from '../types';
import { MovementType } from '../types';

interface MovementHistoryProps {
  movements: Movement[];
}

const MovementBadge: React.FC<{ type: MovementType }> = ({ type }) => {
  const baseClasses = 'px-2 py-1 text-xs font-semibold rounded-full';
  let colorClasses = '';

  switch (type) {
    case MovementType.ADDED:
      colorClasses = 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      break;
    case MovementType.USED:
      colorClasses = 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      break;
    case MovementType.DISCARDED:
      colorClasses = 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      break;
    default:
      colorClasses = 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200';
      break;
  }
  return <span className={`${baseClasses} ${colorClasses}`}>{type}</span>;
};

export const MovementHistory: React.FC<MovementHistoryProps> = ({ movements }) => {
  const sortedMovements = [...movements].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="w-full max-w-4xl mx-auto mt-6">
      <div className="bg-white dark:bg-slate-800 shadow-md rounded-lg overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-bold">Historial de Movimientos</h2>
        </div>
        <div className="overflow-x-auto">
          {sortedMovements.length === 0 ? (
            <p className="text-center text-slate-500 dark:text-slate-400 py-12">No hay movimientos registrados aún.</p>
          ) : (
            <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
              <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
                <tr>
                  <th scope="col" className="px-6 py-3">Item</th>
                  <th scope="col" className="px-6 py-3">Tipo</th>
                  <th scope="col" className="px-6 py-3">cantidad cambios</th>
                  <th scope="col" className="px-6 py-3">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {sortedMovements.map(movement => (
                  <tr key={movement.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600/50">
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white whitespace-nowrap">{movement.itemName}</td>
                    <td className="px-6 py-4"><MovementBadge type={movement.type} /></td>
                    <td className="px-6 py-4">{movement.quantityChange}</td>
                    <td className="px-6 py-4">{new Date(movement.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};