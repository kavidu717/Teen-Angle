
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { API } from "@/service/axios";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";

interface ProductVariant {
    attributes: {
        Volume?: string;
        [key: string]: string | undefined;
    };
    price: number;
    sku: string;
    stock: number;
}

interface Product {
    _id: string;
    name: string;
    description: string;
    basePrice: number;
    images: string[];
    variants: ProductVariant[];
    category: {
        _id: string;
        name: string;
    };
}

export default function ProductDetailPage() {
    const params = useParams();
    const id = params?.id;

    const [product, setProduct] = useState<Product | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [selectedVariant, setSelectedVariant] =
        useState<ProductVariant | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchProductDetails = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await API.get(`/products/${id}`);

                const productData: Product = response.data.product;

                setProduct(productData);
                setRelatedProducts(response.data.relatedProducts || []);
                setSelectedVariant(productData.variants?.[0] || null);
                setSelectedImage(productData.images?.[0] || null);
            } catch (err: unknown) {
                if (axios.isAxiosError(err)) {
                    setError(
                        err.response?.data?.message ||
                        "Failed to load product details."
                    );
                } else {
                    setError("An unexpected error occurred.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [id]);

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-black"></div>
                    <p className="animate-pulse font-medium text-gray-600">
                        Loading product details...
                    </p>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
                <div className="bg-red-100 p-4">
                    <svg
                        className="h-8 w-8 text-red-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                </div>
                <p className="text-lg font-medium text-gray-900">
                    {error || "Product not found."}
                </p>
                <Link
                    href="/shop"
                    className="text-sm font-semibold text-black hover:underline"
                >
                    &larr; Back to Shop
                </Link>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <Link
                href="/shop"
                className="mb-8 inline-flex items-center text-sm font-semibold text-gray-500 transition-colors hover:text-black"
            >
                &larr; Back to Shop
            </Link>
            <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-14">
                {/* Image Gallery */}
                <div className="flex flex-col-reverse lg:sticky lg:top-24">
                    {/* Image Selector */}
                    {product.images?.length > 0 && (
                        <div className="mx-auto mt-6 w-full max-w-2xl lg:max-w-none">
                            <div className="grid grid-cols-4 gap-4">
                                {product.images.map((image, index) => (
                                    <button
                                        key={`${image}-${index}`}
                                        type="button"
                                        onClick={() => setSelectedImage(image)}
                                        className={`relative flex h-24 cursor-pointer items-center justify-center bg-white text-sm font-medium uppercase transition-all duration-200 hover:bg-gray-50 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-offset-4 ${
                                            selectedImage === image
                                                ? "ring-2 ring-black ring-offset-2"
                                                : "ring-transparent"
                                        }`}
                                    >
                                        <span className="sr-only">{`Image ${index + 1}`}</span>
                                        <span className="absolute inset-0 overflow-hidden bg-gray-100">
                                            <Image
                                                src={image}
                                                alt={`${product.name} ${index + 1}`}
                                                fill
                                                className="object-cover object-center"
                                            />
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Main Image */}
                    <div className="relative aspect-[1/1] w-full overflow-hidden bg-gray-100 shadow-sm sm:aspect-[4/5]">
                        {selectedImage ? (
                            <Image
                                src={selectedImage}
                                alt={product.name}
                                fill
                                priority
                                className="h-full w-full object-cover object-center"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-gray-400">
                                No Image Available
                            </div>
                        )}
                    </div>
                </div>

                {/* Product Info */}
                <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
                    <div className="mb-4 flex items-center justify-between">
                        <span className="inline-flex items-center bg-gray-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gray-800 shadow-sm">
                            {product.category?.name}
                        </span>
                    </div>

                    <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
                        {product.name}
                    </h1>

                    <div className="mt-4">
                        <h2 className="sr-only">Product information</h2>
                        {selectedVariant ? (
                            <p className="text-3xl font-bold tracking-tight text-gray-900">
                                <span className="mr-1 text-2xl font-medium text-gray-500">
                                    Rs.
                                </span>
                                {selectedVariant.price.toLocaleString()}
                            </p>
                        ) : (
                            <p className="text-3xl font-bold tracking-tight text-gray-900">
                                <span className="mr-1 text-2xl font-medium text-gray-500">
                                    Rs.
                                </span>
                                {product.basePrice?.toLocaleString() || "0"}
                            </p>
                        )}
                    </div>

                    <div className="mt-6">
                        <h3 className="sr-only">Description</h3>
                        <div className="space-y-6 text-base leading-7 text-gray-600">
                            <p>{product.description}</p>
                        </div>
                    </div>

                    {/* Variants */}
                    {product.variants?.length > 0 && (
                        <div className="mt-8 border-t border-gray-200 pt-8">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-gray-900">
                                    Select Volume
                                </h3>
                            </div>
                            <div className="mt-4 flex flex-wrap gap-3">
                                {product.variants.map((variant) => {
                                    const isSelected =
                                        selectedVariant?.sku === variant.sku;
                                    return (
                                        <button
                                            key={variant.sku}
                                            type="button"
                                            onClick={() =>
                                                setSelectedVariant(variant)
                                            }
                                            className={`group relative flex items-center justify-center border px-6 py-3 text-sm font-semibold uppercase transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 ${
                                                isSelected
                                                    ? "border-transparent bg-black text-white shadow-md hover:bg-gray-800"
                                                    : "border-gray-200 bg-white text-gray-900 shadow-sm hover:border-gray-300 hover:bg-gray-50"
                                            }`}
                                        >
                                            <span>
                                                {variant.attributes.Volume ||
                                                    "Default"}
                                            </span>
                                            {/* Beautiful active indicator */}
                                            {isSelected && (
                                                <span
                                                    className="absolute -inset-px border-2 border-black"
                                                    aria-hidden="true"
                                                />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Action Area */}
                    <div className="mt-10 flex flex-col gap-4">
                        {selectedVariant && (
                            <div className="flex items-center space-x-2 text-sm font-medium">
                                <span className="relative flex h-3 w-3">
                                    {selectedVariant.stock > 0 ? (
                                        <>
                                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                                            <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
                                        </>
                                    ) : (
                                        <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500"></span>
                                    )}
                                </span>
                                <span
                                    className={
                                        selectedVariant.stock > 0
                                            ? "text-green-700"
                                            : "text-red-700"
                                    }
                                >
                                    {selectedVariant.stock > 0
                                        ? `${selectedVariant.stock} in stock - Ready to ship`
                                        : "Currently out of stock"}
                                </span>
                            </div>
                        )}

                        <button
                            type="button"
                            disabled={selectedVariant?.stock === 0}
                            onClick={() => alert("Added to cart!")}
                            className="flex w-full items-center justify-center bg-black px-8 py-5 text-base font-bold text-white transition-all duration-200 hover:bg-gray-800 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none active:scale-[0.98]"
                        >
                            {selectedVariant?.stock === 0 ? (
                                "Out of Stock"
                            ) : (
                                <>
                                    <svg
                                        className="mr-2 h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                        />
                                    </svg>
                                    Add to Cart
                                </>
                            )}
                        </button>

                        {/* Free shipping banner */}
                        <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-500">
                            <svg
                                className="h-5 w-5 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                                />
                            </svg>
                            <span>Free shipping on orders over Rs. 5,000</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Related Products Section */}
            {relatedProducts.length > 0 && (
                <div className="mt-24 border-t border-gray-200 pt-16 sm:mt-32 sm:pt-24">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
                            You May Also Like
                        </h2>
                        <Link
                            href="/shop"
                            className="hidden text-sm font-semibold text-black hover:text-gray-600 sm:block"
                        >
                            Shop the collection{" "}
                            <span aria-hidden="true"> &rarr;</span>
                        </Link>
                    </div>

                    <div className="mt-8 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
                        {relatedProducts.map((item) => {
                            const firstVariant = item.variants?.[0];

                            return (
                                <Link
                                    href={`/product/${item._id}`}
                                    key={item._id}
                                    className="group block"
                                >
                                    <div className="relative h-72 w-full overflow-hidden bg-gray-100 shadow-sm transition-all duration-300 group-hover:shadow-md sm:h-80">
                                        {item.images?.[0] ? (
                                            <Image
                                                src={item.images[0]}
                                                alt={item.name}
                                                fill
                                                className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-gray-400">
                                                No Image
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black bg-opacity-0 transition-opacity duration-300 group-hover:bg-opacity-10" />
                                    </div>

                                    <div className="mt-4 flex flex-col gap-1">
                                        <h3 className="text-sm font-medium text-gray-900 group-hover:text-black">
                                            {item.name}
                                        </h3>
                                        {item.category?.name && (
                                            <p className="text-sm text-gray-500">
                                                {item.category.name}
                                            </p>
                                        )}

                                        {firstVariant && (
                                            <p className="mt-2 text-base font-bold text-gray-900">
                                                Rs.{" "}
                                                {firstVariant.price.toLocaleString()}
                                            </p>
                                        )}
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

