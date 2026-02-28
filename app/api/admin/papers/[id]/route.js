import  connectDB  from "@/lib/db";
import Paper from "@/models/Paper";
import { NextResponse } from "next/server";

export async function PATCH(req, context) {
  try {
    await connectDB();

    const { id } = await context.params; // ✅ FIX
    const body = await req.json();

    const updated = await Paper.findByIdAndUpdate(
      id,
      body,
      { returnDocument: "after" } // ✅ FIX mongoose warning
    );

    if (!updated) {
      return NextResponse.json(
        { error: "Paper not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json(
      { error: "Update failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, context) {
  try {
    await connectDB();

    const { id } = await context.params; // ✅ FIX

    const deleted = await Paper.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { returnDocument: "after" }
    );

    if (!deleted) {
      return NextResponse.json(
        { error: "Paper not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Archived" });
  } catch {
    return NextResponse.json(
      { error: "Delete failed" },
      { status: 500 }
    );
  }
}