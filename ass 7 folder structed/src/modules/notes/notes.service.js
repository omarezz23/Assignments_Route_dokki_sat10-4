import mongoose from "mongoose";
import { NoteModel } from "../../database/models/notes.model.js";
import { UserModel } from "../../database/models/user.model.js";

export const createNote = async (userId, input) => {

  // Check that user exists
  const user = await UserModel.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  const note = new NoteModel({
    ...input,
    userId: userId
  });

  await note.save();

  return note;
};


export const deleteNote = async (noteId, userId) => {

  const note = await NoteModel.findById(noteId);

  if (!note) {
    throw new Error("Note not found");
  }

  if (note.userId.toString() !== userId) {
    throw new Error("You are not the owner of this note");
  }

  await NoteModel.findByIdAndDelete(noteId);

  return note;
};


export const getPaginatedNotes = async (userId, page, limit) => {


  const notes = await NoteModel.find({
    userId: userId
  })
    .sort({ createdAt: -1 })
    .limit(limit);

  return notes;
};


export const getNoteById = async (noteId, userId) => {
  const note = await NoteModel.findById(noteId);

  if (!note) {
    throw new Error("Note not found");
  }

  if (note.userId.toString() !== userId) {
    throw new Error("You are not the owner of this note");
  }

  return note;
};


export const getNoteByContent = async (content, userId) => {
  const note = await NoteModel.findOne({
    content: content,
    userId: userId
  });

  if (!note) {
    throw new Error("Note not found");
  }

  return note;
};

export const deleteAllNotes = async (userId) => {
  const result = await NoteModel.deleteMany({
    userId: userId
  });

  if (result.deletedCount === 0) {
    throw new Error("No notes found");
  }

  return result;
};


export const updateNote = async (noteId, userId, input) => {
  const { title, content } = input;

  const note = await NoteModel.findOneAndUpdate(
    {
      _id: noteId,
      userId: userId
    },
    {
      $set: {
        title,
        content
      },
      $inc: {
        __v: 1
      }
    },
    {
      new: true,
      runValidators: true
    }
  );

  if (!note) {
    throw new Error("Note not found or you are not the owner");
  }

  return note;
};


export const replaceNote = async (noteId, userId, input) => {
  const { title, content } = input;

  const note = await NoteModel.findOneAndReplace(
    {
      _id: noteId,
      userId: userId
    },
    {
      title,
      content,
      userId
    },
    {
      new: true,
      runValidators: true,
      returnDocument:"after" 
    }
  );

  if (!note) {
    throw new Error("Note not found or you are not the owner");
  }

  return note;
};

//4
export const updateAllNotesTitle = async (userId, title) => {
  const result = await NoteModel.updateMany(
    { userId },
    {
      $set: { title },
      $inc: { __v: 1 }
    },
    {
      runValidators: true 
    }
  );

  if (result.matchedCount === 0) {
    throw new Error("No notes found");
  }

  return result;
};
//10

export const getNotesWithUser = async (userId) => {
  return await NoteModel.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId)
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user"
      }
    },
    {
      $unwind: "$user"
    },
    {
      $project: {
        _id: 1,
        title: 1,
        createdAt: 1,
        "user.email": 1
      }
    }
  ]);
};

//11
export const getNotesAggregate = async (userId, title) => {
  const match = {
    userId: new mongoose.Types.ObjectId(userId)
  };

  if (title) {
    match.title = title;
  }

  return await NoteModel.aggregate([
    {
      $match: match
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user"
      }
    },
    {
      $unwind: "$user"
    },
    {
      $project: {
        _id: 0,
        title: 1,
        userId: 1,
        createdAt: 1,
        "user.name": 1,
        "user.email": 1
      }
    }
  ]);
};