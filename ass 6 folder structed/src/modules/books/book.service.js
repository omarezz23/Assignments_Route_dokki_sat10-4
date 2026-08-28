import { BookModel } from "../../database/model/book.model.js"

export const insert = async (input) => {
  const book = await BookModel.insertOne(input)
  return book
} 

export const insertm = async (input) => {
  const book = await BookModel.insertMany(input)
  return book
} 


export const updateBook = async (title, data) => {
    const result = await LogModel.updateOne(
        { title },
        { $set: data }
    );
    if (result.matchedCount === 0) {
    return res.status(404).json({
      message: "Book not found",
    });
  }

    return result;
};
