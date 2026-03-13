import Hero from "@/components/Hero";
import CollectionShowcase from "@/components/CollectionShowcase";
import ProductGrid from "@/components/ProductGrid";
import CultureSection from "@/components/CultureSection";
import TextMarquee from "@/components/TextMarquee";
import SocialProof from "@/components/SocialProof";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      
      <CollectionShowcase />
      
      <ProductGrid title="New Drops" />

      <TextMarquee />

      <CultureSection />

      <ProductGrid title="Best Sellers" />

      <SocialProof />
    </div>
  );
}
