import  connectDB  from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function PATCH(req, context) {
  try {
    await connectDB();

    const { id } = await context.params; // ✅ FIX
    const body = await req.json();

    const updated = await User.findByIdAndUpdate(
      id,
      body,
      { returnDocument: "after" } // ✅ FIX mongoose warning
    ).select("-password");

    if (!updated) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Update failed" },
      { status: 500 }
    );
  }
}