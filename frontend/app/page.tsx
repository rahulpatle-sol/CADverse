import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import FormatsBar from "@/components/landing/FormatsBar";
import Playground from "@/components/landing/Playground";
import Pipeline from "@/components/landing/Pipeline";
import Features from "@/components/landing/Features";
import Pricing from "@/components/landing/Pricing";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-obsidian-950 text-white">
      <Navbar />
      <main>
        <Hero />
        <FormatsBar />
        <Playground />
        <Pipeline />
        <Features />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
}
