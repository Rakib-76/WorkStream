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

// ✅ PUT route (for updating user info)
export async function PUT(request) {
    try {
        const userCollection = await dbConnect(collectionNameObj.userCollection);
        const body = await request.json();
        const { email, name, phone, website, bio, location, image } = body;

        if (!email) {
            return Response.json(
                { message: "Email is required for updating user" },
                { status: 400 }
            );
        }

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
            return Response.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        return Response.json(
            { message: "Profile updated successfully", result },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating user:", error);
        return Response.json(
            { message: "Failed to update user", error: error.message },
            { status: 500 }
        );
    }
}
