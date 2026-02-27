import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import  connectDB  from "@/lib/db";
import User from "@/models/User";
import Paper from "@/models/Paper";

export async function GET() {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get user
    const user = await User.findById(userId).lean();

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // 🔥 Real upload count (safe even if field corrupt)
    const uploadsCount = await Paper.countDocuments({
      uploadedBy: userId,
    });

    const stats = {
      name: user.name,
      role: user.role,
      status: user.status,
      uploadsCount,
      downloadsCount: user.downloadsCount || 0,
      points: user.points || 0,
      memberSince: user.createdAt,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}