import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const fileUrl = searchParams.get("url");
  const fileName = searchParams.get("name");

  if (!fileUrl) {
    return NextResponse.json(
      { message: "File URL missing" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(fileUrl, {
      redirect: "follow",
    });

    if (!response.ok) {
      return NextResponse.json(
        { message: "Failed to fetch file from storage" },
        { status: 500 }
      );
    }

    const arrayBuffer = await response.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Content-Length": arrayBuffer.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Download failed" },
      { status: 500 }
    );
  }
}