import { Sequelize } from "sequelize";
import { sequelize } from "../../database/db.js";
import { Router } from "express";
import { successResponse } from "../../utils/index.js";
import { postModel } from "../../database/model/posts.model.js";
import { userModel } from "../../database/model/user.model.js";
import { commentModel } from "../../database/model/comments.model.js";

const commentCont = Router();

////////////////////////////////////////////////////////////////////
//1
commentCont.post("/", async (req, res) => {
  try {
    const comments = req.body;

    const newComments = await commentModel.bulkCreate(comments);

    return res.status(201).json({
      message: "Comments created successfully",
      comments: newComments,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error creating comments",
      error: error.message,
    });
  }
});
//////////////////////////////////////////////////////////
//2
commentCont.patch("/:commentId", async (req, res) => {
  try {
    const { commentId } = req.params;
    const { userId, content } = req.body;

    const comment = await commentModel.findByPk(commentId);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    if (comment.userId !== userId) {
      return res.status(403).json({
        message: "You are not the owner of this comment",
      });
    }

    comment.content = content;

    await comment.save();

    return res.status(200).json({
      message: "Comment updated successfully",
      comment,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error updating comment",
      error: error.message,
    });
  }
});
/////////////////////////////////////////////////////////////////
//3
commentCont.post("/find-or-create", async (req, res) => {
  try {
    const { postId, userId, content } = req.body;

    const [comment, created] = await commentModel.findOrCreate({
      where: {
        postId,
        userId,
        content,
      },
      defaults: {
        postId,
        userId,
        content,
      },
    });

    return res.status(created ? 201 : 200).json({
      message: created
        ? "Comment created successfully"
        : "Comment already exists",
      comment,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error finding or creating comment",
      error: error.message,
    });
  }
});

//////////////////////////////////////////////
//4
commentCont.get("/search", async (req, res) => {
  try {
    const { word } = req.query;

    const comments = await commentModel.findAll({
      where: {
        content: {
          [Op.like]: `%${word}%`,
        },
      },
    });

    const count = await commentModel.count({
      where: {
        content: {
          [Op.like]: `%${word}%`,
        },
      },
    });

    return res.status(200).json({
      message: "Comments retrieved successfully",
      count,
      comments,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error searching comments",
      error: error.message,
    });
  }
});

///////////////////////////////////////////////////////
//5
commentCont.get("/newest/:postId", async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await commentModel.findAll({
      where: {
        postId,
      },
      order: [["createdAt", "DESC"]],
      limit: 3,
    });

    return res.status(200).json({
      message: "Newest comments retrieved successfully",
      comments,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving comments",
      error: error.message,
    });
  }
});

export default commentCont;
