import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";
import { postModel } from "./posts.model.js";
import { userModel } from "./user.model.js";

export const commentModel = sequelize.define(
  "Comment",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: postModel,
        key: "id",
      },
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: userModel,
        key: "id",
      },
    },

    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "comments",
    timestamps: false,
  }
);

postModel.hasMany(commentModel, {
  foreignKey: "postId",
});

commentModel.belongsTo(postModel, {
  foreignKey: "postId",
});

userModel.hasMany(commentModel, {
  foreignKey: "userId",
});

commentModel.belongsTo(userModel, {
  foreignKey: "userId",
});