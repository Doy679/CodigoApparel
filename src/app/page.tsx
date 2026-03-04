import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import CultureSection from "@/components/CultureSection";
import LimitedDropCountdown from "@/components/LimitedDropCountdown";
import SocialProof from "@/components/SocialProof";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      
      <ProductGrid title="New Drops" />

      <CultureSection />

      <ProductGrid title="Best Sellers" />

      <SocialProof />
    </div>
  );
}
