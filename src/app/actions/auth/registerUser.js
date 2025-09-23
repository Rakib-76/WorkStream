"use server";
import bcrypt from "bcrypt"
import dbConnect, { collectionNameObj } from "../../../lib/dbConnect"

export const registerUser = async (formData) => {
    const userCollection = dbConnect(collectionNameObj.userCollection)

    // FormData → object
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const image = formData.get("image"); // ekhane File object thakbe

    if (!email || !password) {
        return { success: false, message: "Not found" };
    }

    const user = await userCollection.findOne({ email });
    if (!user) {
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await userCollection.insertOne({
            name,
            email,
            password: hashedPassword,
            image: image || null,
        });

        const { acknowledged, insertedId } = result;
        return { success: true, acknowledged, insertedId: insertedId.toString() };
    }

    return { success: false, message: "User already exists" };
};
