import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import crypto from "crypto";

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

    // Generate a unique filename
    const fileExt = file.name.split(".").pop();
    const randomString = crypto.randomBytes(16).toString("hex");
    const fileName = `${randomString}.${fileExt}`;
    const filePath = `products/${fileName}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from("products") // Assumes a 'products' bucket exists
      .upload(filePath, file, {
        cacheControl: "3600",
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
