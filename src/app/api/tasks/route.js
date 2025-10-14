import { NextResponse } from "next/server";
import dbConnect, { collectionNameObj } from "../../../lib/dbConnect";

// 🟢 GET - Get all tasks
export async function GET() {
    try {
        const taskCollection = dbConnect(collectionNameObj.taskCollection);

        // ✅ Sort by createdAt (descending order)
        const tasks = await taskCollection
            .find()
            .sort({ createdAt: -1 }) // -1 = latest first
            .toArray();

        return NextResponse.json({ success: true, data: tasks });
    } catch (error) {
        console.error("Error fetching tasks:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch tasks" },
            { status: 500 }
        );
    }
}


// 🟢 POST - Add a new task
export async function POST(req) {
    try {
        const data = await req.json();

        const tasksCollection = dbConnect(collectionNameObj.taskCollection);

        const result = await tasksCollection.insertOne({
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
