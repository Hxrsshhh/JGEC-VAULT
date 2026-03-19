import connectDB from "@/lib/db";
import Paper from "@/models/Paper";
import { NextResponse } from "next/server";

// APPROVE PAPER
export async function PATCH(req, context) {
  try {
    await connectDB();

    const { id } = await context.params;

    const data = await req.json();

    const paper = await Paper.findById(id);

    if (!paper) {
      return NextResponse.json({ error: "Paper not found" }, { status: 404 });
    }

    // update pageType if sent
    if (data.pageType) paper.pageType = data.pageType;

    // decide which field to update
    if (paper.pageType === "notes" || paper.pageType === "yearwise") {
      if (data.title) paper.title = data.title;
    } else {
      if (data.subjectCode) paper.subjectCode = data.subjectCode;
    }

    // update other fields
    if (data.department) paper.department = data.department;
    if (data.examType) paper.examType = data.examType;
    if (data.examYear) paper.examYear = data.examYear;
    if (data.academicYear) paper.academicYear = data.academicYear;

    // approve paper
    if (data.isApproved === true) {
      paper.isApproved = true;
    }

    await paper.save();

    return NextResponse.json({
      success: true,
      paper,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to update paper" },
      { status: 500 },
    );
  }
}

// SOFT DELETE PAPER
export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    const deletedPaper = await Paper.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }, // returns updated doc
    );

    if (!deletedPaper) {
      return NextResponse.json({ error: "Paper not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Paper moved to trash",
      paper: deletedPaper,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to delete paper" },
      { status: 500 },
    );
  }
}
