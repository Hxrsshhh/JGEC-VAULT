import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Paper from "@/models/Paper";
import cloudinary from "@/lib/cloudinary";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import User from "@/models/User";

export async function POST(req) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();

    const file = formData.get("file");
    const title = formData.get("title");
    const subjectCode = formData.get("subjectCode");
    const department = formData.get("department");
    const semester = Number(formData.get("semester"));
    const examType = formData.get("examType");
    const examYear = Number(formData.get("year"));
    const academicYear = Number(formData.get("academicYear"));

    if (
      !title ||
      !subjectCode ||
      !department ||
      !semester ||
      !examType ||
      !examYear ||
      !academicYear
    ) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 },
      );
    }

    if (!file) {
      return NextResponse.json({ message: "File required" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { message: "Only PDF files allowed" },
        { status: 400 },
      );
    }

    if (file.size > 4 * 1024 * 1024) {
      return NextResponse.json(
        { message: "File too large (Max 4MB)" },
        { status: 400 },
      );
    }

    // 🔴 Block uploads if a paper already approved
    const approvedPaper = await Paper.findOne({
      subjectCode: subjectCode.toUpperCase(),
      department: department.toUpperCase(),
      examYear,
      examType,
      isApproved: true,
      isDeleted: false,
    });

    if (approvedPaper) {
      return NextResponse.json(
        { message: "Paper already approved for this exam. Uploads closed." },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "raw",
            folder: "question-papers",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        )
        .end(buffer);
    });

    const paper = await Paper.create({
      title,
      subjectCode: subjectCode.toUpperCase(),
      department: department.toUpperCase(),
      semester,
      academicYear,
      examType,
      examYear,
      fileUrl: uploadResult.secure_url,
      fileSize: file.size,
      uploadedBy: session.user.id,
    });

    // update user stats
    await User.findByIdAndUpdate(session.user.id, {
      $set: { lastLogin: new Date() },
      $inc: { uploadsCount: 1 },
    });

    return NextResponse.json(
      { message: "Upload successful", paper },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);

    if (error.code === 11000) {
      return NextResponse.json(
        { message: "This paper already exists." },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { message: "Upload failed", error: error.message },
      { status: 500 },
    );
  }
}

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const department = searchParams.get("department");
    const academicYear = searchParams.get("academicYear");
    const semester = searchParams.get("semester");

    if (!department || !academicYear) {
      return NextResponse.json(
        { message: "Department and Academic Year required" },
        { status: 400 },
      );
    }

    const query = {
      department: department.toUpperCase(),
      academicYear: Number(academicYear),
      isApproved: true,
      isDeleted: false,
    };

    if (semester) query.semester = Number(semester);

    const papers = await Paper.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, papers });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 },
    );
  }
}
