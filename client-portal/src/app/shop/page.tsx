"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Filter } from "lucide-react";
import { API } from "@/service/axios";

function ShopContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // States
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [availableFilters, setAvailableFilters] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);

    const currentCategory = searchParams.get("category") || "";
    const currentPage = Number(searchParams.get("page")) || 1;

    // 1. Fetch Categories
    useEffect(() => {
        API.get("/categories")
            .then((res) => setCategories(res.data))
            .catch((err) => console.error("Error fetching categories:", err));
    }, []);

    // 2. Extract Dynamic Filters from the existing getAllProducts API
    useEffect(() => {
        if (currentCategory) {
            API.get(`/products?category=${currentCategory}&limit=500`)
                .then((res) => {
                    const allProducts = res.data.products;
                    const filters: Record<string, Set<string>> = {};

                    allProducts.forEach((product: any) => {
                        if (product.generalAttributes) {
                            Object.keys(product.generalAttributes).forEach((key) => {
                                if (!filters[key]) filters[key] = new Set();
                                filters[key].add(product.generalAttributes[key]);
                            });
                        }

                        if (product.variants && product.variants.length > 0) {
                            product.variants.forEach((variant: any) => {
                                if (variant.attributes) {
                                    Object.keys(variant.attributes).forEach((key) => {
                                        if (!filters[key]) filters[key] = new Set();
                                        filters[key].add(variant.attributes[key]);
                                    });
                                }
                            });
                        }
                    });

                    const formattedFilters: Record<string, string[]> = {};
                    Object.keys(filters).forEach((key) => {
                        formattedFilters[key] = Array.from(filters[key]);
                    });

                    setAvailableFilters(formattedFilters);
                })
                .catch((err) => console.error("Error extracting filters:", err));
        } else {
            setAvailableFilters({});
        }
    }, [currentCategory]);

    // 3. Fetch Paginated & Filtered Products
    useEffect(() => {
        setLoading(true);
        API.get(`/products?${searchParams.toString()}`)
            .then((res) => {
                setProducts(res.data.products);
                setTotalPages(res.data.pages);
                setTotalProducts(res.data.total);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching products:", err);
                setLoading(false);
            });
    }, [searchParams]);

    // Query Update Helper
    const updateQueryParam = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        if (key !== "page") params.set("page", "1");

        router.push(`/shop?${params.toString()}`);
    };

    return (
        <div className="min-h-screen bg-white text-black">
            <div className="border-b border-black/10 py-12 px-6 lg:px-16 text-center">
                <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">The Collection</h1>
                <p className="text-xs font-bold tracking-[0.2em] uppercase text-black/55">
                    Explore our exclusive catalog of luxury timepieces and fragrances.
                </p>
            </div>

            <div className="w-full px-6 lg:px-16 py-12 flex flex-col lg:flex-row gap-12">

                {/* LEFT SIDE: Filter Sidebar */}
                <aside className="w-full lg:w-72 flex-shrink-0 space-y-8">
                    <div className="flex items-center justify-between border-b border-black/10 pb-4">
                        <h2 className="text-sm font-black tracking-[0.2em] uppercase flex items-center gap-2">
                            <Filter className="w-4 h-4" /> Filters
                        </h2>
                        {searchParams.toString() && (
                            <button
                                onClick={() => router.push("/shop")}
                                className="text-[10px] font-bold tracking-widest uppercase text-black/50 hover:text-black underline"
                            >
                                Reset All
                            </button>
                        )}
                    </div>

                    {/* Categories Filter */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold tracking-[0.15em] uppercase text-black/70">Categories</h3>
                        <ul className="space-y-2">
                            <li>
                                <button
                                    onClick={() => updateQueryParam("category", "")}
                                    className={`text-xs tracking-widest uppercase transition-colors ${!currentCategory ? "font-black text-black underline underline-offset-4" : "text-black/60 hover:text-black"
                                        }`}
                                >
                                    All Categories
                                </button>
                            </li>
                            {categories.map((cat) => (
                                <li key={cat._id}>
                                    <button
                                        onClick={() => updateQueryParam("category", cat._id)}
                                        className={`text-xs tracking-widest uppercase transition-colors ${currentCategory === cat._id ? "font-black text-black underline underline-offset-4" : "text-black/60 hover:text-black"
                                            }`}
                                    >
                                        {cat.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Static Price Range Filter */}
                    <div className="space-y-4 pt-4 border-t border-black/10">
                        <h3 className="text-xs font-bold tracking-[0.15em] uppercase text-black/70">Price Range</h3>
                        <div className="flex flex-col gap-2 items-start">
                            {[
                                { label: "Under $100", value: "0-100" },
                                { label: "$100 - $500", value: "100-500" },
                                { label: "Over $500", value: "500-" }
                            ].map((range) => {
                                const isSelected = searchParams.get("priceRange") === range.value;
                                return (
                                    <button
                                        key={range.label}
                                        onClick={() => updateQueryParam("priceRange", isSelected ? "" : range.value)}
                                        className={`text-left text-xs tracking-widest uppercase transition-colors ${isSelected ? "font-black text-black underline underline-offset-4" : "text-black/60 hover:text-black"
                                            }`}
                                    >
                                        {range.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Dynamic Database Attributes */}
                    {Object.keys(availableFilters).map((filterKey) => (
                        <div key={filterKey} className="space-y-4 pt-4 border-t border-black/10">
                            <h3 className="text-xs font-bold tracking-[0.15em] uppercase text-black/70">{filterKey}</h3>
                            <div className="flex flex-wrap gap-2">
                                {availableFilters[filterKey].map((val: string) => {
                                    const isSelected = searchParams.get(filterKey) === val;
                                    return (
                                        <button
                                            key={val}
                                            onClick={() => updateQueryParam(filterKey, isSelected ? "" : val)}
                                            className={`px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase border transition-all ${isSelected
                                                    ? "bg-black text-white border-black"
                                                    : "bg-white text-black border-black/20 hover:border-black"
                                                }`}
                                        >
                                            {val}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </aside>

                {/* RIGHT SIDE: Products Grid & Pagination */}
                <main className="flex-1 space-y-8">
                    <div className="flex justify-between items-center text-xs tracking-widest uppercase text-black/60 border-b border-black/10 pb-4">
                        <span>Showing {products.length} of {totalProducts} Products</span>
                    </div>

                    {loading ? (
                        <div className="h-96 flex items-center justify-center text-xs tracking-widest uppercase text-black/40 animate-pulse">
                            Loading Collection...
                        </div>
                    ) : products.length === 0 ? (
                        <div className="h-96 flex flex-col items-center justify-center space-y-4 text-center">
                            <p className="text-sm font-bold tracking-widest uppercase text-black/60">No products found matching your criteria.</p>
                            <button
                                onClick={() => router.push("/shop")}
                                className="px-6 py-3 bg-black text-white text-xs font-bold tracking-widest uppercase"
                            >
                                Clear Filters
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {products.map((product) => (
                                <Link
                                    key={product._id}
                                    href={`/shop/${product._id}`}
                                    className="group flex flex-col space-y-3"
                                >
                                    <div className="aspect-[3/4] bg-neutral-100 relative overflow-hidden flex items-center justify-center border border-black/5">
                                        {product.images && product.images[0] ? (
                                            <img
                                                src={product.images[0]}
                                                alt={product.name}
                                                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <span className="text-[10px] font-bold tracking-widest uppercase text-black/30">No Image</span>
                                        )}
                                    </div>

                                    <div className="space-y-1">
                                        <h3 className="text-xs font-bold tracking-widest uppercase group-hover:underline">{product.name}</h3>
                                        <p className="text-xs font-black tracking-wider">${product.basePrice.toFixed(2)}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center space-x-2 pt-12 border-t border-black/10">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                <button
                                    key={p}
                                    onClick={() => updateQueryParam("page", p.toString())}
                                    className={`w-10 h-10 text-xs font-bold tracking-widest border transition-all ${currentPage === p
                                            ? "bg-black text-white border-black"
                                            : "bg-white text-black border-black/20 hover:border-black"
                                        }`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default function ShopPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xs tracking-widest uppercase">Loading...</div>}>
            <ShopContent />
        </Suspense>
    );
}