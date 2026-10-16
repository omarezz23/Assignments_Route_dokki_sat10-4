import { messageModel } from "../../database/models/messege.model.js";
import { notFoundException } from "../errors/error.exception.js";
import * as baseDB from"./repo.js"

export const findById = async ({ id, options, select, model }) => {

  return await baseDB.findById({ id, options, select, model : messageModel });
};
////////////////////////////////////////
export const findOne = async ({ filter, options } = {}) => {

  return await baseDB.findOne({ filter, options, model: messageModel });
};
//////////////////////////////////
export const countDocuments = async ({ filter = {} } = {}) => {
  return await baseDB.countDocuments({ filter, model: messageModel });
};
//////////////////////////////
export const find = async ({ filter, options, select } = {}) => {
  return await baseDB.find({ filter, options, select, model: messageModel });
};
 
/////////////////////////////////////
export const paginate = async ({
  filter = {},
  options = {},
  page = 1,
  limit = 5,
  model,
} = {}) => {

  return await baseDB.paginate({ filter, options, page, limit, model : messageModel });
};
///////////////////////////////////////

///////////////////////////////////////////////////////
export const create = async ({ data, options }) => {
  return await baseDB.create({ data, options, model : messageModel });
};
/////////////////////////////////////////////////////////////////////////
export const insertMany = async ({ data, }) => {
  return await baseDB.insertMany({ data, model : messageModel });
};
//////////////////////////////////////////////
export const updateOne = async ({ filter, update, options, model } = {}) => {
    return await baseDB.updateOne({ filter, update, options, model : messageModel });

};
////////////////////////////////////////////////////////
export const findOneAndUpdate = async ({
  filter,
  update,
  options,
  model,
} = {}) => {
return await baseDB.findOneAndUpdate({ filter, update, options, model : messageModel });
};
//////////////////////////////////////////////////////
export const findByIdAndUpdate = async ({
  id,
  update,
  options = { new: true },
  model,
}) => {
  return await baseDB.findByIdAndUpdate({ id, update, options, model : messageModel });
};
//////////////////////////////////////////////////////
export const deleteOne = async ({ filter, model }) => {
  return await baseDB.deleteOne({ filter, model : messageModel });
};
///////////////////////////////////////////////////////////
export const deleteMany = async ({ filter, model }) => {
  return await baseDB.deleteMany({ filter, model : messageModel });
};
////////////////////////
export const findOneAndDelete = async ({ filter, model } = {}) => {
  return await baseDB.findOneAndDelete({ filter, model : messageModel });
};
