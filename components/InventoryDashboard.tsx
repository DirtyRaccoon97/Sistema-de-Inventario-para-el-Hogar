

import React from 'react';
import type { InventoryItem, Location } from '../types';
import { InventoryItemCard } from './InventoryItemCard';
import { PlusIcon } from './Icons';

interface InventoryDashboardProps {
  items: InventoryItem[];
  locations: Location[];
  onAdjustQuantity: (id: number, newQuantity: number) => void;
  onEdit: (item: InventoryItem) => void;
  onDelete: (id: number) => void;
  onAddItem: () => void;
}

export const InventoryDashboard: React.FC<InventoryDashboardProps> = ({ items, locations, onAdjustQuantity, onEdit, onDelete, onAddItem }) => {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Tu inventario</h2>
        <button onClick={onAddItem} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 focus:ring-indigo-500 transition-colors">
          <PlusIcon className="w-5 h-5" />
          Añadir Item
        </button>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map(item => (
            <InventoryItemCard 
              key={item.id}
              item={item}
              locations={locations}
              onAdjustQuantity={onAdjustQuantity}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg">
          <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300">Tu inventario esta vacio</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Click "Añadir Item" para empezar.</p>
        </div>
      )}
    </div>
  );
};