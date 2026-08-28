import { LogModel } from "../../database/model/logs.model.js"

export const insert = async (input) =>{
  const log = await LogModel.insertOne (input)
  return log 
}

