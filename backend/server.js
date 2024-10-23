// backend/server.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Ruta para generar la receta
app.post('/generate-recipe', async (req, res) => {
  const { ingredients } = req.body;

  if (!ingredients || ingredients.length === 0) {
    return res.status(400).json({ error: 'No se proporcionaron ingredientes.' });
  }

  // Construir el prompt para la API de Chat Completion
  const messages = [
    {
      role: 'system',
      content: 'Eres un asistente que crea recetas basadas en los ingredientes proporcionados.',
    },
    {
      role: 'user',
      content: `Crea una receta usando los siguientes ingredientes: ${ingredients.join(
        ', '
      )}. Responde en formato JSON con dos campos: "titulo" y "instrucciones". 

Formato de respuesta:
{
  "titulo": "Nombre de la Receta",
  "instrucciones": "Instrucciones detalladas de la receta."
}`,
    },
  ];

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: messages,
        max_tokens: 500,
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    // Verificar la estructura de la respuesta
    if (
      response.data &&
      response.data.choices &&
      response.data.choices.length > 0
    ) {
      const rawText = response.data.choices[0].message.content.trim();

      // Intentar parsear la respuesta como JSON
      try {
        // Buscar el inicio del JSON
        const jsonStart = rawText.indexOf('{');
        const jsonString = rawText.substring(jsonStart);

        const jsonResponse = JSON.parse(jsonString);

        res.json({
          titulo: jsonResponse.titulo || 'Sin Título',
          instrucciones: jsonResponse.instrucciones || 'Sin Instrucciones',
        });
      } catch (jsonError) {
        console.error('Error al parsear JSON:', jsonError);
        console.log('Respuesta cruda de la API:', rawText);
        res
          .status(500)
          .json({ error: 'No se pudo parsear la receta generada.' });
      }
    } else {
      res
        .status(500)
        .json({ error: 'No se pudo generar la receta. Inténtalo de nuevo.' });
    }
  } catch (error) {
    console.error('Error al generar la receta:', error.response?.data || error.message);
    res
      .status(500)
      .json({ error: 'Ocurrió un error al generar la receta.' });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en el puerto ${PORT}`);
});
