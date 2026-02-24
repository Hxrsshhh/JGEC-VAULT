import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Paper from "@/models/Paper";
import cloudinary from "@/lib/cloudinary";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

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
    const examYear = Number(formData.get("year")); // renamed
    const academicYear = Number(formData.get("academicYear"));

    // 🔥 Basic validation
    if (!title || !subjectCode || !department || !semester || !examType || !examYear || !academicYear) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    if (!file) {
      return NextResponse.json({ message: "File required" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { message: "Only PDF files allowed" },
        { status: 400 }
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { message: "File too large (Max 10MB)" },
        { status: 400 }
      );
    }

    // 🔥 Proper duplicate check
    const existing = await Paper.findOne({
      subjectCode: subjectCode.toUpperCase(),
      department: department.toUpperCase(),
      examYear,
      examType,
    });

    if (existing) {
      return NextResponse.json(
        { message: "Paper already exists" },
        { status: 400 }
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
          }
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
      examYear, // ✅ correct field
      fileUrl: uploadResult.secure_url,
      fileSize: file.size,
      uploadedBy: session.user.id,
    });

    return NextResponse.json(
      { message: "Upload successful", paper },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Upload failed", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const department = searchParams.get("department");
    const academicYear = searchParams.get("academicYear");

    if (!department || !academicYear) {
      return NextResponse.json(
        { message: "Department and Academic Year required" },
        { status: 400 }
      );
    }

    const papers = await Paper.find({
      department: department.toUpperCase(),
      academicYear: Number(academicYear),
      isApproved: true,
      isDeleted: false,
    }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, papers });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}