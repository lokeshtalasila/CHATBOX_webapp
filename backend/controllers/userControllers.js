import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { User } from "../models/user.models.js";

import {asyncHandler} from "../utils/asynchandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"

const searchUser = asyncHandler(async (req, res, next) => {
    const searchQuery = req.query.search
      ? { name: { $regex: req.query.search, $options: "i" } }
      : {};
  
    const users = await User.find(searchQuery)
      .find({
        _id: { $ne: req.user.id },
      })
      .select("-password");
    
    res.status(200).json(new ApiResponse(200, users));
  });
  
  const getUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.userid).select("-password");
    
    if (!user) {
      return next(new ApiError(404, "User not found"));
    }
  
    res.status(200).json(new ApiResponse(200, user));
  });
  
  const login = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    
    if (!user) {
      return next(new ApiError(400, "Incorrect credentials"));
    }
  
    const passwordMatch = await bcrypt.compare(req.body.password, user.password);
    
    if (!passwordMatch) {
      return next(new ApiError(400, "Incorrect credentials"));
    }
  
    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
  
    res.status(200).json(new ApiResponse(200, { msg: "Login successful", token }));
  });
  
  const register = asyncHandler(async (req, res, next) => {
    const { email, password, ...rest } = req.body;

    if (!email || !password) {
        return next(new ApiError(400, "Email and password are required"));
    }
    const alreadyPresent = await User.findOne({ email: req.body.email });
    
    if (alreadyPresent) {
      return next(new ApiError(400, "Email already exists"));
    }
  
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({ ...req.body, password: hashedPassword });
    
    await user.save();
    
    res.status(201).json(new ApiResponse(201, "User registered successfully"));
  });
  
  export default { login, register, getUser, searchUser };