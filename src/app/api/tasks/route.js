import { NextResponse } from "next/server";
import dbConnect from "../../../lib/dbConnect"; // তোমার MongoDB client

export async function POST(req) {
    try {
        const taskData = await req.json();

        if (!taskData || !taskData.projectId || !taskData.title || !taskData.startDate || !taskData.deadline) {
            return NextResponse.json(
                { error: "Missing required fields (projectId, title, startDate, deadline)" },
                { status: 400 }
            );
        }

        // Auto timestamps
        taskData.createdAt = new Date();
        taskData.lastUpdated = new Date();

        // Tags string থেকে array convert
        if (taskData.tags && typeof taskData.tags === "string") {
            taskData.tags = taskData.tags.split(",").map((tag) => tag.trim());
        }

        const collection = await dbConnect("tasks"); // dynamic collection: "tasks"
        const result = await collection.insertOne(taskData);

        return NextResponse.json({ success: true, data: result }, { status: 200 });
    } catch (error) {
        console.error("Error creating task:", error);
        return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
    }
}
