import { Router } from "express";
import { connectDB } from "../../database/index.js";
import { successResponse } from "../../utils/index.js";
import { insert, insertm, updateBook } from "./book.service.js";
import { BookModel } from "../../database/model/book.model.js";

export const bookCont = Router();
//5
bookCont.post("/insertone", async (req, res, next) => {
  const book = await insert(req.body);
  return successResponse(res, 201, "created", book);
});
//6
bookCont.post("/insertmany", async (req, res, next) => {
  const book = await insertm(req.body);
  return successResponse(res, 201, "created", book);
});
//8
bookCont.patch("/books/:title", async (req, res, next) => {
  const result = await updateBook(req.params, req.body);
  return successResponse(res, 201, "updated", result);
});

//9
bookCont.get("/book", async (req, res, next) => {
  const book = await BookModel.findOne({ title: "brave new world" });
  return successResponse(res, 201, "the book", book);
});
//10
bookCont.get("/books", async (req, res, next) => {
  const books = await BookModel.find({
    year: {
      $gte: 1990,
      $lte: 2010,
    },
  }).toArray();
  return successResponse(res, 201, "the books", books);
});
//11
bookCont.get("/booksGener", async (req, res, next) => {
  const books = await BookModel.find({
    genres: {
      $in: ["Science Fiction"],
    },
  }).toArray();
  return successResponse(res, 201, "the books", books);
});

//12
bookCont.get("/aggregate0", async (req, res, next) => {
  const result = await BookModel.aggregate([
    {
      $sort: {
        year: -1,
      },
    },
    {
      $skip: 2,
    },
    {
      $limit: 3,
    },
  ]).toArray();
  return successResponse(res, 201, "the books", result);
});
//13
bookCont.get("/booksYear", async (req, res, next) => {
  const books = await BookModel.find({
    year: {
      $type: "int",
    },
  }).toArray();
  return successResponse(res, 201, "the books", books);
});

//14
bookCont.get("/booksNotInGener", async (req, res, next) => {
  const books = await BookModel.find({
    genres: {
      $nin: ["Horror", "Science Fiction"],
    },
  }).toArray();
  return successResponse(res, 201, "the books", books);
});
//15
bookCont.delete("/book", async (req, res, next) => {
  const result = await BookModel.deleteMany({
    year: { $lt: 2000 },
  });
  if (result.deletedCount === 0) {
    return res.status(404).json({
      message: "Book not found",
    });
  }
  return successResponse(res, 201, "deleted");
});
//16
bookCont.get("/aggregate1", async (req, res, next) => {
  const result = await BookModel.aggregate([
    {
      $match: {
        year: { $gt: 2000 },
      },
    },
    {
      $project: {
        _id: 0,
        title: 1,
        author: 1,
        year: 1,
        genres: 1,
      },
    },
    {
      $sort: {
        year: -1,
      },
    },
  ]).toArray();
  return successResponse(res, 201, "the books", result);
});
//17
bookCont.get("/aggregate2", async (req, res, next) => {
  const result = await BookModel.aggregate([
    {
      $match: {
        year: { $gt: 2000 },
      },
    },
    {
      $project: {
        _id: 0,
        title: 1,
        author: 1,
        year: 1,
        genres: 0,
      },
    },
    {
      $sort: {
        year: -1,
      },
    },
  ]).toArray();
  return successResponse(res, 201, "the books", result);
});

//18
bookCont.get("/unwind", async (req, res, next) => {
  const result = await BookModel.aggregate([
    {
      $unwind: {
        path: "$genres",
        includeArrayIndex: "tagIndex",
        preserveNullAndEmptyArrays: true,
      },
    },
  ]).toArray();
  return successResponse(res, 201, "the books", result);
});

//19
bookCont.get("/lookup", async (req, res, next) => {
  const result = await BookModel.aggregate([
    {
      $lookup: {
        from: "logs",
        localField: "_id",
        foreignField: "bookId",
        as: "logs",
      },
    },
  ]).toArray();
  return successResponse(res, 201, "the books", result);
});
//////////////////////////////////////////////////////
//the end
