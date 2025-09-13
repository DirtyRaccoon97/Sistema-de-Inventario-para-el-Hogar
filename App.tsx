import React, { useState, useCallback, useMemo } from 'react';
import type { InventoryItem, Movement, Recipe } from './types';
import { MovementType } from './types';
import { InventoryDashboard } from './components/InventoryDashboard';
import { ItemFormModal } from './components/ItemFormModal';
import { MovementHistory } from './components/MovementHistory';
import { RecipeSuggestionModal } from './components/RecipeSuggestionModal';
import { suggestRecipes } from './services/geminiService';
import { SparklesIcon, HistoryIcon, InventoryIcon, BarChartIcon } from './components/Icons';
import { Alerts } from './components/Alerts';
import { ReportsDashboard } from './components/ReportsDashboard';


type ActiveView = 'inventory' | 'history' | 'reports';

function App() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<InventoryItem | null>(null);
  const [activeView, setActiveView] = useState<ActiveView>('inventory');
  
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[] | null>(null);
  const [recipeIsLoading, setRecipeIsLoading] = useState(false);
  const [recipeError, setRecipeError] = useState<string | null>(null);

  const addMovement = useCallback((item: InventoryItem, type: MovementType, quantityChange: number) => {
    const newMovement: Movement = {
      id: Date.now(),
      itemId: item.id,
      itemName: item.name,
      type,
      quantityChange,
      timestamp: new Date().toISOString(),
    };
    setMovements(prev => [...prev, newMovement]);
  }, []);
  
  const handleAddItem = useCallback((newItemData: Omit<InventoryItem, 'id' | 'dateAdded'>) => {
    const newItem: InventoryItem = {
      ...newItemData,
      id: Date.now(),
      dateAdded: new Date().toISOString().split('T')[0],
    };
    setItems(prev => [...prev, newItem]);
    addMovement(newItem, MovementType.ADDED, newItem.quantity);
  }, [addMovement]);

  const handleUpdateItem = useCallback((updatedItemData: Omit<InventoryItem, 'id' | 'dateAdded'>, id: number) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, ...updatedItemData } : item));
  }, []);

  const handleFormSubmit = useCallback((data: Omit<InventoryItem, 'id' | 'dateAdded'>, id?: number) => {
    if (id) {
      handleUpdateItem(data, id);
    } else {
      handleAddItem(data);
    }
  }, [handleAddItem, handleUpdateItem]);

  const handleAdjustQuantity = useCallback((id: number, newQuantity: number) => {
    const item = items.find(i => i.id === id);
    if (!item || newQuantity < 0) return;

    const change = newQuantity - item.quantity;
    if (change !== 0) {
        addMovement(item, change > 0 ? MovementType.ADDED : MovementType.USED, Math.abs(change));
        setItems(prev => prev.map(i => i.id === id ? { ...i, quantity: newQuantity } : i));
    }
  }, [items, addMovement]);

  const handleDeleteItem = useCallback((id: number) => {
    const item = items.find(i => i.id === id);
    if (item && window.confirm(`¿Estás seguro de que quieres eliminar permanentemente ${item.name}?`)) {
      addMovement(item, MovementType.DISCARDED, item.quantity);
      setItems(prev => prev.filter(i => i.id !== id));
    }
  }, [items, addMovement]);

  const handleOpenEditModal = useCallback((item: InventoryItem) => {
    setItemToEdit(item);
    setIsFormModalOpen(true);
  }, []);
  
  const handleOpenAddModal = useCallback(() => {
    setItemToEdit(null);
    setIsFormModalOpen(true);
  }, []);

  const handleCloseFormModal = useCallback(() => {
    setIsFormModalOpen(false);
    setItemToEdit(null);
  }, []);
  
  const handleGetRecipeSuggestions = useCallback(async () => {
    setIsRecipeModalOpen(true);
    setRecipeIsLoading(true);
    setRecipeError(null);
    setRecipes(null);

    const ingredientNames = items.map(item => item.name);
    try {
        const result = await suggestRecipes(ingredientNames);
        setRecipes(result);
    } catch (e) {
        setRecipeError("Lo siento, no pude obtener recetas en este momento. Por favor, verifica tu clave de API e inténtalo de nuevo.");
    } finally {
        setRecipeIsLoading(false);
    }
  }, [items]);
  
  const sortedItems = useMemo(() => {
    return [...items].sort((a,b) => a.name.localeCompare(b.name));
  }, [items]);


  const TabButton: React.FC<{ view: ActiveView, label: string, icon: React.ReactNode }> = ({ view, label, icon }) => (
    <button
      onClick={() => setActiveView(view)}
      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
        activeView === view
          ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300'
          : 'text-slate-500 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-700'
      }`}
    >
      {icon}
      {label}
    </button>
  );
  
  const renderActiveView = () => {
    switch(activeView) {
        case 'inventory':
            return (
                <>
                    <Alerts items={items} />
                    <InventoryDashboard 
                        items={sortedItems}
                        onAdjustQuantity={handleAdjustQuantity}
                        onEdit={handleOpenEditModal}
                        onDelete={handleDeleteItem}
                        onAddItem={handleOpenAddModal}
                    />
                </>
            );
        case 'history':
            return <MovementHistory movements={movements} />;
        case 'reports':
            return <ReportsDashboard items={items} movements={movements} />;
        default:
            return null;
    }
  }

  return (
    <div className="min-h-screen container mx-auto p-4 md:p-8">
      <header className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-4xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">Inventario Hogar</h1>
          <button 
            onClick={handleGetRecipeSuggestions} 
            disabled={items.length === 0}
            className="flex items-center gap-2 px-4 py-2 font-medium text-white bg-green-600 rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 focus:ring-green-500 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed">
            <SparklesIcon className="w-5 h-5"/>
            Que puedo hacer?
          </button>
        </div>
      </header>

      <main>
        <div className="mb-6 flex items-center gap-2 p-2 bg-slate-100 dark:bg-slate-800 rounded-lg max-w-min">
          <TabButton view="inventory" label="Inventario" icon={<InventoryIcon className="w-5 h-5"/>} />
          <TabButton view="history" label="Historial" icon={<HistoryIcon className="w-5 h-5"/>} />
          <TabButton view="reports" label="Reportes" icon={<BarChartIcon className="w-5 h-5"/>} />
        </div>

        {renderActiveView()}
      </main>

      <ItemFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
        onSubmit={handleFormSubmit}
        itemToEdit={itemToEdit}
      />
      
      <RecipeSuggestionModal
        isOpen={isRecipeModalOpen}
        onClose={() => setIsRecipeModalOpen(false)}
        recipes={recipes}
        isLoading={recipeIsLoading}
        error={recipeError}
      />
    </div>
  );
}

export default App;