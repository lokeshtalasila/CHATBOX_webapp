import express from "express";
import connectdb from "./db/index.js";
import dotenv from "dotenv";
import { Server as SocketIOServer } from 'socket.io';
import chatRouter from "./routes/chatRoutes.js"
import messageRouter from "./routes/messageRoutes.js"
import userRouter from "./routes/userRoutes.js"
// import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors(
    {
      origin: 'http://localhost:3000',
        methods: 'GET, POST, PUT, DELETE',
        Credential:true
    }
))

// const app = express();
const PORT = process.env.PORT || 8000
dotenv.config({
  path: './.env'
});

app.use(express.json({limit : "16kb"}))
app.use(express.urlencoded({extended:true , limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())
// app.use(express.json());
app.get('/', (req, res) => {
res.send('Server is up and running');
});
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);

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
export {app}
