import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Paper from "@/models/Paper";

export async function GET() {
  try {
    await connectDB();

    const leaderboard = await Paper.aggregate([
      {
        $match: {
          isApproved: true,
          isDeleted: false,
        },
      },

      {
        $group: {
          _id: "$uploadedBy",
          uploads: { $sum: 1 },
        },
      },

      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },

      { $unwind: "$user" },

      {
        $match: {
          "user.status": "active",
          "user.role": "student",
          "user.points": { $gt: 0 },
        },
      },

      {
        $project: {
          name: "$user.name",
          uploads: 1,
          points: "$user.points",
        },
      },

      { $sort: { points: -1 } },
      { $limit: 8 },
    ]);

    const rankedUsers = leaderboard.map((user, index) => ({
      rank: index + 1,
      name: user.name,
      uploads: user.uploads, // approved paper count
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