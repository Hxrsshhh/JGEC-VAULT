import mongoose from "mongoose";

const paperSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },

    subjectCode: { type: String, required: true, uppercase: true },

    department: {
      type: String,
      enum: ["CSE", "ECE", "ME", "EE", "CE", "IT"],
      required: true,
    },

    semester: { type: Number, required: true, min: 1, max: 8 },

    academicYear: { type: Number, required: true, min: 1, max: 4 },

    examType: {
      type: String,
      enum: ["Mid", "End", "Supplementary"],
      required: true,
    },

    examYear: { type: Number, required: true },

    fileUrl: { type: String, required: true },

    fileSize: Number,

    fileType: { type: String, default: "pdf" },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    downloadsCount: { type: Number, default: 0 },

    isApproved: { type: Boolean, default: false },

    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// 🔥 Correct Indexes
paperSchema.index({ department: 1, academicYear: 1 });
paperSchema.index({ subjectCode: 1 });
paperSchema.index({ uploadedBy: 1 });
paperSchema.index({ createdAt: -1 });

// 🔥 Correct Unique Constraint
paperSchema.index(
  { subjectCode: 1, department: 1, examYear: 1, examType: 1 },
  { unique: true }
);

export default mongoose.models.Paper ||
  mongoose.model("Paper", paperSchema);