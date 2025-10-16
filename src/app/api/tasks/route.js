import { NextResponse } from "next/server";
import dbConnect, { collectionNameObj } from "../../../lib/dbConnect";

// 🟢 GET - Get all tasks (optionally filtered by projectId)
export async function GET(req) {
    try {
        const taskCollection = dbConnect(collectionNameObj.taskCollection);

        // Get projectId from query params
        const { searchParams } = new URL(req.url);
        const projectId = searchParams.get("projectId");

        // Build query object
        const query = projectId ? { projectId } : {};

        // Sort by createdAt (latest first)
        const tasks = await taskCollection.find(query).sort({ createdAt: -1 }).toArray();

        return NextResponse.json({ success: true, data: tasks });
    } catch (error) {
        console.error("Error fetching tasks:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch tasks" },
            { status: 500 }
        );
    }
}

// 🟢 POST - Create a new task
export async function POST(req) {
    try {
        const data = await req.json();
        const taskCollection = dbConnect(collectionNameObj.taskCollection);

        // Require projectId
        if (!data.projectId) {
            return NextResponse.json(
                { message: "Project ID is required!" },
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
                message: "✅ Task created successfully!",
                insertedId: result.insertedId,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("❌ Task API Error:", error);
        return NextResponse.json(
            { message: "Failed to create task", error: error.message },
            { status: 500 }
        );
    }
}
