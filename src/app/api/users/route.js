import dbConnect, { collectionNameObj } from "../../../lib/dbConnect";

export async function GET(request) {
    try {
        const userCollection = await dbConnect(collectionNameObj.userCollection);

        // URL থেকে email query parameter ধরা হচ্ছে
        const { searchParams } = new URL(request.url);
        const email = searchParams.get("email");

        let users;

        if (email) {
            // যদি email parameter থাকে → নির্দিষ্ট ইউজার খুঁজবে
            users = await userCollection.findOne({ email: email });

            if (!users) {
                return Response.json(
                    { message: "User not found" },
                    { status: 404 }
                );
            }
        } else {
            // না থাকলে সব ইউজার রিটার্ন করবে
            users = await userCollection
                .find({})
                .sort({ createdAt: -1 }) // newest first
                .toArray();
        }

        return Response.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        return Response.json(
            { message: "Failed to fetch users", error: error.message },
            { status: 500 }
        );
    }
}
