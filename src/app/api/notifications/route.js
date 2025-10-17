import dbConnect, { collectionNameObj } from "../../../lib/dbConnect";


// ✅ GET: get notifications by projectId
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) return new Response(JSON.stringify({ success: false, error: "projectId required" }), { status: 400 });

    const collection = await dbConnect(collectionNameObj.notificationsCollection);
    const notifications = await collection.find({ projectId }).sort({ createdAt: -1 }).toArray();

    return new Response(JSON.stringify({ success: true, notifications }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });
  }
}
