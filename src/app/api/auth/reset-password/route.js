import dbConnect, { collectionNameObj } from "../../../../lib/dbConnect";
import bcrypt from "bcrypt";

export async function POST(req) {
    try {
        const { email, token, password } = await req.json();
        const usersCollection = await dbConnect(collectionNameObj.userCollection);

        const user = await usersCollection.findOne({ email });
        if (!user || user.resetToken !== token || Date.now() > user.resetTokenExpire) {
            return new Response(JSON.stringify({ message: "Invalid or expired token" }), { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await usersCollection.updateOne(
            { email },
            { $set: { password: hashedPassword }, $unset: { resetToken: "", resetTokenExpire: "" } }
        );

        return new Response(JSON.stringify({ message: "Password reset successful" }), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
    }
}
