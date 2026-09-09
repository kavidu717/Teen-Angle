"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { API } from "@/service/axios";

export default function CategoryTest() {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        API.get("/categories")
            .then((res) => {
                setCategories(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching categories:", err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <section className="w-full bg-white py-24 px-6 flex justify-center items-center">
                <span className="text-xs font-bold tracking-widest uppercase text-black/40 animate-pulse">
                    Loading Categories...
                </span>
            </section>
        );
    }

    if (categories.length === 0) return null;

    return (
        <section className="w-full bg-white text-black py-24 border-t border-black/5">
            <div className="text-center mb-16 flex flex-col items-center px-6">
                <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-black/40 mb-4 block">
                    Curated Selections
                </span>
                <h2 className="text-4xl md:text-5xl font-serif font-medium tracking-tight uppercase text-black">
                    Shop By Category
                </h2>
                <div className="w-12 h-px bg-black/20 mt-8"></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 w-full gap-2">
                {categories.map((cat) => (
                    <Link 
                        key={cat._id} 
                        href={`/shop?category=${cat._id}`}
                        className="group flex flex-col relative overflow-hidden bg-black"
                    >
                        <div className="w-full aspect-[4/5] relative flex items-center justify-center">
                            {cat.image ? (
                                <img 
                                    src={cat.image} 
                                    alt={cat.name} 
                                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-in-out opacity-80 group-hover:opacity-60"
                                />
                            ) : (
                                <span className="text-xs font-bold tracking-widest uppercase text-white/30 text-center px-4">
                                    No Image
                                </span>
                            )}
                            
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 transition-opacity duration-500"></div>
                            
                            <div className="absolute bottom-10 left-0 w-full flex flex-col items-center text-center space-y-3 z-10 px-4">
                                <h3 className="text-sm md:text-lg font-serif tracking-[0.15em] uppercase text-white">
                                    {cat.name}
                                </h3>
                                <span className="text-[10px] font-bold tracking-widest uppercase text-white/60 border-b border-transparent group-hover:border-white/60 transition-colors pb-1">
                                    Explore Collection
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}