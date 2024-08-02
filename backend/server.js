import express from "express";
import connectdb from "./db/index.js";
import dotenv from "dotenv";

const app = express();

dotenv.config({
    path: './.env'
});

connectdb()
.then( () => {
    app.on("error",(error) => {
        console.log("error" , error);
        throw error
    })
    const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
})
})
.catch( (err) => {
    console.log("momgo failed" ,err)
})


// server connection
const server = app.listen(port, () => {});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.ORIGIN,
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
});
