import Link from "next/link";

export default function Footer() {
    return (
        <footer className="w-full text-black flex flex-col md:flex-row border-t border-black/10">
            {/* Left Side: Editorial Image */}
            <div className="w-full md:w-2/5 lg:w-1/3 h-80 md:h-auto relative overflow-hidden">
                <img 
                    src="https://res.cloudinary.com/doujmzgn3/image/upload/v1788231654/gpt-image-2_A_cinematic_ultra-realistic_wide_hero_banner_for_a_luxury_e-commerce_website._A_-0_xv0ulc.jpg" 
                    alt="Teen-Angle Collection" 
                    className="w-full h-full object-cover object-center opacity-80 mix-blend-luminosity"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent flex items-end p-12">
                    <span className="text-white text-3xl font-serif font-medium tracking-[0.1em] uppercase">
                        Teen-Angle.
                    </span>
                </div>
            </div>

            {/* Right Side: Links & Content */}
            <div className="w-full md:w-3/5 lg:w-2/3 p-12 lg:p-24 flex flex-col justify-between bg-[#f8f8f8]">
                
                {/* Newsletter Subscribe */}
                <div className="mb-20">
                    <h4 className="text-[10px] font-bold tracking-[0.3em] uppercase mb-4 text-black/40">The Newsletter</h4>
                    <p className="text-xs md:text-sm text-black/80 font-medium mb-6 max-w-md leading-relaxed">
                        Sign up to receive exclusive access to limited collections, new releases, and curated editorials.
                    </p>
                    <form className="flex w-full max-w-md border-b border-black/20 pb-3 group focus-within:border-black transition-colors">
                        <input 
                            type="email" 
                            placeholder="Email address" 
                            className="bg-transparent border-none outline-none text-sm text-black w-full placeholder-black/30 font-medium tracking-wide"
                        />
                        <button type="button" className="text-[10px] font-bold tracking-[0.3em] uppercase hover:text-black/60 transition-colors pl-4">
                            Subscribe
                        </button>
                    </form>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 mb-24">
                    {/* Navigation */}
                    <div>
                        <h4 className="text-[10px] font-bold tracking-[0.3em] uppercase mb-8 text-black/40">Explore</h4>
                        <ul className="space-y-5">
                            <li><Link href="/" className="text-sm font-medium tracking-wide hover:text-black/60 transition-colors">Home</Link></li>
                            <li><Link href="/about" className="text-sm font-medium tracking-wide hover:text-black/60 transition-colors">About Us</Link></li>
                            <li><Link href="/shop" className="text-sm font-medium tracking-wide hover:text-black/60 transition-colors">Shop Collection</Link></li>
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h4 className="text-[10px] font-bold tracking-[0.3em] uppercase mb-8 text-black/40">Policies</h4>
                        <ul className="space-y-5">
                            <li><Link href="/privacy-policy" className="text-sm font-medium tracking-wide hover:text-black/60 transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="text-sm font-medium tracking-wide hover:text-black/60 transition-colors">Terms & Conditions</Link></li>
                            <li><Link href="/refunds" className="text-sm font-medium tracking-wide hover:text-black/60 transition-colors">Refunds & Cancellations</Link></li>
                            <li><Link href="/shipping" className="text-sm font-medium tracking-wide hover:text-black/60 transition-colors">Shipping & Delivery</Link></li>
                        </ul>
                    </div>

                    {/* Additional Links or Info */}
                    <div>
                        <h4 className="text-[10px] font-bold tracking-[0.3em] uppercase mb-8 text-black/40">Client Care</h4>
                        <ul className="space-y-5">
                            <li><a href="tel:0773005419" className="text-sm font-medium tracking-wide hover:text-black/60 transition-colors">Call: 0773005419</a></li>
                            <li><Link href="/contact" className="text-sm font-medium tracking-wide hover:text-black/60 transition-colors">Contact Us</Link></li>
                            <li><Link href="/faq" className="text-sm font-medium tracking-wide hover:text-black/60 transition-colors">FAQ</Link></li>
                            <li><Link href="/track-order" className="text-sm font-medium tracking-wide hover:text-black/60 transition-colors">Track Order</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-black/10 pt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <p className="text-[10px] text-black/40 font-bold uppercase tracking-[0.2em]">
                        &copy; {new Date().getFullYear()} Teen-Angle. All rights reserved.
                    </p>
                    <p className="text-[10px] text-black/40 font-bold uppercase tracking-[0.2em]">
                        Design by Kavidu Duchmantha
                    </p>
                </div>
            </div>
        </footer>
    );
}
