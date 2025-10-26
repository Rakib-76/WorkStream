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

    const aggregation = await taskCollection
      .aggregate([
        { $match: { projectId: String(projectId), status: "Completed" } },
        {
          $group: {
            _id: "$priority", // High / Medium / Low
            totalCompleted: { $sum: 1 },
          },
        },
      ])
      .toArray();

    const chartData = ["High", "Medium", "Low"].map((p) => {
      const found = aggregation.find((a) => a._id === p);
      return { priority: p, completed: found ? found.totalCompleted : 0 };
    });

    return NextResponse.json({ success: true, data: chartData }, { status: 200 });
  } catch (error) {
    console.error("Completed task fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch completed tasks" },
      { status: 500 }
    );
  }
}
