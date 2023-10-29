const WebSocket = require('ws');
const http = require('http');
const axios = require('axios');
const fs = require("fs");


const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Server is UP');
});

server.listen(3000, () => {
  console.log('listening on port 3000');
});

const ws = new WebSocket.Server({ server });


/* File receiving and saving */

ws.on('connection',  (clientWs, req) =>{
    clientWs.on("message", (data) => {
      console.log("Received GLTF model data");
      fs.writeFileSync("../../Website\ -\ frontend/dist/client/received_model.gltf", data);
    });


  ws.on('message', (message) => {
    console.log('Received message: ' + message);

  });
});

console.log('WebSocket is runnning');
