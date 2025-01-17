import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import type { UploadApiResponse } from "cloudinary";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  const clerkUser = await currentUser();
  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method not allowed" });
  }
  if (!clerkUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  const uploadsFolder = process.env.CLOUDINARY_UPLOADS_FOLDER;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const fileBuffer = await file.arrayBuffer();
  const result = await new Promise<UploadApiResponse>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { resource_type: "auto", folder: uploadsFolder },
        (error, result) => {
          if (error || !result) reject(error);
          else resolve(result);
        }
      )
      .end(Buffer.from(fileBuffer));
  });

  return NextResponse.json({ url: result.secure_url }, { status: 200 });
}
