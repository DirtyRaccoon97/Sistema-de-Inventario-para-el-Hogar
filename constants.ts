

import { FoodType, UnitOfMeasure } from './types';

export const FOOD_TYPE_OPTIONS = Object.values(FoodType).map(value => ({ value, label: value }));
export const UNIT_OPTIONS = Object.values(UnitOfMeasure).map(value => ({ value, label: value }));
