import dbConnect, { collectionNameObj } from "../../../lib/dbConnect";

export async function GET(request) {
    try {
        const userCollection = await dbConnect(collectionNameObj.userCollection);

        const { searchParams } = new URL(request.url);
        const email = searchParams.get("email");

        let users;

        if (email) {
            users = await userCollection.findOne({ email: email });

            if (!users) {
                return Response.json(
                    { message: "User not found" },
                    { status: 404 }
                );
            }
        } else {
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

export async function PUT(request) {
    try {
        const userCollection = await dbConnect(collectionNameObj.userCollection);
        const { searchParams } = new URL(request.url);
        const email = searchParams.get("email");

        if (!email) {
            return Response.json({ success: false, message: "Email is required" }, { status: 400 });
        }

        const body = await request.json();
        const { name, phone, website, bio, location, image } = body;

        const updateDoc = {
            $set: {
                name,
                phone,
                website,
                bio,
                location,
                image,
                updatedAt: new Date(),
            },
        };

        const result = await userCollection.updateOne({ email }, updateDoc);

        if (result.matchedCount === 0) {
            return Response.json({ success: false, message: "User not found" }, { status: 404 });
        }

        const updatedUser = await userCollection.findOne({ email });

        return Response.json({ success: true, updatedUser }, { status: 200 });
    } catch (error) {
        console.error("Error updating user:", error);
        return Response.json(
            { success: false, message: "Failed to update user", error: error.message },
            { status: 500 }
        );
    }
}