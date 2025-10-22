import { NextResponse } from "next/server";
import cloudinary from "../../../lib/cloudinary";
import { writeFile } from "fs/promises";
import path from "path";
import fs from "fs";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const data = await req.formData();
    const file = data.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // temporary save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const tempPath = path.join(process.cwd(), "public", file.name);
    await writeFile(tempPath, buffer);

    // upload to cloudinary
    const res = await cloudinary.uploader.upload(tempPath, {
      folder: "project_files",
    });

    // remove temp file
    fs.unlinkSync(tempPath);

    return NextResponse.json({
      url: res.secure_url,
      public_id: res.public_id,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
