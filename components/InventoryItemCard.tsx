import React from 'react';
import type { InventoryItem } from '../types';
import { Location } from '../types';
import { PlusIcon, MinusIcon, EditIcon, TrashIcon, FridgeIcon, PantryIcon, FreezerIcon, CounterIcon, AlertTriangleIcon } from './Icons';

interface InventoryItemCardProps {
  item: InventoryItem;
  onAdjustQuantity: (id: number, newQuantity: number) => void;
  onEdit: (item: InventoryItem) => void;
  onDelete: (id: number) => void;
}

const LocationIcon: React.FC<{ location: Location }> = ({ location }) => {
    const iconProps = { className: 'w-5 h-5 mr-2 text-slate-500 dark:text-slate-400' };
    switch (location) {
        case Location.REFRIGERATOR: return <FridgeIcon {...iconProps} />;
        case Location.PANTRY: return <PantryIcon {...iconProps} />;
        case Location.FREEZER: return <FreezerIcon {...iconProps} />;
        case Location.COUNTER: return <CounterIcon {...iconProps} />;
        default: return null;
    }
};

const ExpirationBadge: React.FC<{ expDate?: string }> = ({ expDate }) => {
    if (!expDate) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiration = new Date(expDate);
    const diffTime = expiration.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let text: string;
    let colorClasses: string;
    let icon: React.ReactNode | null = null;
    
    const dayText = (days: number) => Math.abs(days) === 1 ? 'día' : 'días';

    if (diffDays < 0) {
        text = `Expiró hace ${Math.abs(diffDays)} ${dayText(diffDays)}`;
        colorClasses = 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
        icon = <AlertTriangleIcon className="w-4 h-4 mr-1.5" />;
    } else if (diffDays === 0) {
        text = 'Expira hoy';
        colorClasses = 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
        icon = <AlertTriangleIcon className="w-4 h-4 mr-1.5" />;
    } else if (diffDays <= 3) {
        text = `Expira en ${diffDays} ${dayText(diffDays)}`;
        colorClasses = 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
        icon = <AlertTriangleIcon className="w-4 h-4 mr-1.5" />;
    } else if (diffDays <= 7) {
        text = `Expira en ${diffDays} ${dayText(diffDays)}`;
        colorClasses = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    } else {
        text = `Expira en ${diffDays} ${dayText(diffDays)}`;
        colorClasses = 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    }

    return (
        <span className={`inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full ${colorClasses}`}>
            {icon}
            {text}
        </span>
    );
};

export const InventoryItemCard: React.FC<InventoryItemCardProps> = ({ item, onAdjustQuantity, onEdit, onDelete }) => {
  const isOutOfStock = item.quantity === 0;
  return (
    <div className={`shadow-md rounded-lg p-5 flex flex-col justify-between transition-all hover:shadow-lg hover:-translate-y-1 ${isOutOfStock ? 'opacity-70 bg-slate-50 dark:bg-slate-800/50' : 'bg-white dark:bg-slate-800'}`}>
      <div>
        <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{item.name}</h3>
            <span className="text-xs font-semibold px-2 py-1 bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 rounded-full">{item.foodType}</span>
        </div>
        {item.brand && <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{item.brand}</p>}
        {isOutOfStock && <p className="text-sm font-semibold text-amber-600 dark:text-amber-400 mb-3">Sin stock.</p>}


        <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300 mb-4">
            <div className="flex items-center">
                <LocationIcon location={item.location} />
                <span>{item.location}</span>
            </div>
            <div className="flex items-center">
                <ExpirationBadge expDate={item.expirationDate}/>
            </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <button onClick={() => onAdjustQuantity(item.id, item.quantity - 1)} className="p-2 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors" disabled={isOutOfStock}>
            <MinusIcon className="w-4 h-4 text-slate-600 dark:text-slate-300"/>
          </button>
          <span className="font-bold text-lg w-16 text-center">{item.quantity} <span className="text-sm text-slate-500">{item.unit}</span></span>
          <button onClick={() => onAdjustQuantity(item.id, item.quantity + 1)} className="p-2 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
            <PlusIcon className="w-4 h-4 text-slate-600 dark:text-slate-300"/>
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => onEdit(item)} className="p-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            <EditIcon className="w-5 h-5"/>
          </button>
          <button onClick={() => onDelete(item.id)} className="p-2 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-500 transition-colors">
            <TrashIcon className="w-5 h-5"/>
          </button>
        </div>
      </div>
    </div>
  );
};