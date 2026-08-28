import { AuthorModel } from "../../database/model/author.model.js"


export const insert = async (input) => {
  const author = await AuthorModel.insertOne(input)
  return author
} 