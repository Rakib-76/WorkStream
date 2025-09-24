import { sendEmail } from "../../../../lib/mailer";
import dbConnect, { collectionNameObj } from "../../../../lib/dbConnect";
import crypto from "crypto";
export async function POST(req) {
    try {
        const { email } = await req.json();
        const usersCollection = await dbConnect(collectionNameObj.userCollection);

        const user = await usersCollection.findOne({ email });
        if (!user) {
            return Response.json({ message: "No user found with this email" }, { status: 404 });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenExpire = Date.now() + 1000 * 60 * 15; // 15 min

        await usersCollection.updateOne(
            { email },
            { $set: { resetToken, resetTokenExpire } }
        );

        const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}&email=${email}`;

        // 👉 ইমেইল পাঠাও
        await sendEmail({
            to: email,
            subject: "Reset your password",
            html: `
        <h2>Password Reset Request</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}" target="_blank">${resetLink}</a>
        <p>This link will expire in 15 minutes.</p>
      `,
        });

        return Response.json({ message: "Reset link sent to email" });
    } catch (error) {
        console.error(error);
        return Response.json({ message: "Server error" }, { status: 500 });
    }
}
