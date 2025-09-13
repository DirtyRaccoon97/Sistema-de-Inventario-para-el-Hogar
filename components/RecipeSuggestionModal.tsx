import React, { Fragment } from 'react';
import type { Recipe } from '../types';
import { CloseIcon, SparklesIcon } from './Icons';

interface RecipeSuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipes: Recipe[] | null;
  isLoading: boolean;
  error: string | null;
}

export const RecipeSuggestionModal: React.FC<RecipeSuggestionModalProps> = ({ isOpen, onClose, recipes, isLoading, error }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center">
            <SparklesIcon className="w-6 h-6 mr-2 text-indigo-500"/>
            Sugerencias de Recetas con IA
          </h2>
          <button onClick={onClose} className="p-1 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700">
            <CloseIcon className="w-6 h-6"/>
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
              <p className="mt-4 text-slate-600 dark:text-slate-400">Elaborando algunas ideas sabrosas...</p>
            </div>
          )}
          {error && <div className="text-red-500 bg-red-100 dark:bg-red-900/50 p-4 rounded-md">{error}</div>}
          {!isLoading && !error && recipes && (
            <div className="space-y-6">
              {recipes.length > 0 ? (
                recipes.map((recipe, index) => (
                  <div key={index} className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mb-2">{recipe.recipeName}</h3>
                    <div className="mb-3">
                      <h4 className="font-semibold text-sm text-slate-700 dark:text-slate-300 mb-1">Ingredientes que tienes:</h4>
                      <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-400">
                        {recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-slate-700 dark:text-slate-300 mb-1">Instrucciones:</h4>
                      <ol className="list-decimal list-inside text-sm text-slate-600 dark:text-slate-400 space-y-1">
                        {recipe.instructions.map((inst, i) => <li key={i}>{inst}</li>)}
                      </ol>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-slate-500 dark:text-slate-400 py-8">
                  <p>No se pudieron generar recetas con los elementos actuales.</p>
                  <p className="text-sm">¡Intenta agregar más ingredientes!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};