import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      minlength: 3,
      maxlength: 50000,
      required: function () {
        return this.attachments?.length > 0 ? false : true;
      },
    },
    attachments: [String],
    senderID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    receiverID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },

  {
    collection: "messages",
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    strict: true,
    strictQuery: true,
    autoIndex: true,
  },
);
export const messageModel =
  mongoose.model("message", messageSchema, "messages") ||
  mongoose.model("message");
