"use server";
import bcrypt from "bcrypt";
import dbConnect, { collectionNameObj } from "../../../lib/dbConnect";

export const registerUser = async ({ name, email, password, image }) => {
  const userCollection = await dbConnect(collectionNameObj.userCollection);

  if (!email || !password) {
    return { success: false, message: "Email or password missing" };
  }

  // Check if user exists
  const user = await userCollection.findOne({ email });
  if (user) {
    return { success: false, message: "User already exists" };
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert to DB
  const result = await userCollection.insertOne({
    name: name || "Unnamed User",
    email,
    password: hashedPassword,
    image: image || "https://ibb.co.com/WRgDfq0",
    role: "user", // default role
    membership: "basic",
    provider: "credentials",
    isVerified: false,
    status: "active",
    failedLoginAttempts: 0,
    lastLogin: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const { acknowledged, insertedId } = result;
  return { success: true, acknowledged, insertedId: insertedId.toString() };
};
