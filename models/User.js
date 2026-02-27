import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      minlength: 6,
      select: false,
    },

    avatar: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      maxlength: 300,
      default: "",
      trim: true,
    },

    department: {
      type: String,
      enum: ["CSE", "ECE", "ME", "EE", "CE", "IT", "PH", "CH", "MA"],
    },

    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },

    uploadsCount: {
      type: Number,
      default: 0,
    },

    downloadsCount: {
      type: Number,
      default: 0,
    },
    points: {
      type: Number,
      default: 0,
    },

    authProviders: [
      {
        provider: String,
        providerId: String,
      },
    ],

    status: {
      type: String,
      enum: ["active", "blocked", "deleted"],
      default: "active",
    },

    lastLogin: {
      type: Date,
    },
  },
  { timestamps: true },
);

export default mongoose.models.User || mongoose.model("User", userSchema);
