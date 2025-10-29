import { NextResponse } from "next/server";
import dbConnect, { collectionNameObj } from "../../../../lib/dbConnect";

export async function POST(req) {
  try {
    const { projectId, memberEmail } = await req.json();

    if (!projectId || !memberEmail) {
      return NextResponse.json(
        { success: false, message: "Missing projectId or memberEmail" },
        { status: 400 }
      );
    }

    const projectCollection = dbConnect(collectionNameObj.projectCollection);
    const userCollection = dbConnect(collectionNameObj.userCollection);

    // Check if user exists
    const user = await userCollection.findOne({ email: memberEmail });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found in system" },
        { status: 404 }
      );
    }

    // Update project document
    const result = await projectCollection.updateOne(
      { _id: projectId },
      { $addToSet: { teamMembers: memberEmail } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { success: false, message: "User already a member or update failed" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Member added successfully",
    });
  } catch (err) {
    console.error("Error adding member:", err);
    return NextResponse.json(
      { success: false, message: "Server error while adding member" },
      { status: 500 }
    );
  }
}
