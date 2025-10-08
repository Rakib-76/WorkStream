// src/app/api/projects/route.js
import { NextResponse } from "next/server";
import dbConnect from "../../../lib/dbConnect";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    const db = await dbConnect("projects");

    let query = {};
    if (email) {
      query = {
        $or: [
          { createdBy: email },          // user নিজে project তৈরি করেছে
          { "manager.email": email },    // user manager হিসেবে আছে
          { teamMembers: email }         // user team member হিসেবে আছে
        ]
      };
    }


    // sort by createdAt descending (latest first)
    const projects = await db.find(query, { sort: { createdAt: -1 } }).toArray();

    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
