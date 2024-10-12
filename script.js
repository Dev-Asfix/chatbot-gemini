document.getElementById('send-btn').addEventListener('click', async () => {
    const userInput = document.getElementById('user-input').value;
    if (userInput.trim() === '') return;

    // Mostrar el mensaje del usuario en el chat
    addMessageToChat('Usuario: ' + userInput);
    document.getElementById('user-input').value = '';

    // Enviar el mensaje al backend
    try {
        const response = await fetch('http://localhost:3000/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: userInput })
        });

        const data = await response.json();
        addMessageToChat('Gemini: ' + data.response);
    } catch (error) {
        addMessageToChat('Error al contactar con el chatbot');
        console.error('Error:', error);
    }
});

function addMessageToChat(message) {
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('p');
    messageElement.textContent = message;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll hacia abajo
}
