// src/app/api/projects/route.js
import { NextResponse } from "next/server";
import dbConnect from "../../../lib/dbConnect";

export async function GET() {
  try {
    const db = await dbConnect("projects");
    const projects = await db.find({}).toArray();

    return NextResponse.json({ success: true, data: projects }); // ✅ Fixed
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    ); // ✅ Fixed
  }
}
