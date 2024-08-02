import express from "express";
import connectdb from "./db/index.js";
import dotenv from "dotenv";
import { Server as SocketIOServer } from 'socket.io';


const app = express();
const PORT = process.env.PORT || 3000
dotenv.config({
    path: './.env'
});

connectdb()
.then( () => {
    app.on("error",(error) => {
        console.log("error" , error);
        throw error
    })



// server connection
const server = app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
})

const io = new SocketIOServer(server, {
    pingTimeout: 60000,
    cors: {
      origin: process.env.CORS_ORIGIN,
      methods: ["GET", "POST"],
    },
  });

io.on("connection", (socket) => {
  socket.on("setup", (id) => {
    socket.join(id);
  });

  socket.on("join-chat", (chatid) => {
    socket.join(chatid);
  });

  socket.on("new-message", (newMessage) => {
    newMessage.currentChat.users.forEach((user) => {
      if (user._id === newMessage.data.senderId) return;

      socket.in(user._id).emit("message-recieved", newMessage);
    });
  });

  socket.off("setup", () => {
    socket.leave(userData._id);
  });
})
})
.catch((err) => {
  console.log("mongo failed",err);
})
