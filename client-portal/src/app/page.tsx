import HeroSection from "@/components/HeroSection";
import Link from "next/link";
import { Truck, ShieldCheck, HeadphonesIcon } from "lucide-react";


export default function HomePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Hero Section */}
      <HeroSection />

      {/* Features Highlights */}
      <section className="bg-neutral-50 text-black py-20 px-6 lg:px-16 flex flex-col md:flex-row justify-center items-center gap-12 lg:gap-24">

        <div className="flex flex-col items-center text-center space-y-5 max-w-xs group cursor-default">
          <Truck className="w-10 h-10 text-black/40 group-hover:text-black transition-colors duration-300" strokeWidth={1.2} />
          <div className="space-y-2">
            <h3 className="text-xs font-bold tracking-[0.2em] uppercase">Islandwide Fast Delivery</h3>
            <p className="text-[10px] font-bold tracking-[0.1em] uppercase text-black/50">Secure shipping to your doorstep</p>
          </div>
        </div>

        <div className="w-px h-16 bg-black/10 hidden md:block"></div>

        <div className="flex flex-col items-center text-center space-y-5 max-w-xs group cursor-default">
          <ShieldCheck className="w-10 h-10 text-black/40 group-hover:text-black transition-colors duration-300" strokeWidth={1.2} />
          <div className="space-y-2">
            <h3 className="text-xs font-bold tracking-[0.2em] uppercase">100% Genuine Products</h3>
            <p className="text-[10px] font-bold tracking-[0.1em] uppercase text-black/50">Authentic luxury guaranteed</p>
          </div>
        </div>

        <div className="w-px h-16 bg-black/10 hidden md:block"></div>

        <div className="flex flex-col items-center text-center space-y-5 max-w-xs group cursor-default">
          <HeadphonesIcon className="w-10 h-10 text-black/40 group-hover:text-black transition-colors duration-300" strokeWidth={1.2} />
          <div className="space-y-2">
            <h3 className="text-xs font-bold tracking-[0.2em] uppercase">Dedicated Support</h3>
            <p className="text-[10px] font-bold tracking-[0.1em] uppercase text-black/50">24/7 customer assistance</p>
          </div>
        </div>

      </section>

    </div>
  );
}