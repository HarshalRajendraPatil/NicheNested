import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: [2, "Name must contain al least 2 characters."],
      maxLength: [30, "Name can only contain at most 30 characters."],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [validator.isEmail, "Please provide a valid email address."],
    },
    address: { type: String, required: true },
    phone: {
      type: Number,
      required: true,
    },
    niches: {
      firstNiche: String,
      secondNiche: String,
      thirdNiche: String,
    },
    password: {
      type: String,
      required: true,
      minLength: [8, "Password must contain at least 8 characters."],
      select: false,
    },
    resume: {
      public_id: String,
      url: String,
    },
    coverLetter: {
      type: String,
    },
    role: {
      type: String,
      enum: ["Job Seeker", "Employer"],
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (enterePassword) {
  return await bcrypt.compare(enterePassword, this.password);
};

userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

export const User = mongoose.model("User", userSchema);
