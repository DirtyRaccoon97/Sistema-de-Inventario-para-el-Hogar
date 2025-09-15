

export enum FoodType {
  DAIRY = 'Lacteos',
  LEGUME = 'Legumbres',
  SWEETS = 'Dulces',
  CONDIMENTS = 'Condimentos',
  FRUIT = 'Frutas',
  VEGETABLE = 'Vegetales',
  MEAT = 'Carnes',
  SEAFOOD = 'Mariscos',
  GRAINS = 'Granos',
  BEVERAGE = 'Bebidas',
  SNACKS = 'Snacks',
  OTHER = 'Otros',
}

export enum UnitOfMeasure {
  ITEM = 'Item(s)',
  KG = 'kg',
  G = 'g',
  LB = 'lb',
  OZ = 'oz',
  L = 'L',
  ML = 'ml',
  CAN = 'Tarro(s)',
  BOX = 'Caja(as)',
  BAG = 'Bolsa(s)',
}

export interface Location {
  id: number;
  name: string;
}

export interface InventoryItem {
  id: number;
  name: string;
  foodType: FoodType;
  brand?: string;
  expirationDate?: string;
  dateAdded: string;
  quantity: number;
  unit: UnitOfMeasure;
  locationId: number;
}

export enum MovementType {
  ADDED = 'Añadido',
  USED = 'Usado',
  DISCARDED = 'Descartado',
}

export interface Movement {
  id: number;
  itemId: number;
  itemName: string;
  type: MovementType;
  quantityChange: number;
  timestamp: string;
}

export interface Recipe {
    recipeName: string;
    ingredients: string[];
    instructions: string[];
}