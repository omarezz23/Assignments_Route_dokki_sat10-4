import { Router } from "express";
import { successResponse } from "../../utils/index.js";
import { connectDB } from "../../database/db.js";
import {
  createNote,
  deleteAllNotes,
  deleteNote,
  getNoteByContent,
  getNoteById,
  getNotesAggregate,
  getNotesWithUser,
  getPaginatedNotes,
  replaceNote,
  updateAllNotesTitle,
  updateNote,
} from "./notes.service.js";

export const notesCont = Router();
//1
notesCont.post("/addone", async (req, res, next) => {
  const note = await createNote(req.query.id, req.body);

  return successResponse(res, 201, "created", note);
});

//2
notesCont.patch("/notes/:noteId", async (req, res, next) => {
  const note = await updateNote(req.params.noteId, req.query.id, req.body);

  return successResponse(res, 200, "updated", note);
});

///3
notesCont.put("/notes/replace/:noteId", async (req, res, next) => {
  try {
    const note = await replaceNote(req.params.noteId, req.query.id, req.body);

    return successResponse(res, 200, "replaced", note);
  } catch (error) {
    next(error);
  }
});

//4 and 5
notesCont.patch("/notes/all", async (req, res, next) => {
  const result = await updateAllNotesTitle(req.query.id, req.body.title);

  return successResponse(res, 200, "updated", result);
});

//6 delete
notesCont.delete("/:noteId", async (req, res, next) => {
  const note = await deleteNote(req.params.noteId, req.query.id);

  return successResponse(res, 200, "deleted", note);
});

//7
notesCont.get("/notes/paginate-sort", async (req, res, next) => {
  const notes = await getPaginatedNotes(
    req.query.id,
    req.query.page,
    req.query.limit,
  );

  return successResponse(res, 200, "success", notes);
});

//8
notesCont.get("/notes/:id", async (req, res, next) => {
  const note = await getNoteById(req.params.id, req.query.id);

  return successResponse(res, 200, "success", note);
});

//9
notesCont.get("/notes/note-by-content", async (req, res, next) => {
  const note = await getNoteByContent(req.query.content, req.query.id);

  return successResponse(res, 200, "success", note);
});

//10
notesCont.get("/notewithuserid", async (req, res, next) => {
  const notes = await getNotesWithUser(req.query.id);

  return successResponse(res, 200, "success", notes);
});

//11
notesCont.get("/notes/aggregate", async (req, res, next) => {
  const notes = await getNotesAggregate(req.query.id, req.query.title);

  return successResponse(res, 200, "success", notes);
})

//12
notesCont.delete("/notes", async (req, res, next) => {
  const result = await deleteAllNotes(req.query.id);

  return successResponse(res, 200, "deleted", result);
});

;
