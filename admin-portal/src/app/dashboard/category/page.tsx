"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { api } from "@/service/api";
import { toast } from "sonner";
import { Plus, Trash2, FolderPlus, Image as ImageIcon, X } from "lucide-react";
import axios from "axios";

interface AttributeDef {
  name: string;
  type: "string" | "number" | "boolean";
}

interface CategoryType {
  _id: string;
  name: string;
  image: string;
  dynamicAttributes: AttributeDef[];
}

export default function CategoryPage() {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dynamicAttributes, setDynamicAttributes] = useState<AttributeDef[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [attrName, setAttrName] = useState("");
  const [attrType, setAttrType] = useState<"string" | "number" | "boolean">("string");

  async function fetchCategories() {
    try {
      setIsLoading(true);
      const response = await api.get("/categories");
      setCategories(response.data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to fetch categories.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  // Defers the fetch call to the next event loop tick to avoid cascading render warnings
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCategories();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAddAttribute = () => {
    if (!attrName.trim()) {
      toast.error("Attribute name is required.");
      return;
    }
    setDynamicAttributes([...dynamicAttributes, { name: attrName.trim(), type: attrType }]);
    setAttrName("");
    setAttrType("string");
  };

  const handleRemoveAttribute = (index: number) => {
    setDynamicAttributes(dynamicAttributes.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Category name is required.");
      return;
    }

    if (!imageFile) {
      toast.error("Category image is required.");
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("image", imageFile);
      formData.append("dynamicAttributes", JSON.stringify(dynamicAttributes));

      await api.post("/categories", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Category created successfully!");
      setIsModalOpen(false);
      resetForm();
      fetchCategories();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to create category.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setName("");
    setImageFile(null);
    setImagePreview(null);
    setDynamicAttributes([]);
    setAttrName("");
    setAttrType("string");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Category Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Create and manage product categories with custom dynamic attributes.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-yellow-500 text-slate-950 font-semibold hover:bg-yellow-400 transition-colors shadow-sm text-sm"
        >
          <FolderPlus className="w-5 h-5" />
          <span>Add New Category</span>
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex justify-center items-center">
            <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center text-slate-500 font-medium">
            No categories found. Create your first category above.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                  <th className="px-6 py-4">Image</th>
                  <th className="px-6 py-4">Category Name</th>
                  <th className="px-6 py-4">Dynamic Attributes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {categories.map((cat) => (
                  <tr key={cat._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-200 relative bg-slate-100 flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900 text-sm">
                      {cat.name}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {cat.dynamicAttributes && cat.dynamicAttributes.length > 0 ? (
                          cat.dynamicAttributes.map((attr, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200"
                            >
                              {attr.name} <span className="text-yellow-600 ml-1 font-semibold">({attr.type})</span>
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400">No custom attributes</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg  shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">Add New Category</h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-slate-700">
                  Category Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Watches, Clothing"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full py-2.5 px-3 rounded-lg border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-yellow-500 text-sm transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Category Image
                </label>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-lg border border-dashed border-slate-300 flex items-center justify-center bg-slate-50 overflow-hidden relative">
                    {imagePreview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-slate-400" />
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-3 pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-semibold text-slate-700">
                    Dynamic Attributes
                  </label>
                  <span className="text-xs text-slate-400">Optional specs for products</span>
                </div>

                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Attribute name (e.g. Material)"
                    value={attrName}
                    onChange={(e) => setAttrName(e.target.value)}
                    className="flex-1 py-2 px-3 rounded-lg border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-yellow-500 text-sm"
                  />
                  <select
                    value={attrType}
                    onChange={(e) => setAttrType(e.target.value as "string" | "number" | "boolean")}
                    className="py-2 px-3 rounded-lg border border-slate-300 text-slate-900 bg-white focus:outline-none focus:border-yellow-500 text-sm"
                  >
                    <option value="string">String</option>
                    <option value="number">Number</option>
                    <option value="boolean">Boolean</option>
                  </select>
                  <button
                    type="button"
                    onClick={handleAddAttribute}
                    className="px-3 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-2 mt-2">
                  {dynamicAttributes.map((attr, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 text-sm"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-slate-800">{attr.name}</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-yellow-100 text-yellow-800 font-medium">
                          {attr.type}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveAttribute(index)}
                        className="text-slate-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-lg bg-yellow-500 text-slate-950 font-semibold hover:bg-yellow-400 text-sm transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Creating..." : "Save Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}