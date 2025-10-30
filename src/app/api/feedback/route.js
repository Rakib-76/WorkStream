// import dbConnect, { collectionNameObj } from "../../../lib/dbConnect";

import dbConnect, { collectionNameObj } from "../../../lib/dbConnect";

export async function POST(req) {
  try {
    const body = await req.json();

    //  connect to testimonials collection using the shared connection
    const feedbackCollection = await dbConnect(collectionNameObj.testimonialsCollection);

    const result = await feedbackCollection.insertOne({
      ...body,
      createdAt: new Date(),
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Feedback added successfully",
        result,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Feedback insert error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to add feedback",
      }),
      { status: 500 }
    );
  }
}
