
import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb'; // আপনার mongodb কানেকশন ফাইল

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("workStream"); // আপনার ডাটাবেসের নাম দিন

    const tasks = await db.collection("tasks").find({}).toArray(); // "tasks" হলো আপনার কালেকশনের নাম

    return NextResponse.json(tasks);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Error fetching tasks' }, { status: 500 });
  }
}