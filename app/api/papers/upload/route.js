import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import cloudinary from "@/lib/cloudinary";
import  connectDB  from "@/lib/db";
import Paper from "@/models/Paper";

export async function POST(req) {
  try {
    await connectDB();

    // get session
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        { message: "File required" },
        { status: 400 }
      );
    }

     if (file.type !== "application/pdf") {
  return NextResponse.json(
    { message: "Only PDF files allowed" },
    { status: 400 }
  );
}

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // upload to cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "papers",
          resource_type: "raw",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      stream.end(buffer);
    });


    const paper = await Paper.create({
      subjectCode: formData.get("subjectCode") || undefined,
      title: formData.get("title") || undefined,
      department: formData.get("department"),
      academicYear: Number(formData.get("academicYear")),
      pageType: formData.get("pageType"),
      examType: formData.get("examType"),
      paperType: formData.get("paperType"),
      examYear: Number(formData.get("examYear")),
      fileUrl: uploadResult.secure_url,
      fileSize: uploadResult.bytes,
      fileType: "pdf",

      // user id from session
      uploadedBy: new mongoose.Types.ObjectId(session.user.id),
    });

    return NextResponse.json({ success: true, paper });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Upload failed" },
      { status: 500 }
    );
  }
}