import { NextResponse } from "next/server";
import dbConnect, { collectionNameObj } from "../../../lib/dbConnect";


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
