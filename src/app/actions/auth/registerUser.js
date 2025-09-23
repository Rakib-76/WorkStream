"use server";
import bcrypt from "bcrypt"
import dbConnect, { collectionNameObj } from "../../../lib/dbConnect"

export const registerUser = async (payload) =>{
    console.log(payload)

    const userCollection = dbConnect(collectionNameObj.userCollection)

    // // validition
    const {email, password} = payload;
    if(!email || !password) return {success: false, message: "Not found"};

    const user = await userCollection.findOne({email:payload.email})
    if(!user){
        const hashedPassword = await bcrypt.hash(password,10);
        payload.password = hashedPassword;
        const result = await userCollection.insertOne(payload)
        const {acknowledged, insertedId} = result
        return {success:true, acknowledged, insertedId: insertedId.toString()};
    }
    // // return  null;
    return  { success: false, message: "user already exist" };

}