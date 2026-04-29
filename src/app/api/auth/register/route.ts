import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  try {
    if (!process.env.DATABASE_URL) {
      return new NextResponse("Registration is not configured", { status: 503 });
    }

    const { name, email, password } = await req.json();
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    const normalizedName = typeof name === "string" ? name.trim() : "";

    if (!normalizedName || !normalizedEmail || !password) {
      return new NextResponse("Missing fields", { status: 400 });
    }

    if (!EMAIL_PATTERN.test(normalizedEmail)) {
      return new NextResponse("Invalid email address", { status: 400 });
    }

    if (typeof password !== "string" || password.length < 8) {
      return new NextResponse("Password must be at least 8 characters", { status: 400 });
    }

    const existingUser = await db.user.findUnique({
      where: {
        email: normalizedEmail
      }
    });

    if (existingUser) {
      return new NextResponse("Email already in use", { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.user.create({
      data: {
        name: normalizedName,
        email: normalizedEmail,
        password: hashedPassword,
        role: "user"
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Registration Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
