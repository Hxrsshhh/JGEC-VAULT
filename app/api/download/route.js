import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const fileUrl = searchParams.get("url");
  const fileName = searchParams.get("name");

  if (!fileUrl || !fileName) {
    return NextResponse.json(
      { message: "Missing file URL or name" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(fileUrl);
    const buffer = await response.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Download failed" },
      { status: 500 }
    );
  }
}