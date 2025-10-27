import { NextResponse } from "next/server";
import dbConnect, { collectionNameObj } from "../../../lib/dbConnect";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json(
        { success: false, message: "Project ID is required!" },
        { status: 400 }
      );
    }

    const taskCollection = await dbConnect(collectionNameObj.taskCollection);

    // 🔍 Find tasks where status = "Pending"
    const aggregation = await taskCollection
      .aggregate([
        { $match: { projectId: String(projectId), status: "Pending" } },
        {
          $group: {
            _id: "$priority", // Group by High/Medium/Low
            totalPending: { $sum: 1 },
          },
        },
      ])
      .toArray();

    // 🔢 Ensure all priorities exist in chart data
    const chartData = ["High", "Medium", "Low"].map((p) => {
      const found = aggregation.find((a) => a._id === p);
      return { priority: p, pending: found ? found.totalPending : 0 };
    });

    return NextResponse.json({ success: true, data: chartData }, { status: 200 });
  } catch (error) {
    console.error("Pending task fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch pending tasks" },
      { status: 500 }
    );
  }
}
