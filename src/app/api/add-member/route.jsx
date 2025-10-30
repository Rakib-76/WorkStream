import dbConnect, { collectionNameObj } from "../../../lib/dbConnect";
import { ObjectId } from "mongodb";

export async function PUT(request) {
  try {
    const body = await request.json();
    const { projectId, memberEmail } = body;

    console.log("🟢 Received PUT request!");
    console.log("📦 Project ID:", projectId);
    console.log("📧 Member Email:", memberEmail);

    if (!projectId || !memberEmail) {
      return Response.json(
        { success: false, message: "Missing projectId or memberEmail" },
        { status: 400 }
      );
    }

    // ✅ Connect to the "tasks" (or whichever) collection
    const collection = await dbConnect(collectionNameObj.projectsCollection);

    // ✅ Find the project by ID
    const project = await collection.findOne({ _id: new ObjectId(projectId) });
    if (!project) {
      return Response.json(
        { success: false, message: "Project not found" },
        { status: 404 }
      );
    }

    // ✅ Check if member already exists
    if (project.teamMembers?.includes(memberEmail)) {
      return Response.json(
        { success: false, message: "Member already exists in this project" },
        { status: 409 }
      );
    }

    // ✅ Update project by pushing new member
    const result = await collection.updateOne(
      { _id: new ObjectId(projectId) },
      { $push: { teamMembers: memberEmail } }
    );

    console.log("✅ Member added successfully!");

    return Response.json(
      {
        success: true,
        message: `${memberEmail} added successfully!`,
        updateResult: result,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error in PUT route:", error);
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}