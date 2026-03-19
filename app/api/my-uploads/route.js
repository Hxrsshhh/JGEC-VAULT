import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/db";
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
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .lean();

    const formatted = uploads.map((file) => ({
      id: file._id.toString(),
      title: file.title,
      department: file.department,
      subjectCode: file.subjectCode,
      pageType: file.pageType,
      semester: file.semester,
      examType: file.examType,
      examYear: file.examYear,
      academicYear: file.academicYear, 
      createdAt: file.createdAt,
      fileSize: file.fileSize,
      fileUrl: file.fileUrl,
      isApproved: file.isApproved,
    }));
    return NextResponse.json(formatted);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to fetch uploads" },
      { status: 500 },
    );
  }
}
