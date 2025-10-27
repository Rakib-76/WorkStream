import { NextResponse } from "next/server";
import dbConnect, { collectionNameObj } from "../../../lib/dbConnect";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json({ success: false, message: "Project ID required" }, { status: 400 });
    }

    const taskCollection = await dbConnect(collectionNameObj.taskCollection);

    // Aggregate tasks per assigned member
    const aggregation = await taskCollection
      .aggregate([
        { $match: { projectId: String(projectId) } }, // project wise filter
        {
          $group: {
            _id: "$assigneeTo", // team member (email or id)
            total: { $sum: 1 }, // total tasks assigned
            completed: { $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] } }, // completed tasks
          },
        },
      ])
      .toArray();

    // Format: [{ name: "Abid", total: 10, completed: 7 }, ...]
    const formatted = aggregation.map(a => ({
      name: a._id,
      total: a.total,
      completed: a.completed,
    }));

    return NextResponse.json({ success: true, data: formatted }, { status: 200 });
  } catch (err) {
    console.error("Workload fetch error:", err);
    return NextResponse.json({ success: false, message: "Failed to fetch workload" }, { status: 500 });
  }
}
