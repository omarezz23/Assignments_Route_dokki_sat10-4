import { or } from "sequelize";
import { notFoundException } from "../../common/errors/error.exception.js";
import {
  countDocuments,
  create,
  deleteOne,
  find,
  findById,
  findOne,
  paginate,
} from "../../common/repository/message.repo.js";
import { messageModel } from "../../database/models/messege.model.js";
import { UserModel } from "../../database/models/user.model.js";
import { RequestModel } from "../../database/models/identity.model.js";
import { findOne as finduser} from  "../../common/repository/repo.js"
export const createmessage = async (
  { content, receiverID } = {},
  files,
  user = undefined,
) => {
  const checkResiverExists = await finduser({
    model: UserModel,
    filter: { _id: receiverID },
  });
  if (!checkResiverExists) {
    throw notFoundException("user did not found mf");
  }
  const message = await create({
    model: messageModel,
    data: {
      receiverID,
      content,
      attachments: files.map((ele) => ele.path),
      ...(user ? { senderID: user._id } : {}),
    },
  });
  return message;
};

export const getAllMessages = async ({ type, page, limit } = {}, user) => {
  let filter = {};
  if (type == "0") {
    filter = {
      receiverID: user._id,
    };
  } else if (type == "1") {
    filter = {
      senderID: user._id,
    };
  } else {
    filter = {
      $or: [{ senderID: user._id }, { receiverID: user._id }],
    };
  }
  const data = await paginate({
    model: messageModel,
    filter,
    page,
    limit,
    options: { sort: { createdAt: -1 } },
  });
  return data;
};

export const deleteMessage = async ( messageId,user) => {

  const data = await deleteOne({
     filter: {  receiverID:user._id ,_id: messageId  },
    model:messageModel,
  })
  return data;
}
export const getoneMessage = async ( messageId,user) => {

  const data = await findOne({
     filter: {  receiverID:user._id ,_id: messageId  },
    model:messageModel,
  })
  return data;
}
////////////////////////
export const createIdentityRequest = async (messageId, receiverId) => {
  const message = await await findOne({
    filter: {
      _id: messageId,
      receiverID: receiverId,
    },
    model: messageModel,
  });

  if (!message) {
    throw notFoundException("Message not found");
  }

  const request = await RequestModel.create({
    messageId,
    receiverId,
    status: "pending",
  });

  return request;
};
///////////////////
export const getRequests = async ({ receiverID }) => {
  return await find({
    filter: { receiverID },
    model: RequestModel,
    options: {
      sort: { createdAt: -1 },
    },
  });
};
/////////////////////////
export const updateRequestStatus = async ({ requestId, user, status }) => {
  const request = await findOne({
    filter: {
      _id: requestId,
    },
    model: RequestModel,
  });

  if (!request) {
    throw notFoundException("Request not found");
  }

  const message = await findOne({
    filter: {
      _id: request.messageId,
      receiverID: user._id,
    },
    model: messageModel,
  });

  if (!message) {
    throw notFoundException("Unauthorized");
  }

  request.status = status;
  await request.save();

  return request;
};
