import dbConnect, { collectionNameObj } from "../../../lib/dbConnect";

// ✅ POST: create notification
export async function POST(req, res) {
    try {
        const { projectId, message, createdBy, type } = await req.json();

        if (!projectId || !message || !createdBy) {
            return res.status(400).json({ success: false, error: "Missing required fields" });
        }

        const notification = {
            projectId,
            message,
            createdBy,
            type: type || "info",
            read: false,
            createdAt: new Date().toISOString(),
        };

        const collection = await dbConnect(collectionNameObj.notificationsCollection);
        const result = await collection.insertOne(notification);

        res.status(201).json({ success: true, notificationId: result.insertedId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
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
