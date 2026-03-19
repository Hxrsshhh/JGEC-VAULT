import connectDB from "@/lib/db";
import Paper from "@/models/Paper";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const paper = await Paper.create(body);

    return NextResponse.json(paper, { status: 201 });
  } catch (err) {
    if (err.code === 11000) {
      return NextResponse.json(
        { error: "Paper already exists for this exam." },
        { status: 400 },
      );
    }

    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();

    const papers = await Paper.find({
      isApproved: true,
      isDeleted: false,
    })
      .populate({
        path: "uploadedBy",
        select: "name email department",
      })
      .sort({ createdAt: -1 });

    return NextResponse.json({ papers });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Failed to fetch papers" },
      { status: 500 },
    );
  }
}
