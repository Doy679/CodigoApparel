import { NextResponse } from "next/server";
import { products as fallbackProducts } from "@/data/products";
import { db } from "@/lib/db";

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(fallbackProducts, {
      headers: {
        "Cache-Control": "public, max-age=30, stale-while-revalidate=300"
      }
    });
  }

  try {
    const dbProducts = await Promise.race([
      db.product.findMany({
        orderBy: { createdAt: "desc" }
      }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Product query timed out")), 1500)
      )
    ]);

    return NextResponse.json(dbProducts.length > 0 ? dbProducts : fallbackProducts, {
      headers: {
        "Cache-Control": "public, max-age=30, stale-while-revalidate=300"
      }
    });
  } catch (error) {
    console.error("Database connection failed, falling back to static products:", error);
    return NextResponse.json(fallbackProducts);
  }
}
