const WebSocket = require('ws');
const http = require('http');
const axios = require('axios');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('WebSocket server is running\n');
});

server.listen(8081, () => {
  console.log('HTTP server listening on port 8081');
});

const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws) {
  // Send the client's global IP address when a client connects
  getGlobalIPAddress()
    .then((publicIPAddress) => {
      ws.send('Your Global IP Address: ' + publicIPAddress);
    })
    .catch((error) => {
      console.error('Error sending IP address:', error.message);
    });

  ws.on('message', (message) => {
    console.log('Received message: ' + message);

    // Broadcast the message to all connected clients
    wss.clients.forEach((client) => {
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
