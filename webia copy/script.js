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
function displayBotResponse(response) {
  $('<div class="message new"><figure class="avatar"><img src="http://algom.x10host.com/chat/img/icon-oracle.gif" /></figure>' + response + '</div>').appendTo($('.mCSB_container')).addClass('new');
  setDate();
  updateScrollbar();
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
