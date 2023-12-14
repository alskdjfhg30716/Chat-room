let websocket;
$(document).ready(function () {
  // 建立 WebSocket 連接
  websocket = new WebSocket("ws://192.168.30.217:8090/");

  websocket.onopen = function (event) {
    console.log("Connected to WebSocket.");
    websocket.send(JSON.stringify({ action: 'join', channel: 'room', userId: "guest" }));
    loadMessages();
  };

  websocket.onmessage = function (event) {
    let data = JSON.parse(event.data);
    displayMessage(data.userId, data.message);
  };

  websocket.onerror = function (event) {
    console.error("WebSocket Error: ", event);
  };

  $("#btn_send").click(function () {
    sendMessage();
  });
});

function loadMessages() {
  $.get('get_message.php', function(data) {
    if(data.messages && data.messages.length > 0) {
      data.messages.forEach(function(msg) {
        displayMessage(msg.sender, msg.message);
      });
    }
  });
}

function sendMessage() {
  let sender = $("#sender").val();
  let message = $("#message").val();

  console.log(sender, message);

  if (sender !== "" && message !== "") {
    // 發送訊息至 WebSocket 伺服器
    websocket.send(JSON.stringify({ action: 'join', channel: 'room', userId: sender }));
    websocket.send(JSON.stringify({ action: 'message', data: message, userId: sender }));
    $("#message").val("");
    $.post('add_message.php', { sender: sender, message: message }, function(response) {
      if (response.success) {
        console.log('add message success');
      }
    });
  }
}

function displayMessage(sender, message) {
  // 在聊天介面顯示訊息
  let messageElement = $("<div></div>").text(sender + ": " + message);
  $("#all_messages").append(messageElement);
}
