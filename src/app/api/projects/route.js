// src/app/api/projects/route.js
import dbConnect from "../../../lib/dbConnect";

export async function GET() {
  try {
    const db = await dbConnect("projects");
    const projects = await db.find({}).toArray();

    return Response.json({ success: true, data: projects });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
