// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import IngredientSelector from './components/IngredientSelector';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 p-4">
        <h1 className="text-4xl font-bold text-center mb-8">Generador de Recetas</h1>
        <Routes>
          <Route path="/" element={<IngredientSelector />} />
          {/* Ya no necesitamos la ruta /recipe */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
