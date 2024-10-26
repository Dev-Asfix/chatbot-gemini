const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Reemplaza con tu clave de API
const API_KEY = 'AIzaSyDK7fN73zyVMYsj0g_ZP5HOKyOlZfTouxI';

app.use(cors());
app.use(express.json());

// Ruta para manejar la solicitud del chatbot
app.post('/api/chat', async (req, res) => {
    const userMessage = req.body.message;
    try {
        // Llamada a la API de Gemini con la clave API
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`,
            {
                contents: [{ parts: [{ text: userMessage }] }]
                
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        // Extraer el texto de la respuesta
        if (response.data && response.data.candidates && response.data.candidates[0] && response.data.candidates[0].content) {
            const botResponseParts = response.data.candidates[0].content.parts;

            // Obtener el texto desde parts[0].text
            const botResponse = botResponseParts && botResponseParts[0] && botResponseParts[0].text
                ? botResponseParts[0].text
                : 'Lo siento, no tengo una respuesta en este momento.';

            res.json({ response: botResponse });
        } else {
            res.status(500).json({ error: 'Formato de respuesta inesperado de la API' });
        }
    } catch (error) {
        console.error('Error al conectarse con la API de Gemini:', error.response?.data || error.message);
        res.status(500).json({ error: 'Error al conectarse con la API de Gemini' });
    }
});
  




app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
