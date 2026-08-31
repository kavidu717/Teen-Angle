"use client";

import { useEffect, useState } from "react";
import { api } from "@/service/api";
import { toast } from "sonner";
import { Plus, Package, Search, Eye, X } from "lucide-react";
import Link from "next/link";
import axios from "axios";

interface VariantType {
  sku: string;
  price: number;
  stock: number;
  attributes: Record<string, unknown>;
}

interface ProductType {
  _id: string;
  name: string;
  description: string;
  basePrice: number;
  images: string[];
  category: {
    _id: string;
    name: string;
    image: string;
  };
  generalAttributes: Record<string, unknown>;
  variants: VariantType[];
}

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  
  // Modal State
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);

  async function fetchProducts() {
    try {
      setIsLoading(true);
      const response = await api.get("/products", {
        params: { keyword: keyword || undefined },
      });
      setProducts(response.data.products);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to fetch products.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 0);
    return () => clearTimeout(timer);
  }, [keyword]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Product Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your store inventory, variants, and pricing.
          </p>
        </div>
        <Link
          href="/dashboard/products/new"
          className="flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-yellow-500 text-slate-950 font-semibold hover:bg-yellow-400 transition-colors shadow-sm text-sm"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Product</span>
        </Link>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search products by name or description..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-yellow-500"
          />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex justify-center items-center">
            <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center text-slate-500 font-medium">
            No products found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                  <th className="px-6 py-4">Image</th>
                  <th className="px-6 py-4">Product Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Base Price</th>
                  <th className="px-6 py-4">Variants</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {products.map((prod) => (
                  <tr key={prod._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-200 relative bg-slate-100 flex-shrink-0">
                        {prod.images && prod.images.length > 0 ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={prod.images[0]}
                            alt={prod.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <Package className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900 text-sm">
                      {prod.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {prod.category?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">
                      ${prod.basePrice}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                        {prod.variants?.length || 0} variants
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedProduct(prod)}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-yellow-500 hover:text-slate-950 transition-colors text-xs font-semibold"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View Details</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <h3 className="text-lg font-bold text-slate-900">Product Details</h3>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              {/* Basic Info */}
              <div className="flex space-x-4 items-start">
                <div className="w-24 h-24 rounded-xl border border-slate-200 overflow-hidden bg-slate-100 flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedProduct.images[0]}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1 flex-1">
                  <h2 className="text-xl font-bold text-slate-900">{selectedProduct.name}</h2>
                  <p className="text-sm text-slate-500">{selectedProduct.description}</p>
                  <div className="flex items-center space-x-4 pt-2">
                    <span className="text-sm font-semibold text-slate-700">
                      Base Price: <span className="text-slate-950">${selectedProduct.basePrice}</span>
                    </span>
                    <span className="text-sm font-semibold text-slate-700">
                      Category: <span className="text-slate-950">{selectedProduct.category?.name}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* General Attributes */}
              {selectedProduct.generalAttributes && Object.keys(selectedProduct.generalAttributes).length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">General Attributes</h4>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(selectedProduct.generalAttributes).map(([key, value], idx) => (
                      <span key={idx} className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
                        {key}: <strong className="text-slate-900">{String(value)}</strong>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Variants List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Product Variants & Stock</h4>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase">
                        <th className="px-4 py-3">SKU</th>
                        <th className="px-4 py-3">Price</th>
                        <th className="px-4 py-3">Stock</th>
                        <th className="px-4 py-3">Attributes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {selectedProduct.variants.map((v, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="px-4 py-3 font-semibold text-slate-900">{v.sku}</td>
                          <td className="px-4 py-3 text-slate-700">${v.price}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded text-xs font-semibold ${v.stock > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                              {v.stock} units
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-600 text-xs">
                            {v.attributes ? JSON.stringify(v.attributes) : "N/A"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                onClick={() => setSelectedProduct(null)}
                className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}