import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import  connectDB  from "@/lib/db";
import User from "@/models/User";

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await connectDB();

    const user = await User.findOne({ email: session.user.email });

    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    user.status = "deleted";
    await user.save();

    return NextResponse.json({
      message: "Account deactivated",
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}