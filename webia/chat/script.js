// Verifica si el navegador soporta reconocimiento de voz
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.continuous = false;
recognition.lang = 'es-ES'; // Idioma español
recognition.interimResults = false;
recognition.maxAlternatives = 1;

const audioButton = document.getElementById('audio-button');
const audioIcon = document.getElementById('audio-icon');

// Cambiar icono y activar reconocimiento de voz
audioButton.addEventListener('click', () => {
  recognition.start();
  audioButton.classList.add('audio-listening');
  audioIcon.src = "https://cdn-icons-png.flaticon.com/512/727/727245-mic-listening.png"; // Cambia el ícono mientras escucha
});

// Procesar el resultado de la voz reconocida
recognition.onresult = (event) => {
  const speechResult = event.results[0][0].transcript;
  $('.message-input').val(speechResult); // Insertar el texto en el cuadro de mensaje
  insertMessage(); // Enviar el mensaje automáticamente
  stopAudioRecognition();
};

// Reiniciar el estado después de terminar el reconocimiento
recognition.onspeechend = () => {
  stopAudioRecognition();
};

recognition.onerror = (event) => {
  stopAudioRecognition();
  console.error('Error al reconocer:', event.error);
};

// Función para detener la animación y restaurar el icono
function stopAudioRecognition() {
  audioButton.classList.remove('audio-listening');
  audioIcon.src = "https://cdn-icons-png.flaticon.com/512/727/727245.png"; // Vuelve al icono de micrófono
}



var $messages = $('.messages-content'),
    d, h, m,
    i = 0;

$(window).load(function() {
  $messages.mCustomScrollbar();
  setTimeout(function() {
    fakeMessage(); // Replace this with bot's actual message later
  }, 100);
});

function updateScrollbar() {
  $messages.mCustomScrollbar("update").mCustomScrollbar('scrollTo', 'bottom', {
    scrollInertia: 10,
    timeout: 0
  });
}

function setDate() {
  d = new Date();
  if (m != d.getMinutes()) {
    m = d.getMinutes();
    $('<div class="timestamp">' + d.getHours() + ':' + m + '</div>').appendTo($('.message:last'));
  }
}

function insertMessage() {
  msg = $('.message-input').val();
  if ($.trim(msg) == '') {
    return false;
  }
  $('<div class="message message-personal">' + msg + '</div>').appendTo($('.mCSB_container')).addClass('new');
  setDate();
  $('.message-input').val(null);
  updateScrollbar();

  // Mostrar la animación de "escribiendo"
  displayLoadingAnimation();

  // Simulate server response (replace this with actual server call)
  sendMessageToServer(msg);
}

$('.message-submit').click(function() {
  insertMessage();
});

$(window).on('keydown', function(e) {
  if (e.which == 13) {
    insertMessage();
    return false;
  }
});

// Function to send message to the server
function sendMessageToServer(message) {
  $.ajax({
    url: 'http://localhost:3000/api/chat',
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({ message: message }),
    success: function(data) {
      // Remove the loading animation once response arrives
      removeLoadingAnimation();
      // Display formatted response
      displayBotResponse(formatBotResponse(data.response));
    },
    error: function() {
      removeLoadingAnimation();
      displayBotResponse("I'm sorry, something went wrong.");
    }
  });
}

// Function to display the bot's response
// Función para mostrar la respuesta del bot y hablarla
function displayBotResponse(response) {
  $('<div class="message new"><figure class="avatar"><img src="http://algom.x10host.com/chat/img/icon-oracle.gif" /></figure>' + response + '</div>').appendTo($('.mCSB_container')).addClass('new');
  setDate();
  updateScrollbar();
  
  // Reproduce la respuesta como audio
  speak(response); 
}

// Función para usar la síntesis de voz y reproducir el audio
function speak(text) {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'es-ES';  // Ajustar al idioma español

  // Comenzar la síntesis de voz
  synth.speak(utterance);
}

// Display loading animation
function displayLoadingAnimation() {
  $('<div class="message loading new"><figure class="avatar"><img src="http://algom.x10host.com/chat/img/icon-oracle.gif" /></figure><span class="loading-dots">Escribiendo<span></div>').appendTo($('.mCSB_container'));
  updateScrollbar();
}

// Remove loading animation
function removeLoadingAnimation() {
  $('.message.loading').remove();
  updateScrollbar();
}

// Format the bot response to display code and text styles
function formatBotResponse(response) {
  // Use regex to identify code blocks and wrap them with <pre><code> for syntax highlighting
  let formattedResponse = response
    .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>') // Code block
    .replace(/`([^`]+)`/g, '<code>$1</code>') // Inline code
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>') // Bold text
    .replace(/\*([^*]+)\*/g, '<em>$1</em>'); // Italics

  return formattedResponse;
}
