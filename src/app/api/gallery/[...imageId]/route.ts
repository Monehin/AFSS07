// app/api/gallery/[...imageId]/route.ts
import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ imageId: string[] }> }
) {
  const param = await params;
  const fullImageId = param.imageId.join("/");

  try {
    const result = await cloudinary.uploader.destroy(fullImageId);

    if (result.result !== "ok" && result.result !== "not found") {
      return NextResponse.json(
        { error: "Failed to delete image" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Image deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete image", e: error },
      { status: 500 }
    );
  }
}
