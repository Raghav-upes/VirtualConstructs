const express = require('express');
const mongoose = require('mongoose');
const { Server } = require("socket.io");
const http = require("http");
const { join } = require('path'); // Import the join function from the path module

// Create express app
const app = express();
const server = http.createServer(app);

// Connect to MongoDB database
mongoose
    .connect(
        "mongodb+srv://sih123:sih123@cluster0.qklglcz.mongodb.net/?retryWrites=true&w=majority",
        { useNewUrlParser: true }
    )
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));

// Define routes
app.get('/', (req, res) => {
  // Use join to specify the path to your HTML file
  res.sendFile(join(__dirname, 'index.html'));
});

// Start server
const port = 3000;
server.listen(port, () => console.log(`Server started on port ${port}`));

// Socket.io integration
const io = new Server(server);
io.on("connection", (socket) => {
    console.log("A user connected");
    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});
