import express from "express";
import messageControllers from "../controllers/messageControllers.js"
import { verifyUser } from "../middlewares/auth.js"

const messageRouter = express.Router();

messageRouter.get(
  "/getmessage/:id/:messageid",
  verifyUser,
  messageControllers.getMessage
);
messageRouter.get(
  "/getallmessages/:id/:chatid",
  verifyUser,
  messageControllers.getAllMessages
);
messageRouter.post(
  "/sendmessage/:id",
  verifyUser,
  messageControllers.sendMessage
);

module.exports = messageRouter;
