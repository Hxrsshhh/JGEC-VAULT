import connectDB from "@/lib/db";
import Paper from "@/models/Paper";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const papers = await Paper.find({
      isApproved: false,
      isDeleted: false,
    })
      .populate("uploadedBy", "name email department")
      .sort({ createdAt: -1 });

    return NextResponse.json(papers);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch pending papers" },
      { status: 500 },
    );
  }
}

// UPDATE / APPROVE PAPER
export async function PATCH(req, { params }) {
  try {
    await connectDB();

    const { id } = params;
    const body = await req.json();

    const paper = await Paper.findById(id);

    if (!paper) {
      return NextResponse.json({ error: "Paper not found" }, { status: 404 });
    }

    // update fields
    const allowedFields = [
      "title",
      "subjectCode",
      "department",
      "examType",
      "examYear",
      "academicYear",
      "pageType",
      "isApproved",
    ];

    allowedFields.forEach((field) => {
      if (body[field] !== undefined) {
        paper[field] = body[field];
      }
    });

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

// DELETE / REJECT PAPER
export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const { id } = params;

    const deleted = await Paper.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: "Paper not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Paper deleted",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to delete paper" },
      { status: 500 },
    );
  }
}
