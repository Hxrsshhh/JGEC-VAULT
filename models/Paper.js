import mongoose from "mongoose";

const paperSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    subjectCode: {
      type: String,
      required: true,
      uppercase: true,
    },

    department: {
      type: String,
      enum: ["CSE", "ECE", "ME", "EE", "CE", "IT", "PH", "CH", "MA"],
      required: true,
    },

    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 8,
    },

    examType: {
      type: String,
      enum: ["Mid", "End", "Supplementary"],
      required: true,
    },

    year: {
      type: Number,
      required: true,
    },

    fileUrl: {
      type: String,
      required: true,
    },

    fileSize: {
      type: Number, // in KB or MB
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    downloadsCount: {
      type: Number,
      default: 0,
    },

    isApproved: {
      type: Boolean,
      default: false, // admin approval system
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Paper ||
  mongoose.model("Paper", paperSchema);