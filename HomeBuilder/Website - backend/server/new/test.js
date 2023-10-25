const WebSocket = require("ws");

const WebSocketClient = new WebSocket(
  "ws://localhost:3000"
); // Replace with your WebSocket server URL

WebSocketClient.on("open", function () {
  console.log("WebSocket connected.");
  // You can send messages here, e.g., WebSocketClient.send("Hello, server!");
});

WebSocketClient.on("message", function (data) {
  console.log("WebSocket message received: " + data);
  // Handle received messages here
});

WebSocketClient.on("error", function (error) {
  console.error("WebSocket error: " + error.message);
});
WebSocketClient.onerror = function (error) {
  console.error("WebSocket error:", error);
};

WebSocketClient.on("close", function (code, reason) {
  console.log(
    "WebSocket connection closed. Code: " + code + ", Reason: " + reason
  );
});

// To send a message, you can call this function from your code
function sendMessageToServer(message) {
  WebSocketClient.send(message);
}

// Example: Send a message to the server
// sendMessageToServer("Hello, server!");
