import { User } from "../models/user.models.js";
import { Chat } from "../models/chat.models.js";
import {Message} from "../models/message.models.js"

import {asyncHandler} from "../utils/asynchandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"

const getAllMessages = asyncHandler(async (req, res, next) => {
  const messages = await Message.find({ chat: req.params.chatid });
  res.status(200).json(new ApiResponse(200, messages));
});

const getMessage = asyncHandler(async (req, res, next) => {
  const message = await Message.findById(req.params.messageid);
  res.status(200).json(new ApiResponse(200, message));
});

const sendMessage = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  const msg = new Message({
    chat: req.body.chatid,
    senderPic: user.pic,
    senderId: user._id,
    content: req.body.content,
  });

  const message = await msg.save();

  await Chat.findByIdAndUpdate(req.body.chatid, {
    latestMessage: message._id,
  });

  res.status(201).json(new ApiResponse(201, message));
});

export default { getAllMessages, getMessage, sendMessage };
