import express from "express";
import chatControllers from "../controllers/chatControllers.js"
import { verifyUser } from "../middlewares/auth.js"

const chatRouter = express.Router();

// single chat routes
chatRouter.get("/getchats/:id", verifyUser, chatControllers.getChats);
chatRouter.post("/createchat/:id", verifyUser, chatControllers.createChat);

// group chat routes
chatRouter.post("/creategroup/:id", verifyUser, chatControllers.createGroup);
chatRouter.put("/renamegroup/:id", verifyUser, chatControllers.renameGroup);
chatRouter.put(
  "/removefromgroup/:id",
  verifyUser,
  chatControllers.removeFromGroup
);
chatRouter.put("/addtogroup/:id", verifyUser, chatControllers.addToGroup);

export default  chatRouter;
