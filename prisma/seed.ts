import { PrismaClient } from "@prisma/client";
import { products } from "../src/data/products";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Delete existing products to avoid duplicates during dev
  await prisma.product.deleteMany();

  for (const product of products) {
    await prisma.product.create({
      data: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        hoverImage: product.hoverImage,
        isNew: product.isNew || false,
        description: product.description,
        details: product.details,
        additionalImages: product.additionalImages || [],
        stock: product.stock,
        sizes: product.sizes || []
      }
    });
  }

  console.log("Seeding finished.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
