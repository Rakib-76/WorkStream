"use server";
import bcrypt from "bcrypt";
import dbConnect, { collectionNameObj } from "../../../lib/dbConnect";

export const loginUser = async ( payload) =>{
    const {email, password} = payload;
    const userCollection = dbConnect(collectionNameObj.userCollection);
    const user = await userCollection.findOne({email})
    if(!user) return null;
    const isPasswordOk =await bcrypt.compare( password , user.password)
    if(!isPasswordOk) return null;
    return user;
}