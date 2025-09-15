import React from 'react';
import type { Location } from '../types';
import { PlusIcon, EditIcon, TrashIcon } from './Icons';

interface LocationManagementProps {
    locations: Location[];
    onAdd: () => void;
    onEdit: (location: Location) => void;
    onDelete: (id: number) => void;
}

export const LocationManagement: React.FC<LocationManagementProps> = ({ locations, onAdd, onEdit, onDelete }) => {
    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Gestionar Ubicaciones</h2>
                <button
                    onClick={onAdd}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 focus:ring-indigo-500 transition-colors"
                >
                    <PlusIcon className="w-5 h-5" />
                    Añadir Ubicación
                </button>
            </div>
            <div className="bg-white dark:bg-slate-800 shadow-md rounded-lg">
                <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                    {locations.map(location => (
                        <li key={location.id} className="p-4 flex justify-between items-center">
                            <span className="font-medium text-slate-800 dark:text-slate-200">{location.name}</span>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => onEdit(location)}
                                    className="p-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                    aria-label={`Edit ${location.name}`}
                                >
                                    <EditIcon className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => onDelete(location.id)}
                                    className="p-2 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-500 transition-colors"
                                    aria-label={`Delete ${location.name}`}
                                >
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
                {locations.length === 0 && (
                     <p className="text-center text-slate-500 dark:text-slate-400 py-12">No se han añadido ubicaciones.</p>
                )}
            </div>
        </div>
    );
};