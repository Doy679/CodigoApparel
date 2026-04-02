import { NextResponse } from "next/server";
import { products as fallbackProducts } from "@/data/products";
import { db } from "@/lib/db";

export async function GET() {
  try {
    // Try to fetch from the actual PostgreSQL database
    const dbProducts = await db.product.findMany({
      orderBy: { createdAt: "desc" }
    });
    
    // If the database is connected but empty, or if we fetch them successfully
    if (dbProducts.length > 0) {
      return NextResponse.json(dbProducts);
    }
    
    // If the database is connected but no products exist yet (not seeded),
    // fallback to the static file to prevent breaking the UI
    return NextResponse.json(fallbackProducts);
    
  } catch (error) {
    console.error("Database connection failed, falling back to static products:", error);
    // If the user hasn't set up the DATABASE_URL yet, this will catch the error
    // and serve the static products instead of crashing the site.
    return NextResponse.json(fallbackProducts);
  }
}
