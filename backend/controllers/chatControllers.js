import { User } from "../models/user.models.js";
import { Chat } from "../models/chat.models.js";
import {asyncHandler} from "../utils/asynchandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
const getChats = asyncHandler(async (req, res, next) => {
    const chats = await Chat.find({ users: { $in: req.user.id } }).populate("users");
    res.status(200).json(new ApiResponse(200, chats));
  });
  
  //create one-to-one chat
  const createChat = asyncHandler(async (req, res, next) => {
    const present = await Chat.find({
      isGroupChat: false,
      $and: [{ users: req.user.id }, { users: req.body.otherid }],
    });
  
    if (present.length > 0) {
      return res.status(200).json(new ApiResponse(200, present[0]));
    }
  
    const chat = new Chat({
      chatName: "sender",
      users: [req.user.id, req.body.otherid],
    });
  
    const result = await chat.save();
    res.status(201).json(new ApiResponse(201, result));
  });
  
  const createGroup = asyncHandler(async (req, res, next) => {
    const users = req.body.users;
    users.push(req.user.id);
  
    const group = new Chat({
      chatName: req.body.chatName,
      isGroupChat: true,
      groupAdmin: req.user.id,
      users,
    });
  
    const result = await group.save();
    res.status(201).json(new ApiResponse(201, result));
  });
  
  const renameGroup = asyncHandler(async (req, res, next) => {
    const group = await Chat.findByIdAndUpdate(
      req.body.chatId,
      {
        chatName: req.body.chatName,
      },
      { new: true }
    );
  
    res.status(200).json(new ApiResponse(200, group));
  });
  
  //remove someone from group
  const removeFromGroup = asyncHandler(async (req, res, next) => {
    const group = await Chat.findByIdAndUpdate(
      req.body.chatId,
      {
        $pull: { users: req.body.userId },
      },
      { new: true }
    );
    res.status(200).json(new ApiResponse(200, group));
  });
  
  //add someone to group
  const addToGroup = asyncHandler(async (req, res, next) => {
    const group = await Chat.findByIdAndUpdate(
      req.body.chatId,
      {
        $push: { users: req.body.userId },
      },
      { new: true }
    );
  
    res.status(200).json(new ApiResponse(200, group));
  });
  
  export default { getChats, createChat, createGroup, renameGroup, removeFromGroup, addToGroup };