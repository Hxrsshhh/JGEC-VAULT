import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import User from "@/models/User";
import cloudinary from "@/lib/cloudinary";

export async function POST(req) {
  try {
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
        { message: "No file provided" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Convert buffer to base64
    const base64Image = `data:${file.type};base64,${buffer.toString(
      "base64"
    )}`;

    // Upload to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(base64Image, {
      folder: "jgec_vault/avatars",
    });

    await connectDB();

    await User.findOneAndUpdate(
      { email: session.user.email },
      { avatar: uploadResponse.secure_url }
    );

    return NextResponse.json({
      imageUrl: uploadResponse.secure_url,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Upload failed" },
      { status: 500 }
    );
  }
}