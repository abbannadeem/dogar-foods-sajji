import Hero from "@/components/Hero";
import CategoryStrip from "@/components/CategoryStrip";
import FeaturedItems from "@/components/FeaturedItems";
import BranchCards from "@/components/BranchCards";
import Testimonials from "@/components/Testimonials";
import CTABanner from "@/components/CTABanner";

export default function Home() {
  return (
    <>
      <Hero />
      <CategoryStrip />
      <FeaturedItems />
      <BranchCards />
      <Testimonials />
      <CTABanner />
    </>
  );
}
