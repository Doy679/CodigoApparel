import Hero from "@/components/Hero";
import CollectionShowcase from "@/components/CollectionShowcase";
import ProductGrid from "@/components/ProductGrid";
import CultureSection from "@/components/CultureSection";
import TextMarquee from "@/components/TextMarquee";
import SocialProof from "@/components/SocialProof";
import SocialConnect from "@/components/SocialConnect";
import FadeInSection from "@/components/ui/FadeInSection";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />

      <FadeInSection>
        <CollectionShowcase />
      </FadeInSection>

      <ProductGrid title="New Drops" />

      <TextMarquee />

      <FadeInSection>
        <CultureSection />
      </FadeInSection>

      <ProductGrid title="Best Sellers" />

      <SocialConnect />

      <SocialProof />
    </div>
  );
}
