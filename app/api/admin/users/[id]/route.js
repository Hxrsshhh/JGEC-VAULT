import connectDB from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function PATCH(req, context) {
  try {
    await connectDB();

    const params = await context.params; // ✅ unwrap params
    const { id } = params;

    const body = await req.json();
    const { status } = body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { status },
      { returnDocument: "after" }, // ✅ replaces deprecated "new: true"
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 },
    );
  }
}
