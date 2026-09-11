import mongoose from "mongoose";
import { GenderEnum } from "../../common/enum/index.js";

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      minlength: 3,
      maxlength: 30,
      required: true,
    },
    lastname: {
      type: String,
      minlength: 3,
      maxlength: 30,
      required: true,
    },

    email: {
      type: String,
      minlength: 5,
      maxlength: 50,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      default: null,
    },
    dob: {
      type: Date,
      default: null,
    },
    confirmEmail: {
      type: Date,
      default: null,
    },
    image: {
      type: String,
      default: null,
    },
    coverImage: {
      type: String,
      default: null,
    },
    gender: {
      type: Number,
      enum: Object.values(GenderEnum),
      default: GenderEnum.MALE,
    },
  },
  {
    collection: "users",
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    strict: true,
    strictQuery: true,
    autoIndex: true,
  },
);



userSchema
  .virtual("fullName")
  .set(function (value) {
    const [firstname, ...rest] = value.trim().split(" ");
    const lastname = rest.join(" ");

    this.firstname = firstname;
    this.lastname = lastname;
  })
  .get(function () {
    return `${this.firstname} ${this.lastname}`;
  });

// userSchema
//   .virtual("fullName")
//   .set(function (value) {
//     const [firstname, lastname] = value.split(" ");
//     this.set({ firstname, lastname });
//   })
//   .get(function () {
//     return `${this.firstname} ${this.lastname}`;
//   });

export const UserModel = mongoose.model("User", userSchema, "users") || mongoose.model("User");
