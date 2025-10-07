// src/app/api/projects/route.js
import { NextResponse } from "next/server";
import dbConnect from "../../../lib/dbConnect";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email"); // query থেকে email নাও

    const db = await dbConnect("projects");

    let query = {};
    if (email) {
      query = { "createdBy": email }; // শুধু ওই user এর projects
    }

    // sort by createdAt descending (latest first)
    const projects = await db.find(query).sort({ createdAt: -1 }).toArray();

    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
