import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function setup() {
  try {
    console.log("Creating 'products' bucket...");
    await prisma.$executeRawUnsafe(`
      INSERT INTO storage.buckets (id, name, public)
      VALUES ('products', 'products', true)
      ON CONFLICT (id) DO NOTHING;
    `);

    console.log("Setting up public upload policy...");
    await prisma.$executeRawUnsafe(`
      CREATE POLICY "Allow public uploads"
      ON storage.objects FOR INSERT
      TO public
      WITH CHECK (bucket_id = 'products');
    `);

    console.log("Setting up public read policy...");
    await prisma.$executeRawUnsafe(`
      CREATE POLICY "Allow public read"
      ON storage.objects FOR SELECT
      TO public
      USING (bucket_id = 'products');
    `);

    console.log("Storage setup complete!");
  } catch (e: unknown) {
    // If policies already exist, it throws an error, which is fine
    const message = e instanceof Error ? e.message : String(e);
    console.log("Notice:", message);
  } finally {
    await prisma.$disconnect();
  }
}

setup();
