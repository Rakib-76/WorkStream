import dbConnect, { collectionNameObj } from "@/lib/dbConnect";

export async function POST(req) {
    const { email, newMembership } = await req.json();

    if (!email || !newMembership)
        return new Response(JSON.stringify({ error: "Email and membership required" }), { status: 400 });

    try {
        const userCollection = await dbConnect(collectionNameObj.userCollection);
        const result = await userCollection.updateOne(
            { email },
            { $set: { membership: newMembership } }
        );

        if (result.matchedCount === 0)
            return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });

        return new Response(JSON.stringify({ message: "Membership updated successfully" }), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
