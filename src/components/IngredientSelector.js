import React, { useState } from 'react';
import axios from 'axios';

function IngredientSelector() {
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recipeTitle, setRecipeTitle] = useState('');
  const [recipeInstructions, setRecipeInstructions] = useState('');
  const [steps, setSteps] = useState([]);
  const [checkedSteps, setCheckedSteps] = useState([]);

  // Categorías de Ingredientes
  const ingredientCategories = [
    {
      category: 'Proteínas',
      ingredients: [
        'Pollo', 'Carne de res', 'Cerdo', 'Pescado', 'Camarones', 'Tofu', 'Huevos', 'Salmón', 'Atún', 'Bacalao'
      ]
    },
    {
      category: 'Lácteos',
      ingredients: [
        'Queso', 'Leche', 'Yogur', 'Crema de leche', 'Mantequilla', 'Queso crema', 'Leche de almendras', 'Leche de coco'
      ]
    },
    {
      category: 'Vegetales',
      ingredients: [
        'Tomate', 'Cebolla', 'Zanahoria', 'Brócoli', 'Espinacas', 'Ajo', 'Pimientos', 'Lechuga', 'Champiñones',
        'Berenjena', 'Calabacín', 'Pepino', 'Papa', 'Batata'
      ]
    },
    {
      category: 'Frutas',
      ingredients: [
        'Manzana', 'Plátano', 'Fresa', 'Limón', 'Lima', 'Naranja', 'Mango', 'Piña', 'Uva'
      ]
    },
    {
      category: 'Granos y Cereales',
      ingredients: [
        'Arroz', 'Quinoa', 'Pasta', 'Avena', 'Pan', 'Cuscús', 'Harina'
      ]
    },
    {
      category: 'Frutos secos y semillas',
      ingredients: [
        'Almendras', 'Nueces', 'Semillas de chía', 'Semillas de lino', 'Avellanas', 'Semillas de girasol'
      ]
    },
    {
      category: 'Especias y condimentos',
      ingredients: [
        'Sal', 'Pimienta', 'Orégano', 'Albahaca', 'Tomillo', 'Comino', 'Paprika', 'Jengibre', 'Canela', 'Curry', 
        'Azafrán', 'Ajo en polvo', 'Mostaza', 'Mayonesa', 'Salsa de soja', 'Aceite de oliva'
      ]
    },
    {
      category: 'Líquidos',
      ingredients: [
        'Agua', 'Caldo de pollo', 'Caldo de verduras', 'Jugo de limón', 'Vinagre', 'Vino blanco', 'Cerveza', 'Leche de coco'
      ]
    }
  ];

  const toggleIngredient = (ingredient) => {
    setSelected((prev) =>
      prev.includes(ingredient)
        ? prev.filter((item) => item !== ingredient)
        : [...prev, ingredient]
    );
  };

  const generateRecipe = async () => {
    if (selected.length === 0) {
      alert('Por favor, selecciona al menos un ingrediente.');
      return;
    }

    setLoading(true);
    setRecipeTitle('');
    setRecipeInstructions('');
    setSteps([]);
    setCheckedSteps([]);

    try {
      const response = await axios.post('/generate-recipe', {
        ingredients: selected,
      });

      const { titulo, instrucciones } = response.data;

      setRecipeTitle(titulo || 'Sin Título');
      setRecipeInstructions(instrucciones || 'Sin Instrucciones');

      // Dividir las instrucciones en pasos
      const parsedSteps = parseInstructions(instrucciones);
      setSteps(parsedSteps);
      setCheckedSteps(new Array(parsedSteps.length).fill(false));
    } catch (error) {
      console.error('Error al generar la receta:', error.response?.data || error.message);
      setRecipeTitle('Ocurrió un error al generar la receta.');
      setRecipeInstructions('Por favor, intenta más tarde.');
    } finally {
      setLoading(false);
    }
  };

  // Función para parsear las instrucciones de la receta
  const parseInstructions = (instructions) => {
    if (!instructions) return [];

    const stepRegex = /\d+\.\s/g;
    const splitSteps = instructions.split(stepRegex).filter((step) => step.trim() !== '');

    if (splitSteps.length === 0) {
      return instructions.split('\n').filter((step) => step.trim() !== '');
    }

    return splitSteps;
  };

  // Manejar los cambios en los checkboxes para los pasos
  const handleCheckboxChange = (index) => {
    const updatedCheckedSteps = [...checkedSteps];
    updatedCheckedSteps[index] = !updatedCheckedSteps[index];
    setCheckedSteps(updatedCheckedSteps);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
       

      {/* Categorías de Ingredientes */}
      {ingredientCategories.map((categoryItem, catIndex) => (
        <div key={catIndex} className="mb-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">{categoryItem.category}</h3>
          <div className="flex flex-wrap gap-3">
            {categoryItem.ingredients.map((ingredient, index) => (
              <button
                key={index}
                onClick={() => toggleIngredient(ingredient)}
                className={`px-4 py-2 rounded-lg border transition ${
                  selected.includes(ingredient)
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-800 border-gray-300 hover:bg-blue-100'
                }`}
              >
                {ingredient}
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Botón para Generar Receta */}
      <button
        onClick={generateRecipe}
        className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors mb-8 flex items-center justify-center"
        disabled={loading}
      >
        {loading ? (
          <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
        ) : null}
        {loading ? 'Generando...' : 'Genera tu Receta'}
      </button>

      {/* Mostrar Receta Generada */}
      {recipeTitle && (
        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
          {/* Título de la Receta */}
          {recipeTitle && (
            <h3 className="text-3xl font-bold mb-6 text-center text-blue-600">{recipeTitle}</h3>
          )}

          {/* Instrucciones de la Receta */}
          {steps.length > 0 && (
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div key={index} className="flex items-start">
                  <input
                    type="checkbox"
                    checked={checkedSteps[index]}
                    onChange={() => handleCheckboxChange(index)}
                    className="mt-1 h-5 w-5 text-blue-600 border-gray-300 rounded"
                  />
                  <span className={`ml-3 text-gray-700 ${checkedSteps[index] ? 'line-through text-gray-400' : ''}`}>
                    {index + 1}. {step}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Botón para Cerrar la Ficha */}
          <button
            onClick={() => {
              setRecipeTitle('');
              setRecipeInstructions('');
              setSteps([]);
              setCheckedSteps([]);
            }}
            className="mt-6 flex items-center justify-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Cerrar
          </button>
        </div>
      )}
    </div>
  );
}

export default IngredientSelector;
