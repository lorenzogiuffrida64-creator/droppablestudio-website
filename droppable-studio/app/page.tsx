import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Manifesto from "@/components/Manifesto";
import WorkGrid from "@/components/WorkGrid";
import WhyLedger from "@/components/WhyLedger";
// import Testimonials from "@/components/Testimonials"; // hidden for now
import InquiryCta from "@/components/InquiryCta";
import Academy from "@/components/Academy";
import Footer from "@/components/Footer";
import Reveals from "@/components/Reveals";

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <Marquee />
      <Manifesto />

      {/* dark band: work + why AI */}
      <div className="dark">
        <WorkGrid />
        <WhyLedger />
        {/* <Testimonials /> hidden for now */}
      </div>

      <InquiryCta />
      <Academy />
      <Footer />
      <Reveals />
    </>
  );
}
