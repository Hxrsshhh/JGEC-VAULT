import { NextResponse } from "next/server";
import connectDB  from "@/lib/db";
import Paper from "@/models/Paper";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const department = searchParams.get("department");
    const academicYear = searchParams.get("academicYear");
    const semester = searchParams.get("semester");
    const pageType = searchParams.get("pageType"); // new
    const subjectCode = searchParams.get("subjectCode"); // needed for subjectwise

    if (!department || !academicYear) {
      return NextResponse.json(
        { message: "Department and Academic Year required" },
        { status: 400 }
      );
    }

    const query = {
      department: department.toUpperCase(),
      academicYear: Number(academicYear),
      isApproved: true,
      isDeleted: false,
    };

    // semester filter
    if (semester) {
      query.semester = Number(semester);
    }

    // page type logic
    if (pageType) {
      query.pageType = pageType;
    }

    // subjectwise requires subjectCode
    if (pageType === "subjectwise" && subjectCode) {
      query.subjectCode = subjectCode.toUpperCase();
    }

    const papers = await Paper.find(query).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: papers.length,
      papers,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}