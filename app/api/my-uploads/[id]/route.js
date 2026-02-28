import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import Paper from "@/models/Paper";
import User from "@/models/User";
import cloudinary from "@/lib/cloudinary";

export async function DELETE(req, context) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // 🔥 unwrap params (Next 15+)
    const { id } = await context.params;

    const paper = await Paper.findOne({
      _id: id,
      uploadedBy: session.user.id,
    });

    if (!paper) {
      return NextResponse.json(
        { message: "Paper not found or not authorized" },
        { status: 404 }
      );
    }

    // Delete from Cloudinary
    if (paper.fileUrl) {
      const publicId = paper.fileUrl
        .split("/")
        .slice(-2)
        .join("/")
        .replace(".pdf", "");

      await cloudinary.uploader.destroy(publicId, {
        resource_type: "raw",
      });
    }

    // Soft delete
    paper.isDeleted = true;
    await paper.save();

    // Update user stats
    await User.findByIdAndUpdate(session.user.id, {
      $inc: {
        uploadsCount: -1,
        points: -20,
      },
    });

    return NextResponse.json({ message: "Deleted successfully" });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Deletion failed" },
      { status: 500 }
    );
  }
}