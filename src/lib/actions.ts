"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { Product } from "@/data/products";

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

// Product Actions

export async function getProductsAction() {
  try {
    const products = await db.product.findMany({
      orderBy: { createdAt: "desc" }
    });
    return { success: true, products };
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return { success: false, products: [], error: "Failed to fetch products" };
  }
}

export async function addProductAction(data: Partial<Product> & { id: string }) {
  try {
    const product = await db.product.create({
      data: {
        id: data.id,
        name: data.name!,
        price: data.price!,
        image: data.image!,
        category: data.category!,
        hoverImage: data.hoverImage || data.image,
        isNew: data.isNew ?? false,
        description: data.description!,
        details: data.details || [],
        additionalImages: data.additionalImages || [],
        stock: data.stock || 0,
        sizes: data.sizes || ["S", "M", "L", "XL"]
      }
    });

    revalidatePath("/admin/products");
    revalidatePath("/");
    revalidatePath("/product/[id]", "page");
    return { success: true, product };
  } catch (error) {
    console.error("Failed to add product:", error);
    return { success: false, error: "Failed to add product" };
  }
}

export async function updateProductAction(id: string, updates: Partial<Product>) {
  try {
    // Manually construct the data object to satisfy Prisma's strict typing
    const data: {
      name?: string;
      price?: number;
      image?: string;
      category?: string;
      hoverImage?: string;
      isNew?: boolean;
      description?: string;
      details?: string[];
      additionalImages?: string[];
      stock?: number;
      sizes?: string[];
    } = {};
    if (updates.name !== undefined) data.name = updates.name;
    if (updates.price !== undefined) data.price = updates.price;
    if (updates.image !== undefined) data.image = updates.image;
    if (updates.category !== undefined) data.category = updates.category;
    if (updates.hoverImage !== undefined) data.hoverImage = updates.hoverImage;
    if (updates.isNew !== undefined) data.isNew = updates.isNew;
    if (updates.description !== undefined) data.description = updates.description;
    if (updates.details !== undefined) data.details = updates.details;
    if (updates.additionalImages !== undefined) data.additionalImages = updates.additionalImages;
    if (updates.stock !== undefined) data.stock = updates.stock;
    if (updates.sizes !== undefined) data.sizes = updates.sizes;

    const product = await db.product.update({
      where: { id },
      data
    });

    revalidatePath("/admin/products");
    revalidatePath("/");
    revalidatePath(`/product/${id}`);
    return { success: true, product };
  } catch (error) {
    console.error("Failed to update product:", error);
    return { success: false, error: "Failed to update product" };
  }
}

export async function deleteProductAction(id: string) {
  try {
    await db.product.delete({
      where: { id }
    });

    revalidatePath("/admin/products");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete product:", error);
    return { success: false, error: "Failed to delete product" };
  }
}

export async function bulkUpdateStockAction(ids: string[], stock: number) {
  try {
    await db.product.updateMany({
      where: { id: { in: ids } },
      data: { stock }
    });

    revalidatePath("/admin/products");
    return { success: true };
  } catch (error) {
    console.error("Failed bulk stock update:", error);
    return { success: false, error: "Failed bulk stock update" };
  }
}

export async function bulkDeleteProductsAction(ids: string[]) {
  try {
    await db.product.deleteMany({
      where: { id: { in: ids } }
    });

    revalidatePath("/admin/products");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed bulk delete:", error);
    return { success: false, error: "Failed bulk delete" };
  }
}
