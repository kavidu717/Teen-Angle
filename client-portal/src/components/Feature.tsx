import Link from "next/link";

export default function Feature() {
    return (
        <section className="w-full bg-white text-black flex flex-col-reverse md:flex-row items-stretch">
            
            {/* Left Side: Text Description */}
            <div className="w-full md:w-1/2 flex flex-col justify-center items-start text-left p-12 lg:p-24 xl:p-32">
                <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-black/40 mb-6">
                    Featured Craftsmanship
                </span>
                
                <h2 className="text-4xl lg:text-[4rem] font-serif font-medium tracking-tight uppercase leading-[1.1] mb-8">
                    The Heritage <br /> Oxford
                </h2>
                
                <p className="text-sm md:text-base font-medium text-black/70 leading-relaxed mb-10 max-w-lg">
                    Experience the absolute pinnacle of artisanal shoemaking. Handcrafted from the finest full-grain calf leather, this cinematic black oxford seamlessly blends timeless elegance with uncompromising comfort. 
                    <br /><br />
                    A true definitive staple for the modern gentleman's wardrobe, meticulously designed to age beautifully and tell a story with every step.
                </p>
                
                <Link
                    href="/shop"
                    className="inline-flex items-center space-x-4 border-b border-black pb-2 text-xs font-bold tracking-[0.2em] uppercase hover:text-black/50 hover:border-black/50 transition-colors group"
                >
                    <span>Discover The Collection</span>
                    <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
                </Link>
            </div>

            {/* Right Side: Image */}
            <div className="w-full md:w-1/2 aspect-[4/5] lg:aspect-square relative overflow-hidden bg-neutral-100">
                <img 
                    src="https://res.cloudinary.com/doujmzgn3/image/upload/v1788235651/lucid-origin_A_cinematic_ultra-realistic_macro_shot_of_a_single_high-end_black_leather_oxford-0_gvxs6b.jpg" 
                    alt="Premium Black Leather Oxford Shoe" 
                    className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-[1.5s] ease-out mix-blend-multiply"
                />
            </div>
            
        </section>
    );
}