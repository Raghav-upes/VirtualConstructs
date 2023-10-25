const WebSocket = require('ws');
const http = require('http');
const axios = require('axios');
const fs = require("fs");
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('WebSocket server is running\n');
});

server.listen(3000, () => {
  console.log('HTTP server listening on port 8081');
});

const ws = new WebSocket.Server({ server });

ws.on('connection',  (clientWs, req) =>{
    clientWs.on("message", (data) => {
      console.log("Received GLTF model data");

      // Assuming data is a binary buffer containing the GLTF model
      // You can save it to a file, process it, or perform any other desired actions
      // For example, save the model to a file
      fs.writeFileSync("../../Website\ -\ frontend/dist/client/received_model.gltf", data);

      // Respond to the client if needed
      clientWs.send("Model received and saved on the server");
    });

/*      fs.copyFile("received_model.gltf", destinationFolderPath + 'received_model.gltf', (err) => {
  console.log(`File saved to ${destinationFolderPath}received_model.gltf`);
});*/
  ws.on('message', (message) => {
    console.log('Received message: ' + message);

    // Broadcast the message to all connected clients
    ws.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send('Broadcast: ' + message);
      }
    });
  });
});



const getGlobalIPAddress = async () => {
  try {
    const response = await axios.get('https://api64.ipify.org?format=json');
    const publicIPAddress = response.data.ip;
    return publicIPAddress;
  } catch (error) {
    throw error;
  }
};

console.log('WebSocket server started');
