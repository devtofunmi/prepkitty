
import Head from "next/head";
import {
  Header,
  Hero,
  Features,
  // Testimonials,
  // Pricing,
  Faq,
  CTA,
  Footer,
} from "../components/landingpage";

export default function Home() {
  return (
    <div className="bg-[var(--background)] text-[var(--foreground)] selection:bg-blue-100 bg-grain min-h-screen relative">
      <Head>
        <title>PrepKitty - Premium AI Interview Practice</title>
        <meta name="description" content="Master your next interview with high-fidelity AI simulations and professional behavioral analysis." />
      </Head>
      <Header />
      <main className="relative">
        <Hero />
        <Features />
        <Faq />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
