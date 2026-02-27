import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import  connectDB  from "@/lib/db";
import Paper from "@/models/Paper";

export async function GET() {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const uploads = await Paper.find({
      uploadedBy: session.user.id,
    })
      .sort({ createdAt: -1 })
      .lean();

    const formatted = uploads.map((file) => ({
      id: file._id.toString().slice(-6).toUpperCase(),
      title: file.title,
      dept: file.department,
      status: "Indexed",
      createdAt: new Date(file.createdAt).toISOString().split("T")[0],
      size: `${(file.fileSize / (1024 * 1024)).toFixed(1)} MB`,
      type: "PDF",
      fileUrl: file.fileUrl,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to fetch uploads" },
      { status: 500 }
    );
  }
}