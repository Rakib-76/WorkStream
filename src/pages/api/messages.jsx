// pages/api/messages.js
import dbConnect from "../../lib/dbConnect";

export default async function handler(req, res) {
  const { db } = await dbConnect();
  const coll = db.collection("chat_messages");

  if (req.method === "GET") {
    const { room = "global", limit = 50 } = req.query;
    const msgs = await coll
      .find({ room })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit, 10))
      .toArray();

    // return in chronological order (oldest first)
    res.status(200).json(msgs.reverse());
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end("Method Not Allowed");
  }
}
