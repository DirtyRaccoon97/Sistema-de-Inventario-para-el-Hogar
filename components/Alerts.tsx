import React from 'react';
import type { InventoryItem } from '../types';
import { AlertTriangleIcon } from './Icons';

interface AlertsProps {
  items: InventoryItem[];
}

export const Alerts: React.FC<AlertsProps> = ({ items }) => {
  const expiredItems = items.filter(item => {
    if (!item.expirationDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiration = new Date(item.expirationDate);
    return expiration < today;
  });

  const outOfStockItems = items.filter(item => item.quantity === 0);

  const totalAlerts = expiredItems.length + outOfStockItems.length;

  if (totalAlerts === 0) {
    return null;
  }

  return (
    <div className="mb-6 bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 text-yellow-800 dark:text-yellow-200 p-4 rounded-r-lg" role="alert">
      <div className="flex items-center">
        <AlertTriangleIcon className="w-6 h-6 mr-3 text-yellow-500" />
        <h3 className="text-lg font-bold">Aviso! Tienes {totalAlerts} alerta{totalAlerts > 1 ? 's' : ''}.</h3>
      </div>
      <div className="mt-3 ml-9 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm">
        {outOfStockItems.length > 0 && (
          <div>
            <h4 className="font-semibold">Sin Stock:</h4>
            <ul className="list-disc list-inside">
              {outOfStockItems.map(item => (
                <li key={item.id}>{item.name}</li>
              ))}
            </ul>
          </div>
        )}
        {expiredItems.length > 0 && (
          <div>
            <h4 className="font-semibold">Items Expirados:</h4>
            <ul className="list-disc list-inside">
              {expiredItems.map(item => (
                <li key={item.id}>{item.name} (Expiró el {item.expirationDate})</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};