import { NextResponse } from "next/server";
import dbConnect  from "../../../lib/dbConnect"; 


export async function GET(request) {
try {
const db = await dbConnect();
const events = await db.collection("events").find({}).toArray();
// convert _id to string
const out = events.map((e) => ({ ...e, id: e._id.toString(), _id: undefined }));
return NextResponse.json(out, { status: 200 });
} catch (err) {
console.error(err);
return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
}
}


export async function POST(request) {
try {
const body = await request.json();
const db = await dbConnect();
const now = new Date();
const doc = {
title: body.title || "Untitled",
start: body.start || now.toISOString(),
end: body.end || null,
allDay: body.allDay || false,
description: body.description || "",
projectId: body.projectId || null,
assignees: body.assignees || [],
createdAt: now,
updatedAt: now,
};


const res = await db.collection("events").insertOne(doc);
const inserted = await db.collection("events").findOne({ _id: res.insertedId });
const out = { ...inserted, id: inserted._id.toString(), _id: undefined };
return NextResponse.json(out, { status: 201 });
} catch (err) {
console.error(err);
return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
}
}


export async function PATCH(request) {
try {
const body = await request.json();
const { id, ...patch } = body;
if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
const db = await dbConnect();
patch.updatedAt = new Date();
const { ObjectId } = await import("mongodb");
const res = await db.collection("events").findOneAndUpdate(
{ _id: new ObjectId(id) },
{ $set: patch },
{ returnDocument: "after" }
);
if (!res.value) return NextResponse.json({ error: "Not found" }, { status: 404 });
const out = { ...res.value, id: res.value._id.toString(), _id: undefined };
return NextResponse.json(out, { status: 200 });
} catch (err) {
console.error(err);
return NextResponse.json({ error: "Failed to update event" }, { status: 500 });
}
}


export async function DELETE(request) {
try {
const url = new URL(request.url);
const id = url.searchParams.get("id");
if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
const { ObjectId } = await import("mongodb");
const db = await dbConnect();
const res = await db.collection("events").deleteOne({ _id: new ObjectId(id) });
if (res.deletedCount === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
return NextResponse.json({ ok: true }, { status: 200 });
} catch (err) {
console.error(err);
return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
}
}