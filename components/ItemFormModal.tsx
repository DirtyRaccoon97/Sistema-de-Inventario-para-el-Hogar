

import React, { useState, useEffect } from 'react';
import type { InventoryItem, Location } from '../types';
import { FoodType, UnitOfMeasure } from '../types';
import { FOOD_TYPE_OPTIONS, UNIT_OPTIONS } from '../constants';
import { CloseIcon } from './Icons';

interface ItemFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (item: Omit<InventoryItem, 'id' | 'dateAdded'>, id?: number) => void;
  itemToEdit?: InventoryItem | null;
  locations: Location[];
}

const initialFormState: Omit<InventoryItem, 'id' | 'dateAdded'> = {
  name: '',
  foodType: FoodType.OTHER,
  brand: '',
  expirationDate: '',
  quantity: 1,
  unit: UnitOfMeasure.ITEM,
  locationId: 0,
};

export const ItemFormModal: React.FC<ItemFormModalProps> = ({ isOpen, onClose, onSubmit, itemToEdit, locations }) => {
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    const defaultState = { ...initialFormState, locationId: locations[0]?.id || 0 };
    if (itemToEdit) {
      setFormData({
          name: itemToEdit.name,
          foodType: itemToEdit.foodType,
          brand: itemToEdit.brand || '',
          expirationDate: itemToEdit.expirationDate || '',
          quantity: itemToEdit.quantity,
          unit: itemToEdit.unit,
          locationId: itemToEdit.locationId
      });
    } else {
      setFormData(defaultState);
    }
  }, [itemToEdit, isOpen, locations]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: (name === 'quantity' || name === 'locationId') ? Number(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.quantity > 0) {
      onSubmit(formData, itemToEdit?.id);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <h2 className="text-xl font-bold">{itemToEdit ? 'Editar Item' : 'Añadir Nuevo Item'}</h2>
            <button onClick={onClose} className="p-1 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"><CloseIcon className="w-6 h-6"/></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Nombre Item</label>
            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Cantidad</label>
              <input type="number" name="quantity" id="quantity" min="0" value={formData.quantity} onChange={handleChange} required className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="unit" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Unidad</label>
              <select name="unit" id="unit" value={formData.unit} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                {UNIT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="foodType" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Tipo</label>
                <select name="foodType" id="foodType" value={formData.foodType} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                    {FOOD_TYPE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
            </div>
            <div>
              <label htmlFor="locationId" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Ubicacion</label>
              <select name="locationId" id="locationId" value={formData.locationId} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                  {locations.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
              <label htmlFor="brand" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Marca (Opcional)</label>
              <input type="text" name="brand" id="brand" value={formData.brand} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="expirationDate" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Fecha de Expiracion (Opcional)</label>
              <input type="date" name="expirationDate" id="expirationDate" value={formData.expirationDate} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
          </div>
          
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-500 rounded-md shadow-sm hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800 focus:ring-indigo-500">Cancelar</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800 focus:ring-indigo-500">{itemToEdit ? 'Guardar Cambios' : 'Añadir Item'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};