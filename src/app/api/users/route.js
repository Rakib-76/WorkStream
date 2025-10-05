import dbConnect, { collectionNameObj } from "../../../lib/dbConnect"; 

export async function GET() {
    try {
        const userCollection = dbConnect(collectionNameObj.userCollection);

        const users = await userCollection
            .find({})
            .sort({ createdAt: -1 }) // -1 = descending order (newest first)
            .toArray();

        return Response.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        return Response.json(
            { message: "Failed to fetch users", error: error.message },
            { status: 500 }
        );
    }
}
