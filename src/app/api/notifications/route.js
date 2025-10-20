import dbConnect, { collectionNameObj } from "../../../lib/dbConnect";

// ✅ POST: create notification
export async function POST(req) {
    try {
        const { projectId, taskId, user, message, type } = await req.json();

        if (!projectId || !message || !user?.email) {
            return new Response(JSON.stringify({ success: false, error: "Missing fields" }), { status: 400 });
        }

        const notification = {
            projectId,
            taskId: taskId || null,
            user,
            message,
            type: type || "info",
            isRead: false,
            createdAt: new Date().toISOString(),
        };

        const collection = await dbConnect(collectionNameObj.notificationsCollection);
        const result = await collection.insertOne(notification);

        return new Response(JSON.stringify({ success: true, id: result.insertedId }), { status: 201 });
    } catch (err) {
        return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });
    }
}
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