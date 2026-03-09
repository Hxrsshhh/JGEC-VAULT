import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Paper from "@/models/Paper";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();

    const [
      totalPapers,
      approvedPapers,
      pendingPapers,
      totalUsers,
      recentPapers,
    ] = await Promise.all([
      // Total papers that are NOT deleted
      Paper.countDocuments(),

      // Papers that are approved and NOT deleted
      Paper.countDocuments({ isApproved: true, isDeleted: false }),

      // Papers that are NOT approved and NOT deleted (The "Pending" queue)
      Paper.countDocuments({ isApproved: false, isDeleted: false }),

      User.countDocuments(),

      // Fetching active papers for the dashboard list
      Paper.find({ isDeleted: false, isApproved: false })
        .populate("uploadedBy", "name")
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    return NextResponse.json({
      stats: {
        totalPapers,
        approvedPapers,
        pendingPapers,
        totalUsers,
      },
      papers: recentPapers,
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    return NextResponse.json(
      { error: "Failed to load dashboard" },
      { status: 500 },
    );
  }
}
