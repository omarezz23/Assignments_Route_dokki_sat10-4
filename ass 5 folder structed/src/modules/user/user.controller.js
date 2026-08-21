import { Router } from "express";
import { db } from "../../database/db.js";
import { successResponse } from "../../utils/index.js";
import { userModel } from "../../database/model/user.model.js";

const userCont = Router();
//////////////////////////////////////////////////////////////////////////////
//1
userCont.post("/signup", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await userModel.findOne({
      where: { email },
    });

    if (existingUser) {
      const error = new Error("Email already exists");
      error.status = 400;
      throw error;
    }
    const user = userModel.build({
      name,
      email,
      password,
    });

    await user.save();

    return res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
});
/////////////////////////////////////////////////////////////////////
//2
userCont.patch("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, password, role } = req.body;

    const user = await userModel.findByPk(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await user.update(
      {
        name,
        email,
        password,
        role,
      },
      {
        validate: false,
      },
    );

    return res.status(200).json({
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
});
/////////////////////////////////////////////////////////////////////////////
//3

userCont.get( "/:email" , async (req, res, next) => {
  try {
    const { email } = req.params;

    const user = await userModel.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "User found",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

//////////////////////////////////////////////////////
//4

userCont.get ("/id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await userModel.findByPk(id, {
      attributes: {
        exclude: ["role"],
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "User found",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});
//////////////////////////////////////////////////////
export default userCont;
