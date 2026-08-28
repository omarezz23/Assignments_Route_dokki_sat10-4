import { BSONType } from "mongodb";

db.createCollection("books", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["title"],
      properties: {
        title: {
          bsonType: "string",
          minLength: 1,
        },
      },
    },
  },
});
///////////////////////////////////////
db.books.insertOne({
  titel: "book1",
  author: "Ali",
  year: 1937,
  genres: ["fantasy", "adventure"],
});
///////////////////////////////////////////////////////////////////////
db.logs.insertOne({
  book: "SHIT",
});
