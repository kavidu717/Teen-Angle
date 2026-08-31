"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { api } from "@/service/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Image as ImageIcon, ArrowLeft, Upload } from "lucide-react";
import axios from "axios";

interface AttributeDef {
  name: string;
  type: "string" | "number" | "boolean";
}

interface CategoryType {
  _id: string;
  name: string;
  dynamicAttributes: AttributeDef[];
}

interface VariantType {
  sku: string;
  price: number;
  stock: number;
  attributes: Record<string, string | number | boolean>;
}

export default function AddProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  
  // Images
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // General Attributes (Brand, Sex, etc.)
  const [brand, setBrand] = useState("");
  const [sex, setSex] = useState("Unisex");

  // Dynamic Attributes for Variants
  const [variantPrice, setVariantPrice] = useState("");
  const [variantStock, setVariantStock] = useState("");
  const [variantSku, setVariantSku] = useState("");
  const [currentDynamicAttrs, setCurrentDynamicAttrs] = useState<Record<string, string>>({});
  const [variants, setVariants] = useState<VariantType[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch categories on load
  async function fetchCategories() {
    try {
      const response = await api.get("/categories");
      setCategories(response.data);
    } catch {
      toast.error("Failed to load categories.");
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCategories();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Handle Category Change to load its dynamic attributes
  const handleCategorySelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const catId = e.target.value;
    setCategoryId(catId);
    const found = categories.find((c) => c._id === catId);
    setSelectedCategory(found || null);
    setCurrentDynamicAttrs({});
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImageFiles((prev) => [...prev, ...filesArray]);
      const previewsArray = filesArray.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...previewsArray]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddVariant = () => {
    if (!variantPrice || !variantStock || !variantSku) {
      toast.error("Please fill SKU, Price, and Stock for the variant.");
      return;
    }

    const newVariant: VariantType = {
      sku: variantSku,
      price: Number(variantPrice),
      stock: Number(variantStock),
      attributes: currentDynamicAttrs,
    };

    setVariants([...variants, newVariant]);
    setVariantSku("");
    setVariantPrice("");
    setVariantStock("");
  };

  const handleRemoveVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!name || !basePrice || !categoryId) {
      toast.error("Please fill out all required main fields.");
      return;
    }

    if (imageFiles.length === 0) {
      toast.error("At least one product image is required.");
      return;
    }

    if (variants.length === 0) {
      toast.error("At least one product variant is required.");
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("basePrice", basePrice);
      formData.append("category", categoryId);

      imageFiles.forEach((file) => {
        formData.append("images", file);
      });

      const generalAttributes = {
        Brand: brand,
        Sex: sex,
      };
      formData.append("generalAttributes", JSON.stringify(generalAttributes));
      formData.append("variants", JSON.stringify(variants));

      await api.post("/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Product created successfully!");
      router.push("/dashboard/products");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to create product.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors text-slate-600"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Add New Product</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 border-b pb-2">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-slate-700">Product Name</label>
              <input
                type="text"
                placeholder="e.g. Classic Leather Watch"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full py-2.5 px-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-yellow-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-semibold text-slate-700">Base Price ($)</label>
              <input
                type="number"
                placeholder="99.99"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                className="w-full py-2.5 px-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-yellow-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-slate-700">Category</label>
              <select
                value={categoryId}
                onChange={handleCategorySelect}
                className="w-full py-2.5 px-3 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:border-yellow-500"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-semibold text-slate-700">Brand</label>
              <input
                type="text"
                placeholder="e.g. Rolex, Nike"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full py-2.5 px-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-yellow-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-semibold text-slate-700">Target Sex</label>
              <select
                value={sex}
                onChange={(e) => setSex(e.target.value)}
                className="w-full py-2.5 px-3 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:border-yellow-500"
              >
                <option value="Unisex">Unisex</option>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-semibold text-slate-700">Description</label>
            <textarea
              rows={3}
              placeholder="Detailed description of the product..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full py-2.5 px-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-yellow-500"
            />
          </div>
        </div>

        {/* Images */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 border-b pb-2">Product Images</h2>
          
          <div className="flex flex-wrap gap-4 items-center">
            {imagePreviews.map((src, index) => (
              <div key={index} className="w-20 h-20 rounded-lg border relative overflow-hidden bg-slate-50 group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="Upload Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}

            <label className="w-20 h-20 rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center cursor-pointer hover:border-yellow-500 transition-colors bg-slate-50">
              <Upload className="w-5 h-5 text-slate-400" />
              <span className="text-[10px] text-slate-500 mt-1">Add Image</span>
              <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          </div>
        </div>

        {/* Variants & Dynamic Attributes */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 border-b pb-2">Product Variants & Attributes</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-slate-700">SKU</label>
              <input
                type="text"
                placeholder="e.g. WATCH-BLK-01"
                value={variantSku}
                onChange={(e) => setVariantSku(e.target.value)}
                className="w-full py-2.5 px-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-yellow-500"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-slate-700">Variant Price ($)</label>
              <input
                type="number"
                placeholder="89.99"
                value={variantPrice}
                onChange={(e) => setVariantPrice(e.target.value)}
                className="w-full py-2.5 px-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-yellow-500"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-slate-700">Stock Quantity</label>
              <input
                type="number"
                placeholder="50"
                value={variantStock}
                onChange={(e) => setVariantStock(e.target.value)}
                className="w-full py-2.5 px-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-yellow-500"
              />
            </div>
          </div>

          {/* Render Dynamic Attributes based on selected category */}
          {selectedCategory && selectedCategory.dynamicAttributes.length > 0 && (
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-yellow-600">
                Category Specific Attributes ({selectedCategory.name})
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedCategory.dynamicAttributes.map((attr, idx) => (
                  <div key={idx} className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">{attr.name} ({attr.type})</label>
                    <input
                      type={attr.type === "number" ? "number" : "text"}
                      placeholder={`Enter ${attr.name}`}
                      value={currentDynamicAttrs[attr.name] || ""}
                      onChange={(e) =>
                        setCurrentDynamicAttrs({
                          ...currentDynamicAttrs,
                          [attr.name]: attr.type === "number" ? Number(e.target.value) : e.target.value,
                        })
                      }
                      className="w-full py-2 px-3 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:border-yellow-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={handleAddVariant}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Variant</span>
          </button>

          {/* Variants Table */}
          {variants.length > 0 && (
            <div className="border border-slate-200 rounded-lg overflow-hidden mt-4">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase">
                    <th className="px-4 py-3">SKU</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Stock</th>
                    <th className="px-4 py-3">Attributes</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {variants.map((v, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 font-medium text-slate-900">{v.sku}</td>
                      <td className="px-4 py-3 text-slate-600">${v.price}</td>
                      <td className="px-4 py-3 text-slate-600">{v.stock}</td>
                      <td className="px-4 py-3 text-slate-600">
                        {JSON.stringify(v.attributes)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleRemoveVariant(idx)}
                          className="text-slate-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-lg bg-yellow-500 text-slate-950 font-semibold hover:bg-yellow-400 text-sm disabled:opacity-50 shadow-sm"
          >
            {isSubmitting ? "Saving Product..." : "Save Product"}
          </button>
        </div>
      </form>
    </div>
  );
}