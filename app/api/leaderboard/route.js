import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();

    const users = await User.find({
      status: "active",
      role: "student",
      points: { $gt: 0 }, // Hide zero or negative
    })
      .select("name uploadsCount points")
      .sort({ points: -1 })
      .limit(8)
      .lean();

    const rankedUsers = users.map((user, index) => ({
      rank: index + 1,
      name: user.name,
      uploads: user.uploadsCount,
      points: user.points,
      level: getLevel(user.points),
    }));

    return NextResponse.json(rankedUsers);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}

function getLevel(points) {
  if (points >= 2500) return "Elite";
  if (points >= 1500) return "Veteran";
  if (points >= 800) return "Contributor";
  if (points >= 400) return "Aspirant";
  return "Junior";
}