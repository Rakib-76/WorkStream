// app/api/upload/route.js
import cloudinary from "../../../lib/cloudinary"; 
import { NextResponse } from "next/server";


export async function POST(request) {
  //  FormData receive
  const formData = await request.formData();
  const file = formData.get("file");

  if (!file) {
    return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
  }

  //  Buffer or ArrayBuffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  //  Cloudinary promise 
  const uploadPromise = new Promise((resolve, reject) => {
    // Cloudinary upload stream 
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "project-tasks", // save it cloudinary folder
        resource_type: "auto",
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return reject(error);
        }
        // after successfully upload URL and public_id return
        resolve({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    ).end(buffer);
  });

  try {
    const result = await uploadPromise;

    //success response
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "File upload failed", details: error.message },
      { status: 500 }
    );
  }
}