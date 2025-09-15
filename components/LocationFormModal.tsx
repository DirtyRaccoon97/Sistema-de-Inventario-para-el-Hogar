import React, { useState, useEffect } from 'react';
import type { Location } from '../types';
import { CloseIcon } from './Icons';

interface LocationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: number | undefined, name: string) => void;
  locationToEdit?: Location | null;
}

export const LocationFormModal: React.FC<LocationFormModalProps> = ({ isOpen, onClose, onSubmit, locationToEdit }) => {
  const [name, setName] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName(locationToEdit?.name || '');
    }
  }, [isOpen, locationToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(locationToEdit?.id, name.trim());
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl w-full max-w-md">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-xl font-bold">{locationToEdit ? 'Editar Ubicación' : 'Añadir Nueva Ubicación'}</h2>
          <button onClick={onClose} className="p-1 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700">
            <CloseIcon className="w-6 h-6"/>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="location-name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Nombre de la Ubicación</label>
            <input
              type="text"
              name="location-name"
              id="location-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-500 rounded-md shadow-sm hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800 focus:ring-indigo-500">Cancelar</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800 focus:ring-indigo-500">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
};
