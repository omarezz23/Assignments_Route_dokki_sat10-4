import { Sequelize } from "sequelize";
import {sequelize} from "../../database/db.js";

import { Router } from "express";
import { successResponse } from "../../utils/index.js";
import { postModel } from "../../database/model/posts.model.js";
import { userModel } from "../../database/model/user.model.js";
import { commentModel } from "../../database/model/comments.model.js";

const postCont = Router();
/////////////////////////////////////////////////////////////////////////////
//1
postCont.post( "/create" , async (req, res, next) => {
  try {
    const { title, content, userId } = req.body;

    const user = await userModel.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const post =  postModel.build ({
      title,
      content,
      userId,
    });

    await post.save();

    return res.status(201).json({
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error creating post",
      error: error.message,
    });
  }
});
/////////////////////////////////////////////////////////////////////////////
//2
postCont.delete("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;

    const post = await postModel.findByPk(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    if (post.userId !== userId) {
      return res.status(403).json({
        message: "You are not the owner of this post",
      });
    }

    await post.destroy();

    return res.status(200).json({
      message: "Post deleted successfully",
    });

  } catch (error) {
    return res.status(500).json({
      message: "Error deleting post",
      error: error.message,
    });
  }
});
//////////////////////////////////////////////////////
//3
postCont.get("/details", async (req, res) => {
  try {
    const posts = await postModel.findAll({
      attributes: ["id", "title"],

      include: [
        {
          model: userModel,
          attributes: ["id", "name"],
        },
        {
          model: commentModel,
          attributes: ["id", "content"],
        },
      ],
    });

    return res.status(200).json({
      message: "Posts retrieved successfully",
      posts,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving posts",
      error: error.message,
    });
  }
});
//////////////////////////////////////////////
//4
postCont.get("/comment-count", async (req, res) => {
  try {
    const posts = await postModel.findAll({
      attributes: [
        "id",
        "title",
        [
          sequelize.fn("COUNT", sequelize.col("Comments.id")),
          "commentCount"
        ]
      ],
      include: [
        {
          model: commentModel,
          attributes: [],
        }
      ],
      group: ["Post.id"],
    });

    return res.status(200).json({
      message: "Posts with comments count",
      posts,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving posts",
      error: error.message,
    });
  }
});
//////////////////////////////////////////////////////////////
export default postCont;
