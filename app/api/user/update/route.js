import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import  connectDB  from "@/lib/db";
import User from "@/models/User";

export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { name, avatar, bio } = await req.json();

    await connectDB();

    const user = await User.findOne({ email: session.user.email });

    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    if (user.status !== "active")
      return NextResponse.json(
        { message: "Account not active" },
        { status: 403 }
      );

    user.name = name ?? user.name;
    user.avatar = avatar ?? user.avatar;
    user.bio = bio ?? user.bio;

    await user.save();

    return NextResponse.json({
      message: "Profile updated",
      user,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}