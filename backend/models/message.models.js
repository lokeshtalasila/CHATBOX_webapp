import mongoose from "mongoose"

const messageschema = mongoose.Schema(
    {
      senderId: { type: mongoose.Schema.Types.ObjectId },
      senderPic: {
        type: String,
      },
      content: {
        type: String,
        trim: true,
      },
      chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
      },
    },
    {
      timestamps: true,
    }
  );
  
export  const Message = mongoose.model("Message", messageschema);