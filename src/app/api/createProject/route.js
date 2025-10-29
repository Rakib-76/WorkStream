import { NextResponse } from "next/server";
import dbConnect, { collectionNameObj } from "../../../lib/dbConnect"; // tomer MongoDB client import

export async function POST(req) {
    try {
        const { projectData } = await req.json();

        if (!projectData) {
            return NextResponse.json({ error: "Missing collection name or project data" }, { status: 400 });
        }

        // const db = await dbConnect();
        const collection = await dbConnect(collectionNameObj.projectsCollection);// dynamic collection
        const result = await collection.insertOne(projectData);

        return NextResponse.json({ success: true, data: result }, { status: 200 });
    } catch (error) {
        console.error("Error creating project:", error);
        return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
    }
}
