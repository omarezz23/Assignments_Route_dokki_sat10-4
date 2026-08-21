import { sequelize } from "../db.js";
import { DataTypes } from "sequelize";
import { userModel } from "./user.model.js";

export const postModel = sequelize.define(
  "Post",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: userModel,
        key: "id",
      },
    },
  },
  {
    tableName: "posts",
    timestamps: true,
    paranoid: true,
  },
);

userModel.hasMany(postModel, {
  foreignKey: "userId",
});

postModel.belongsTo(userModel, {
  foreignKey: "userId",
});
