"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function loginAction(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  try {
    // 1. Determine redirect path based on user role
    let redirectTo = "/account";

    const adminUsername = process.env.ADMIN_USERNAME || "admin";
    const user = await db.user.findUnique({
      where: { email: username }
    });

    if (username === adminUsername || (user && user.role === "admin")) {
      redirectTo = "/admin";
    }

    await signIn("credentials", {
      username,
      password,
      redirectTo
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}

export type OrderItemInput = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
};

export type OrderInput = {
  userId?: string;
  firstName: string;
  lastName: string;
  email: string;
  region: string;
  province: string;
  city: string;
  barangay: string;
  postalCode: string;
  streetAddress: string;
  total: number;
  items: OrderItemInput[];
};

export async function createOrder(data: OrderInput) {
  try {
    // Deduplicate items just in case (same Product ID and same Size)
    const uniqueItems: OrderItemInput[] = [];

    data.items.forEach((item) => {
      const existing = uniqueItems.find(
        (u) => u.productId === item.productId && (u.size || undefined) === (item.size || undefined)
      );

      if (existing) {
        existing.quantity += item.quantity;
      } else {
        uniqueItems.push({ ...item });
      }
    });

    const order = await db.order.create({
      data: {
        userId: data.userId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        region: data.region,
        province: data.province,
        city: data.city,
        barangay: data.barangay,
        postalCode: data.postalCode,
        streetAddress: data.streetAddress,
        total: data.total,
        items: {
          create: uniqueItems.map((item) => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            size: item.size
          }))
        }
      }
    });

    revalidatePath("/admin/orders");
    return { success: true, orderId: order.id };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to create order";
    console.error("Order creation failed:", error);
    return { success: false, error: errorMessage };
  }
}
