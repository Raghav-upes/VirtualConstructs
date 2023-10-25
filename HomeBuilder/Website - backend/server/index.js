const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const fs = require("fs");

const app = express();
const server = http.createServer(app);

// Serve static files, like your HTML page
app.use(express.static(__dirname));

const ws = new WebSocket.Server({ server });

ws.on("connection", (clientWs, req) => {
  const origin = req.headers.origin;

  if (origin === "http://localhost:3000") {
    // The connection is allowed
    console.log("A client connected");

    clientWs.on("message", (data) => {
      console.log("Received GLTF model data");

      // Assuming data is a binary buffer containing the GLTF model
      // You can save it to a file, process it, or perform any other desired actions
      // For example, save the model to a file
      fs.writeFileSync("received_model.gltf", data);

      // Respond to the client if needed
      clientWs.send("Model received and saved on the server");
    });

    clientWs.on("close", () => {
      console.log("Client disconnected");
    });
  } else {
    // Reject the connection
    clientWs.close();
  }
});

server.listen(3000, () => {
  console.log("Server started on port 3000");
});