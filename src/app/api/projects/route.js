// src/app/api/projects/route.js
import { NextResponse } from "next/server";
import dbConnect, { collectionNameObj } from "../../../lib/dbConnect";

// ================== GET ==================
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    const db = await dbConnect(collectionNameObj.projectsCollection);

    let query = {};
    if (email) {
      query = {
        $or: [
          { createdBy: email },        
          { "manager.email": email },   
          { teamMembers: email }         
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

// ================== POST ==================
export async function POST(req) {
  try {
    const { projectData } = await req.json();

    if (!projectData) {
      return NextResponse.json(
        { success: false, error: "Missing project data" },
        { status: 400 }
      );
    }

    const collection = await dbConnect(collectionNameObj.projectsCollection);

    // Insert new project
    const result = await collection.insertOne(projectData);

    // Fetch newly created project using insertedId
    const createdProject = await collection.findOne({ _id: result.insertedId });

    return NextResponse.json(
      { success: true, data: createdProject },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create project" },
      { status: 500 }
    );
  }
}
