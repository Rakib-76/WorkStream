// pages/api/tasks/[id].js
import { NextResponse } from "next/server";
import dbConnect, { collectionNameObj } from "../../../lib/dbConnect";
import { ObjectId } from "mongodb";

export async function PATCH(req, { params }) {
    try {
        const { id } = params;
        const data = await req.json(); // { status, columnTitle }

        const taskCollection = await dbConnect(collectionNameObj.taskCollection);

        await taskCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { ...data, lastUpdated: new Date() } }
        );

        return NextResponse.json({ success: true, message: "Task updated!" });
    } catch (error) {
        console.error("❌ Task update error:", error);
        return NextResponse.json({ success: false, message: "Update failed" }, { status: 500 });
    }
}
