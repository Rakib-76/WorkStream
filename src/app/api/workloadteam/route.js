import { NextResponse } from "next/server";
import dbConnect, { collectionNameObj } from "../../../lib/dbConnect";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json(
        { success: false, message: "Project ID is required" },
        { status: 400 }
      );
    }

    const taskCollection = await dbConnect(collectionNameObj.taskCollection);

    // 🔹 Aggregate workload data per member
    const pipeline = [
      { $match: { projectId: projectId } }, // projectId is string in DB
      { $unwind: "$assigneeTo" }, // split array into individual documents
      {
        $group: {
          _id: "$assigneeTo",
          total: { $sum: 1 },
          completed: {
            $sum: {
              $cond: [{ $eq: ["$status", "Completed"] }, 1, 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          name: { $arrayElemAt: [{ $split: ["$_id", "@"] }, 0] },
          total: 1,
          completed: 1,
        },
      },
      { $sort: { total: -1 } },
    ];

    const workloadData = await taskCollection.aggregate(pipeline).toArray();

    if (!workloadData.length) {
      return NextResponse.json({
        success: false,
        message: "No workload data found for this project",
        data: [],
      });
    }

    return NextResponse.json({ success: true, data: workloadData });
  } catch (error) {
    console.error("Error fetching workload data:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch workload data" },
      { status: 500 }
    );
  }
}
