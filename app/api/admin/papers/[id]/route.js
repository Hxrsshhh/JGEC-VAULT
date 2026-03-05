import connectDB from "@/lib/db";
import Paper from "@/models/Paper";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    const paper = await Paper.findById(id);

    if (!paper) {
      return NextResponse.json({ error: "Paper not found" }, { status: 404 });
    }

    if (paper.isDeleted) {
      return NextResponse.json(
        { error: "Paper already archived" },
        { status: 400 },
      );
    }

    if (paper.isApproved) {
      return NextResponse.json({ message: "Already approved" });
    }

    // Only enforce duplicate rules for subjectwise papers
    if (paper.pageType === "subjectwise") {
      const alreadyApproved = await Paper.findOne({
        pageType: "subjectwise",
        subjectCode: paper.subjectCode,
        department: paper.department,
        academicYear: paper.academicYear,
        examYear: paper.examYear,
        examType: paper.examType,
        paperType: paper.paperType,
        isApproved: true,
        isDeleted: false,
      });

      if (alreadyApproved) {
        return NextResponse.json(
          { error: "Another approved paper already exists for this exam" },
          { status: 400 },
        );
      }
    }

    // Approve this paper
    const updated = await Paper.findByIdAndUpdate(
      id,
      { isApproved: true },
      { new: true },
    );

    // Reward uploader
    await User.findByIdAndUpdate(paper.uploadedBy, {
      $inc: { points: 20 },
    });

    // Archive duplicates (only for subjectwise papers)
    if (paper.pageType === "subjectwise") {
      await Paper.updateMany(
        {
          _id: { $ne: id },
          pageType: "subjectwise",
          subjectCode: paper.subjectCode,
          department: paper.department,
          academicYear: paper.academicYear,
          examYear: paper.examYear,
          examType: paper.examType,
          paperType: paper.paperType,
        },
        { isDeleted: true },
      );
    }

    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Approval failed" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    const deleted = await Paper.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true },
    );

    if (!deleted) {
      return NextResponse.json({ error: "Paper not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Archived" });
  } catch (err) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
