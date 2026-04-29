import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import crypto from "crypto";

const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"]
]);

export async function POST(req: Request) {
  try {
    const session = await auth();

    // Secure the endpoint: only admins can upload images
    if (!session || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!isSupabaseConfigured || !supabase) {
      return new NextResponse("Supabase is not configured", { status: 500 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return new NextResponse("No file provided", { status: 400 });
    }

    const fileExt = ALLOWED_IMAGE_TYPES.get(file.type);
    if (!fileExt) {
      return new NextResponse("Unsupported image type", { status: 415 });
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      return new NextResponse("Image must be smaller than 4 MB", { status: 413 });
    }

    const randomString = crypto.randomBytes(16).toString("hex");
    const fileName = `${randomString}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error } = await supabase.storage.from("products").upload(filePath, file, {
      cacheControl: "3600",
      contentType: file.type,
      upsert: false
    });

    if (error) {
      console.error("Supabase Storage Error:", error);
      return new NextResponse(error.message, { status: 500 });
    }

    // Get public URL
    const {
      data: { publicUrl }
    } = supabase.storage.from("products").getPublicUrl(filePath);

    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error("Upload Route Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
