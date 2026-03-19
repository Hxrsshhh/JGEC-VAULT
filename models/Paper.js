import mongoose from "mongoose";

const paperSchema = new mongoose.Schema(
  {
    subjectCode: {
      type: String,
      uppercase: true,
      trim: true,
      required: function () {
        return this.pageType === "subjectwise";
      },
    },
    title: {
      type: String,
      uppercase: true,
      trim: true,
    },

    department: {
      type: String,
      enum: ["CSE", "ECE", "ME", "EE", "CE", "IT"],
      required: true,
    },

    academicYear: {
      type: Number,
      min: 1,
      max: 4,
      required: true,
    },

    // page category
    pageType: {
      type: String,
      enum: ["yearwise", "subjectwise", "notes"],
      required: true,
    },

    // mid / end
    examType: {
      type: String,
      enum: ["mid", "end"],
    },

    // regular / internal
    paperType: {
      type: String,
      enum: ["regular", "internal"],
    },

    examYear: {
      type: Number,
      required: function () {
        return this.pageType !== "notes";
      },
    },

    fileUrl: {
      type: String,
      required: true,
    },

    fileSize: Number,

    fileType: {
      type: String,
      default: "pdf",
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
      default: false,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// Indexes
paperSchema.index({ department: 1, academicYear: 1 });
paperSchema.index({ subjectCode: 1 });
paperSchema.index({ uploadedBy: 1 });
paperSchema.index({ createdAt: -1 });
paperSchema.index({ isApproved: 1 });

paperSchema.index(
  {
    pageType: 1,
    subjectCode: 1,
    department: 1,
    academicYear: 1,
    examYear: 1,
    examType: 1,
    paperType: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      isApproved: true,
      pageType: "subjectwise",
    },
  },
);
paperSchema.index(
  {
    pageType: 1,
    title: 1,
    department: 1,
    academicYear: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      isApproved: true,
      pageType: { $in: ["yearwise", "notes"] },
    },
  },
);

export default mongoose.models.Paper || mongoose.model("Paper", paperSchema);
