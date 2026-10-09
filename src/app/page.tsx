import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { FreeCoverSteps } from "@/components/sections/FreeCoverSteps";
import { Hero } from "@/components/sections/Hero";
import { MusicEnvironments } from "@/components/sections/MusicEnvironments";
import { RegistrationSection } from "@/components/sections/RegistrationSection";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <MusicEnvironments />
        <FreeCoverSteps />
        <RegistrationSection />
      </main>
      <Footer />
    </>
  );
}
