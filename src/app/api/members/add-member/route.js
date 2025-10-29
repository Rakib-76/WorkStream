// import { NextResponse } from "next/server";
// import dbConnect, { collectionNameObj } from "../../../../lib/dbConnect";

// export async function POST(req) {
//   try {
//     const { projectId, memberEmail } = await req.json();

//     if (!projectId || !memberEmail) {
//       return NextResponse.json(
//         { success: false, message: "Missing projectId or memberEmail" },
//         { status: 400 }
//       );
//     }

//     const projectCollection = await dbConnect(collectionNameObj.projectCollection);
//     const userCollection = await dbConnect(collectionNameObj.userCollection);

//     // 1️⃣ Check if user exists
//     const user = await userCollection.findOne({ email: memberEmail });
//     if (!user) {
//       return NextResponse.json(
//         { success: false, message: "User not found in the system" },
//         { status: 404 }
//       );
//     }

//     // 2️⃣ Update project document - add member to teamMembers array
//     const result = await projectCollection.updateOne(
//       { _id: projectId },
//       { $addToSet: { teamMembers: memberEmail } } // avoids duplicates
//     );

//     if (result.modifiedCount === 0) {
//       return NextResponse.json(
//         { success: false, message: "User already a member or update failed" },
//         { status: 400 }
//       );
//     }

//     // 3️⃣ Prepare member info to return
//     const newMember = {
//       email: user.email,
//       name: user.name || user.email.split("@")[0],
//       img: user.image || `https://placehold.co/40x40/94A3B8/FFFFFF?text=${user.name ? user.name[0].toUpperCase() : "?"}`,
//       role: "Member", // always Member by default
//       tasks: [],
//     };

//     return NextResponse.json({
//       success: true,
//       message: `${memberEmail} added to the project successfully!`,
//       member: newMember, // ✅ return new member info
//     });
//   } catch (err) {
//     console.error("Error adding member:", err);
//     return NextResponse.json(
//       { success: false, message: "Server error while adding member" },
//       { status: 500 }
//     );
//   }
// }
