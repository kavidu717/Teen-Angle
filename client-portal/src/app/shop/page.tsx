"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Filter, ChevronDown, X, SlidersHorizontal, Check } from "lucide-react";
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

    // UI States
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
    
    const currentCategory = searchParams.get("category") || "";
    const currentPage = Number(searchParams.get("page")) || 1;

    // 1. Fetch Categories
    useEffect(() => {
        API.get("/categories")
            .then((res) => setCategories(res.data))
            .catch((err) => console.error("Error fetching categories:", err));
    }, []);

    // 2. Extract Dynamic Filters
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

    const currentCategoryName = currentCategory 
        ? categories.find(c => c._id === currentCategory)?.name || "Category"
        : "All Categories";

    // Reusable Filter Component
    const FilterSidebar = () => (
        <div className="space-y-10">
            <div className="flex items-center justify-between border-b border-black pb-4">
                <h2 className="text-sm font-bold tracking-[0.2em] uppercase flex items-center gap-3">
                    <SlidersHorizontal className="w-4 h-4" /> Filters
                </h2>
                {searchParams.toString() && (
                    <button
                        onClick={() => router.push("/shop")}
                        className="text-[10px] font-bold tracking-widest uppercase text-black/50 hover:text-black transition-colors"
                    >
                        Clear All
                    </button>
                )}
            </div>

            {/* Categories Dropdown */}
            <div className="space-y-4 relative">
                <h3 className="text-xs font-bold tracking-[0.15em] uppercase text-black/60">Category</h3>
                <button 
                    onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 border border-black/20 hover:border-black transition-colors bg-white text-xs font-bold tracking-widest uppercase"
                >
                    <span>{currentCategoryName}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isCategoryDropdownOpen ? "rotate-180" : ""}`} />
                </button>
                
                {isCategoryDropdownOpen && (
                    <div className="absolute top-full left-0 w-full mt-2 bg-white border border-black/10 shadow-xl z-20 flex flex-col max-h-60 overflow-y-auto">
                        <button
                            onClick={() => { updateQueryParam("category", ""); setIsCategoryDropdownOpen(false); }}
                            className={`text-left px-4 py-3 text-xs tracking-widest uppercase hover:bg-black hover:text-white transition-colors ${!currentCategory ? "bg-black/5 font-black" : ""}`}
                        >
                            All Categories
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat._id}
                                onClick={() => { updateQueryParam("category", cat._id); setIsCategoryDropdownOpen(false); }}
                                className={`text-left px-4 py-3 text-xs tracking-widest uppercase hover:bg-black hover:text-white transition-colors ${currentCategory === cat._id ? "bg-black/5 font-black" : ""}`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Static Price Range Filter */}
            <div className="space-y-4">
                <h3 className="text-xs font-bold tracking-[0.15em] uppercase text-black/60">Price Range</h3>
                <div className="flex flex-col gap-3">
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
                                className="group flex items-center gap-3 text-left"
                            >
                                <div className={`w-4 h-4 border flex items-center justify-center transition-colors ${isSelected ? 'border-black bg-black' : 'border-black/30 group-hover:border-black'}`}>
                                    {isSelected && <Check className="w-3 h-3 text-white" />}
                                </div>
                                <span className={`text-xs tracking-widest uppercase transition-colors ${isSelected ? 'font-bold text-black' : 'text-black/60 group-hover:text-black'}`}>
                                    {range.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Dynamic Database Attributes */}
            {Object.keys(availableFilters).map((filterKey) => (
                <div key={filterKey} className="space-y-4">
                    <h3 className="text-xs font-bold tracking-[0.15em] uppercase text-black/60">{filterKey}</h3>
                    <div className="flex flex-wrap gap-2">
                        {availableFilters[filterKey].map((val: string) => {
                            const isSelected = searchParams.get(filterKey) === val;
                            return (
                                <button
                                    key={val}
                                    onClick={() => updateQueryParam(filterKey, isSelected ? "" : val)}
                                    className={`px-4 py-2 text-[10px] font-bold tracking-widest uppercase border transition-all ${isSelected
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
        </div>
    );

    return (
        <div className="min-h-screen bg-white text-black">
            {/* Elegant Header */}
            <div className="border-b border-black/10 py-16 px-6 lg:px-16 text-center bg-black/5">
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-4">The Collection</h1>
                <p className="text-xs font-bold tracking-[0.2em] uppercase text-black/50 max-w-xl mx-auto leading-relaxed">
                    Explore our exclusive catalog of luxury timepieces and fragrances, curated for the modern aesthetic.
                </p>
            </div>

            <div className="w-full px-6 lg:px-16 py-12 flex flex-col lg:flex-row gap-12 lg:gap-16">
                
                {/* Mobile Filter Trigger */}
                <div className="lg:hidden flex justify-end mb-4">
                    <button 
                        onClick={() => setIsMobileFilterOpen(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-black text-white text-xs font-bold tracking-widest uppercase hover:bg-black/80 transition-colors"
                    >
                        <Filter className="w-4 h-4" />
                        Filter & Sort
                    </button>
                </div>

                {/* LEFT SIDE: Desktop Filter Sidebar */}
                <aside className="hidden lg:block w-72 flex-shrink-0 sticky top-28 self-start h-[calc(100vh-7rem)] overflow-y-auto pb-12">
                    <FilterSidebar />
                </aside>

                {/* Mobile Filter Drawer */}
                <div 
                    className={`fixed inset-0 bg-black/60 z-50 transition-opacity duration-300 lg:hidden ${isMobileFilterOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                    onClick={() => setIsMobileFilterOpen(false)}
                ></div>
                <div 
                    className={`fixed inset-y-0 right-0 z-50 w-[85%] max-w-md bg-white flex flex-col transition-transform duration-500 ease-in-out lg:hidden ${isMobileFilterOpen ? "translate-x-0" : "translate-x-full"}`}
                >
                    <div className="px-6 h-20 flex items-center justify-between border-b border-black/10">
                        <span className="text-sm font-black tracking-[0.2em] uppercase">
                            Filters
                        </span>
                        <button onClick={() => setIsMobileFilterOpen(false)} className="text-black/50 hover:text-black transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6">
                        <FilterSidebar />
                    </div>
                    <div className="p-6 border-t border-black/10">
                        <button 
                            onClick={() => setIsMobileFilterOpen(false)}
                            className="w-full py-4 bg-black text-white text-xs font-bold tracking-[0.2em] uppercase hover:bg-black/90 transition-colors"
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>

                {/* RIGHT SIDE: Products Grid & Pagination */}
                <main className="flex-1 space-y-8">
                    <div className="hidden lg:flex justify-between items-center text-[10px] font-bold tracking-[0.2em] uppercase text-black/50 border-b border-black/10 pb-4">
                        <span>Showing {products.length} of {totalProducts} Products</span>
                        <span>Luxury Collection</span>
                    </div>

                    {loading ? (
                        <div className="h-96 flex items-center justify-center text-xs font-bold tracking-widest uppercase text-black/40 animate-pulse">
                            Loading Collection...
                        </div>
                    ) : products.length === 0 ? (
                        <div className="h-96 flex flex-col items-center justify-center space-y-6 text-center">
                            <p className="text-xs font-bold tracking-widest uppercase text-black/50">No pieces found matching your criteria.</p>
                            <button
                                onClick={() => router.push("/shop")}
                                className="px-8 py-3 border border-black text-xs font-bold tracking-[0.2em] uppercase hover:bg-black hover:text-white transition-all"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 lg:gap-x-8 lg:gap-y-12">
                            {products.map((product) => (
                                <Link
                                    key={product._id}
                                    href={`/shop/${product._id}`}
                                    className="group flex flex-col space-y-4"
                                >
                                    <div className="aspect-[3/4] bg-black/5 relative overflow-hidden flex items-center justify-center">
                                        {product.images && product.images[0] ? (
                                            <img
                                                src={product.images[0]}
                                                alt={product.name}
                                                className="object-cover w-full h-full mix-blend-multiply group-hover:scale-105 transition-transform duration-700 ease-in-out"
                                            />
                                        ) : (
                                            <span className="text-[10px] font-bold tracking-widest uppercase text-black/30">No Image</span>
                                        )}
                                        
                                        {/* Hover Overlay */}
                                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    </div>

                                    <div className="flex flex-col items-center text-center space-y-2">
                                        <h3 className="text-[11px] font-bold tracking-[0.15em] uppercase text-black/70 group-hover:text-black transition-colors">{product.name}</h3>
                                        <p className="text-sm font-black tracking-widest">${product.basePrice.toFixed(2)}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center space-x-2 pt-16 border-t border-black/10 mt-16">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                <button
                                    key={p}
                                    onClick={() => {
                                        updateQueryParam("page", p.toString());
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className={`w-10 h-10 flex items-center justify-center text-xs font-bold tracking-widest border transition-all ${currentPage === p
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
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xs tracking-widest uppercase font-bold">Loading...</div>}>
            <ShopContent />
        </Suspense>
    );
}