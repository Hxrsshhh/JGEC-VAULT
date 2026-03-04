import connectDB from "@/lib/db";
import Paper from "@/models/Paper";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function PATCH(req, context) {
  try {
    await connectDB();

    const { id } = await context.params;

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

    // check if another approved paper exists
    const alreadyApproved = await Paper.findOne({
      subjectCode: paper.subjectCode,
      department: paper.department,
      examYear: paper.examYear,
      examType: paper.examType,
      isApproved: true,
      isDeleted: false,
    });

    if (alreadyApproved) {
      return NextResponse.json(
        { error: "Another paper for this exam is already approved" },
        { status: 400 },
      );
    }

    // approve this paper
    const updated = await Paper.findByIdAndUpdate(
      id,
      { isApproved: true },
      { returnDocument: "after" },
    );

    // reward uploader
    await User.findByIdAndUpdate(paper.uploadedBy, {
      $inc: { points: 20 },
    });

    // archive other duplicates
    await Paper.updateMany(
      {
        _id: { $ne: id },
        subjectCode: paper.subjectCode,
        department: paper.department,
        examYear: paper.examYear,
        examType: paper.examType,
      },
      { isDeleted: true },
    );

    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: "Approval failed" }, { status: 500 });
  }
}

export async function DELETE(req, context) {
  try {
    await connectDB();

    const { id } = await context.params; // ✅ FIX

    const deleted = await Paper.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { returnDocument: "after" },
    );

    if (!deleted) {
      return NextResponse.json({ error: "Paper not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Archived" });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
