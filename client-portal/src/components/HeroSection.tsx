import Link from "next/link";

export default function HeroSection() {
    return (
        <section className="relative w-full h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-white">
            {/* Background Image & Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://res.cloudinary.com/doujmzgn3/image/upload/v1788231654/gpt-image-2_A_cinematic_ultra-realistic_wide_hero_banner_for_a_luxury_e-commerce_website._A_-0_xv0ulc.jpg"
                    alt="Luxury Collection Banner"
                    className="w-full h-full object-cover object-center opacity-90"
                />
                {/* Gradient overlay to ensure text is perfectly readable against the background */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 px-6 lg:px-16 w-full flex flex-col items-start text-left">
                <span className="text-white text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-4 block">
                    Exclusive Luxury Collection 2026
                </span>
                
                <h1 className="text-white text-4xl md:text-6xl lg:text-[5rem] font-serif font-medium tracking-tight uppercase mb-6 leading-[1.1] max-w-3xl">
                    Elevate Your <br className="hidden md:block" /> Signature Style
                </h1>
                
                <p className="text-white text-sm md:text-base font-medium mb-10 leading-relaxed max-w-xl">
                    Discover our exclusive collection of luxury timepieces and signature fragrances crafted for the modern connoisseur.
                </p>
                
                <Link
                    href="/shop"
                    className="inline-flex items-center justify-center px-10 py-4 bg-white text-black text-xs font-black tracking-[0.2em] uppercase hover:bg-transparent hover:text-white transition-all duration-500 border border-white group"
                >
                    <span className="group-hover:scale-105 transition-transform duration-300">
                        Explore The Collection
                    </span>
                </Link>
            </div>
        </section>
    );
}