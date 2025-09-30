import { NextResponse } from "next/server";
import dbConnect from "../../../lib/dbConnect"; // tomer MongoDB client import

export async function POST(req) {
    try {
        const { collectionName, projectData } = await req.json();

        if (!collectionName || !projectData) {
            return NextResponse.json({ error: "Missing collection name or project data" }, { status: 400 });
        }

        // const db = await dbConnect();
        const collection = await dbConnect(collectionName);// dynamic collection
        const result = await collection.insertOne(projectData);

        return NextResponse.json({ success: true, data: result }, { status: 200 });
    } catch (error) {
        console.error("Error creating project:", error);
        return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
    }
}
