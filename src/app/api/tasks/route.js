import { NextResponse } from "next/server";
import dbConnect, { collectionNameObj } from "../../../lib/dbConnect";

// ✅ GET - Get all tasks (Filtered by projectId)
export async function GET(req) {
  console.log("GET request received at /api/tasks", req);
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");

    const taskCollection = await dbConnect(collectionNameObj.taskCollection);

    const query = projectId ? { projectId } : {};
    const tasks = await taskCollection.find(query).sort({ createdAt: -1 }).toArray();

    return NextResponse.json({ success: true, data: tasks }, { status: 200 });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

// ✅ POST - Create a new task
export async function POST(req) {
  try {
    const data = await req.json();
    const taskCollection = await dbConnect(collectionNameObj.taskCollection);

    if (!data.projectId) {
      return NextResponse.json(
        { success: false, message: "Project ID is required!" },
        { status: 400 }
      );
    }

    const result = await taskCollection.insertOne({
      ...data,
      createdAt: new Date(),
      lastUpdated: new Date(),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Task created successfully",
        insertedId: result.insertedId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Task API Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create task" },
      { status: 500 }
    );
  }
}
