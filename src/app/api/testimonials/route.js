// ./src/app/api/testimonials/route.js
import { NextResponse } from "next/server";
import dbConnect, { collectionNameObj } from "../../../lib/dbConnect";

export async function GET() {
    try {
        const collection = await dbConnect(collectionNameObj.testimonialsCollection);
        const testimonials = await collection.find().toArray();

        return NextResponse.json(testimonials, { status: 200 });
    } catch (error) {
        console.error("Error fetching testimonials:", error);
        return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 });
    }
}
