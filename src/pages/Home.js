// src/pages/Home.js

import React, { useState } from 'react';
import IngredientSelector from '../components/IngredientSelector';
import RecipeCard from '../components/RecipeCard';
import axios from 'axios';

const Home = () => {
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState(null); // Estado para almacenar la receta

  const generateRecipe = async () => {
    if (selectedIngredients.length === 0) {
      alert('Por favor, selecciona al menos un ingrediente.');
      return;
    }

    setLoading(true);
    setRecipe(null); // Reiniciar receta anterior

    try {
      const prompt = `Genera una receta en formato JSON utilizando los siguientes ingredientes: ${selectedIngredients.join(', ')}. La respuesta debe incluir los campos "recipeName", "ingredients" y "preparation". Aquí tienes un ejemplo del formato esperado:

      {
        "recipeName": "Nombre de la Receta",
        "ingredients": [
          "Ingrediente 1",
          "Ingrediente 2",
          "Ingrediente 3"
        ],
        "preparation": "Pasos detallados para la preparación."
      }`;

      // Llamada a la API de OpenAI
      const response = await axios.post(
        'https://api.openai.com/v1/completions',
        {
          model: 'text-davinci-003',
          prompt: prompt,
          max_tokens: 500,
          temperature: 0.7,
          stop: ['}'], // Detenerse después de cerrar el JSON
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          },
        }
      );

      // Obtener el texto de la respuesta
      const recipeText = response.data.choices[0].text.trim();

      // Extraer el JSON de la respuesta
      const jsonStart = recipeText.indexOf('{');
      const jsonEnd = recipeText.lastIndexOf('}') + 1;
      const jsonString = recipeText.substring(jsonStart, jsonEnd);

      // Parsear el JSON
      const recipeData = JSON.parse(jsonString);

      const { recipeName, ingredients, preparation } = recipeData;

      // Validar que los campos existen
      if (!recipeName || !ingredients || !preparation) {
        throw new Error('La respuesta de la API no contiene todos los campos necesarios.');
      }

      setRecipe({ recipeName, ingredients, preparation });
    } catch (error) {
      console.error('Error al generar la receta:', error);
      alert('Hubo un error al generar la receta. Por favor, revisa la consola para más detalles.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Generador de Recetas</h1>
        <IngredientSelector selectedIngredients={selectedIngredients} setSelectedIngredients={setSelectedIngredients} />
        
        <button
          onClick={generateRecipe}
          className="mt-6 w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors"
          disabled={loading}
        >
          {loading ? 'Generando Receta...' : 'Genera tu Receta'}
        </button>

        {loading && (
          <div className="mt-4 text-center text-gray-700">
            <p>Cargando...</p>
          </div>
        )}

        {recipe && (
          <RecipeCard
            recipeName={recipe.recipeName}
            ingredients={recipe.ingredients}
            preparation={recipe.preparation}
          />
        )}
      </div>
    </div>
  );
};

export default Home;
