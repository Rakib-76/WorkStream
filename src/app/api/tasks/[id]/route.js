import { NextResponse } from "next/server";
import dbConnect, { collectionNameObj } from "../../../../lib/dbConnect";
import { ObjectId } from "mongodb";

export async function PATCH(req, { params }) {
    try {
        const { id } = params;
        const data = await req.json();

        const taskCollection = await dbConnect(collectionNameObj.taskCollection);

        const result = await taskCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { ...data, lastUpdated: new Date() } }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json(
                { success: false, message: "Task not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, message: "Task updated!" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Task update error:", error);
        return NextResponse.json(
            { success: false, message: "Update failed" },
            { status: 500 }
        );
    }
}
// 🔴 DELETE — Remove a single task
export async function DELETE(req, { params }) {
    try {
        const { id } = params;

        const taskCollection = await dbConnect(collectionNameObj.taskCollection);

        const result = await taskCollection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return NextResponse.json(
                { success: false, message: "Task not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, message: "Task deleted successfully!" },
            { status: 200 }
        );
    } catch (error) {
        console.error("❌ Task delete error:", error);
        return NextResponse.json(
            { success: false, message: "Task delete failed" },
            { status: 500 }
        );
    }
}
