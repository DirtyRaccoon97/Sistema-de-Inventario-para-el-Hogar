import { GoogleGenAI, Type } from "@google/genai";
import type { Recipe } from '../types';

if (!process.env.API_KEY) {
  console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const recipeSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      recipeName: {
        type: Type.STRING,
        description: "El nombre de la receta.",
      },
      ingredients: {
        type: Type.ARRAY,
        items: {
          type: Type.STRING,
          description: "Un ingrediente de la lista proporcionada que se utiliza en esta receta."
        },
        description: "Una lista de ingredientes del inventario del usuario necesarios para esta receta.",
      },
      instructions: {
        type: Type.ARRAY,
        items: {
          type: Type.STRING,
          description: "Un solo paso en las instrucciones de la receta."
        },
        description: "Instrucciones paso a paso para preparar el plato.",
      },
    },
    required: ["recipeName", "ingredients", "instructions"],
  },
};

export const suggestRecipes = async (ingredients: string[]): Promise<Recipe[]> => {
  if (ingredients.length === 0) {
    return [];
  }

  const prompt = `Basado en los siguientes ingredientes, sugiere hasta 3 recetas sencillas. Para cada receta, enumera solo los ingredientes de mi lista que se necesitan y proporciona instrucciones sencillas.

Ingredientes: ${ingredients.join(', ')}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: recipeSchema,
        temperature: 0.7,
      },
    });

    const jsonText = response.text.trim();
    const recipes = JSON.parse(jsonText);
    return recipes as Recipe[];
  } catch (error) {
    console.error("Error fetching recipe suggestions:", error);
    throw new Error("No se pudieron obtener sugerencias de recetas de la API de Gemini.");
  }
};