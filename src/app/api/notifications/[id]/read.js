import dbConnect, { collectionNameObj } from "../../../../lib/dbConnect";

export async function PATCH(req) {
    try {
        const { pathname } = new URL(req.url);
        const id = pathname.split("/")[3]; // /api/notifications/:id/read

        if (!id) return new Response(JSON.stringify({ success: false, error: "Notification ID required" }), { status: 400 });

        const collection = await dbConnect(collectionNameObj.notificationsCollection);
        await collection.updateOne({ _id: new ObjectId(id) }, { $set: { read: true } });

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });
    }
}
