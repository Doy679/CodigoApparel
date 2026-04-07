"use client";

import { Product } from "@/data/products";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  X,
  Save,
  AlertTriangle,
  ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { useAdminStore } from "@/store/useAdminStore";
import { toast } from "sonner";
import Link from "next/link";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export default function AdminProducts() {
  const [mounted, setMounted] = useState(false);
  const { products, updateProduct, deleteProduct, addProduct } = useAdminStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // New State for Stock and Price Editing and Adding (Using strings for better typing experience)
  const [editingStock, setEditingStock] = useState<{ [key: string]: string }>({});
  const [editingPrice, setEditingPrice] = useState<{ [key: string]: string }>({});
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const handleImageUpload = async (file: File) => {
    if (!isSupabaseConfigured) {
      toast.error(
        "Image uploads are disabled. Please configure Supabase URL and Key in your .env file."
      );
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file.");
      return;
    }

    if (!supabase) {
      toast.error("Cloud storage is not configured properly.");
      return;
    }

    const toastId = toast.loading("Uploading image...");

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;

      const { error } = await supabase.storage.from("products").upload(fileName, file, {
        cacheControl: "3600",
        upsert: false
      });

      if (error) {
        throw error;
      }

      const {
        data: { publicUrl }
      } = supabase.storage.from("products").getPublicUrl(fileName);

      if (selectedProduct) {
        setSelectedProduct({ ...selectedProduct, image: publicUrl });
        toast.dismiss(toastId);
        toast.success("Image uploaded successfully!");
      }
    } catch (error: unknown) {
      toast.dismiss(toastId);
      const message = error instanceof Error ? error.message : String(error);
      toast.error(`Upload failed: ${message}`);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (isEditMode && e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (isEditMode) setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    return products.filter(
      (p) =>
        p &&
        p.name &&
        p.category &&
        (p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.id.includes(searchTerm))
    );
  }, [products, searchTerm]);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredProducts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProducts.map((p) => p.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handleBulkOutOfStock = () => {
    selectedIds.forEach((id) => updateProduct(id, { stock: 0 }));
    setSelectedIds([]);
    toast.success(`${selectedIds.length} items marked out of stock.`);
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedIds.length} products?`)) {
      selectedIds.forEach((id) => deleteProduct(id));
      setSelectedIds([]);
      toast.success(`${selectedIds.length} items deleted from catalog.`);
    }
  };

  if (!mounted) return null;

  const handleStockInputChange = (id: string, value: string) => {
    setEditingStock((prev) => ({ ...prev, [id]: value }));
  };

  const saveStockChange = (id: string) => {
    const value = parseInt(editingStock[id]);
    if (!isNaN(value)) {
      updateProduct(id, { stock: value });
      const newEditingStock = { ...editingStock };
      delete newEditingStock[id];
      setEditingStock(newEditingStock);
      toast.success("Stock Level Updated", {
        action: {
          label: "View Live",
          onClick: () => window.open(`/product/${id}`, "_blank")
        }
      });
    }
  };

  const handlePriceInputChange = (id: string, value: string) => {
    setEditingPrice((prev) => ({ ...prev, [id]: value }));
  };

  const savePriceChange = (id: string) => {
    const value = parseFloat(editingPrice[id]);
    if (!isNaN(value)) {
      updateProduct(id, { price: value });
      const newEditingPrice = { ...editingPrice };
      delete newEditingPrice[id];
      setEditingPrice(newEditingPrice);
      toast.success(
        `Price Updated: ₱${value.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`,
        {
          action: {
            label: "View Live",
            onClick: () => window.open(`/product/${id}`, "_blank")
          }
        }
      );
    }
  };

  const handleAddNewClick = () => {
    const numericIds = Array.isArray(products)
      ? products.map((p) => parseInt(p.id)).filter((id) => !isNaN(id))
      : [];
    const nextId = (Math.max(...numericIds, 0) + 1).toString();
    setSelectedProduct({
      id: nextId,
      name: "",
      price: 0,
      image: "/images/products/C-CB-01.jpg", // Default placeholder
      category: "Tops",
      isNew: true, // Default to New Drop so it shows on homepage
      description: "",
      details: ["Premium Fabric", "Signature oversized fit"],
      stock: 0,
      sizes: ["S", "M", "L", "XL"]
    });
    setIsEditMode(true);
    setIsAddingNew(true);
  };

  const handleView = (product: Product) => {
    setSelectedProduct({ ...product });
    setIsEditMode(false);
    setIsAddingNew(false);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct({ ...product });
    setIsEditMode(true);
    setIsAddingNew(false);
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete.id);
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProduct) {
      if (isAddingNew) {
        addProduct(selectedProduct);
        toast.success(`Product "${selectedProduct.name}" added to catalog.`);
      } else {
        updateProduct(selectedProduct.id, selectedProduct);
        toast.success(`Product details updated.`, {
          action: {
            label: "View Live",
            onClick: () => window.open(`/product/${selectedProduct.id}`, "_blank")
          }
        });
      }
      setSelectedProduct(null);
      setIsAddingNew(false);
    }
  };

  return (
    <div className="space-y-10 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-black uppercase italic tracking-tighter leading-none">
            Catalog
          </h2>
          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
            Manage your products and collections
          </p>
        </div>
        <button
          onClick={handleAddNewClick}
          className="bg-black text-white px-8 py-4 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-neutral-800 transition-all flex items-center gap-3 w-fit"
        >
          <Plus size={16} /> Add New Product
        </button>
      </div>

      <div className="bg-white border border-neutral-100 overflow-hidden">
        <div className="p-6 border-b border-neutral-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search catalog by name, category, or ID..."
              className="bg-neutral-50 border-none py-3 pl-12 pr-6 text-[10px] font-bold uppercase tracking-widest w-full md:w-96 outline-none focus:ring-1 focus:ring-black transition-all"
            />
          </div>
          <div className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
            {filteredProducts.length} Products Found
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-50">
                <th className="px-8 py-6 w-10">
                  <input
                    type="checkbox"
                    checked={
                      selectedIds.length === filteredProducts.length && filteredProducts.length > 0
                    }
                    onChange={toggleSelectAll}
                    className="accent-black w-4 h-4"
                  />
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
                  Product
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
                  Category
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
                  Price
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 w-40">
                  Stock
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
                  Status
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, i) => {
                const isEditingThisStock = editingStock[product.id] !== undefined;
                const currentStockValue = isEditingThisStock
                  ? editingStock[product.id]
                  : product.stock;

                const isEditingThisPrice = editingPrice[product.id] !== undefined;
                // If editing, show what the user typed. If not, show formatted price with .00
                const displayPriceValue = isEditingThisPrice
                  ? editingPrice[product.id]
                  : product.price.toLocaleString("en-PH", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    });

                return (
                  <motion.tr
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={product.id}
                    className={`border-b border-neutral-50 hover:bg-neutral-50 transition-colors group ${selectedIds.includes(product.id) ? "bg-neutral-50" : ""}`}
                  >
                    <td className="px-8 py-6">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(product.id)}
                        onChange={() => toggleSelect(product.id)}
                        className="accent-black w-4 h-4"
                      />
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-6">
                        <div className="relative w-12 h-16 bg-neutral-100 overflow-hidden">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="text-[10px] font-black uppercase italic tracking-tighter">
                            {product.name || "UNNAMED PRODUCT"}
                          </h4>
                          <p className="text-[8px] font-bold text-neutral-400 uppercase tracking-[0.1em] mt-1">
                            ID: SKU-00{product.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 group/price">
                        <span className="text-[10px] font-black uppercase tracking-widest">₱</span>
                        <input
                          type="text"
                          inputMode="decimal"
                          value={
                            displayPriceValue === "0.00" && isEditingThisPrice
                              ? ""
                              : displayPriceValue
                          }
                          placeholder="0.00"
                          onFocus={(e) => e.target.select()}
                          onKeyDown={(e) => e.key === "Enter" && savePriceChange(product.id)}
                          onChange={(e) => handlePriceInputChange(product.id, e.target.value)}
                          className={`bg-neutral-50 border-none py-2 px-1 text-[10px] font-black uppercase tracking-widest w-24 outline-none focus:ring-1 focus:ring-black transition-all ${isEditingThisPrice ? "ring-1 ring-neutral-300" : ""}`}
                        />
                        {isEditingThisPrice && (
                          <button
                            onClick={() => savePriceChange(product.id)}
                            className="p-2 bg-black text-white hover:bg-neutral-800 transition-colors"
                            title="Save Price"
                          >
                            <Save size={12} />
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 group/stock">
                        <input
                          type="text"
                          inputMode="numeric"
                          value={
                            currentStockValue === 0 && isEditingThisStock ? "" : currentStockValue
                          }
                          placeholder="0"
                          onFocus={(e) => e.target.select()}
                          onKeyDown={(e) => e.key === "Enter" && saveStockChange(product.id)}
                          onChange={(e) => handleStockInputChange(product.id, e.target.value)}
                          className={`bg-neutral-50 border-none py-2 px-3 text-[10px] font-black uppercase tracking-widest w-20 outline-none focus:ring-1 focus:ring-black transition-all ${isEditingThisStock ? "ring-1 ring-neutral-300" : ""}`}
                        />
                        {isEditingThisStock && (
                          <button
                            onClick={() => saveStockChange(product.id)}
                            className="p-2 bg-black text-white hover:bg-neutral-800 transition-colors"
                            title="Save Stock"
                          >
                            <Save size={12} />
                          </button>
                        )}
                        {!isEditingThisStock && product.stock <= 5 && (
                          <span className="w-2 h-2 bg-red-500 rounded-full border border-white animate-pulse"></span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${product.stock > 0 ? "bg-green-500" : "bg-red-500"}`}
                        ></div>
                        <span
                          className={`text-[10px] font-black uppercase tracking-widest ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {product.stock > 0 ? "Active" : "Out of Stock"}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <Link
                          href={`/product/${product.id}`}
                          target="_blank"
                          className="text-neutral-400 hover:text-black transition-colors"
                          title="View on Site"
                        >
                          <ExternalLink size={16} />
                        </Link>
                        <button
                          onClick={() => handleView(product)}
                          className="text-neutral-400 hover:text-black transition-colors"
                          title="Quick Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-neutral-400 hover:text-black transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(product)}
                          className="text-neutral-400 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-8 py-20 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-300 italic">
                      No products matched your search criteria
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[90] bg-black text-white px-10 py-6 flex items-center gap-10 border border-neutral-800 shadow-2xl"
          >
            <div className="flex flex-col">
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-neutral-500">
                Selected
              </span>
              <span className="text-[12px] font-black uppercase italic tracking-tighter leading-none">
                {selectedIds.length} Items
              </span>
            </div>
            <div className="h-8 w-px bg-neutral-800" />
            <div className="flex items-center gap-4">
              <button
                onClick={handleBulkOutOfStock}
                className="text-[10px] font-black uppercase tracking-widest hover:text-neutral-400 transition-colors"
              >
                Mark Out of Stock
              </button>
              <button
                onClick={handleBulkDelete}
                className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-400 transition-colors"
              >
                Bulk Delete
              </button>
              <button
                onClick={() => setSelectedIds([])}
                className="text-[10px] font-black uppercase tracking-widest text-neutral-500 hover:text-white transition-colors ml-4"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View/Edit Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-2xl relative z-10 overflow-hidden"
            >
              <div className="flex justify-between items-center p-8 border-b border-neutral-100">
                <h3 className="text-xl font-black uppercase italic tracking-tighter">
                  {isEditMode ? "Edit Product" : "Product Details"}
                </h3>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="text-neutral-400 hover:text-black transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form
                onSubmit={handleSaveProduct}
                className="p-8 space-y-8 max-h-[70vh] overflow-y-auto"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div
                      className={`aspect-[3/4] relative bg-neutral-100 overflow-hidden group border-2 transition-all duration-300 flex items-center justify-center ${
                        isDragging
                          ? "border-black border-dashed bg-neutral-200"
                          : "border-transparent"
                      } ${isEditMode ? "cursor-pointer" : "cursor-default"}`}
                      onDrop={onDrop}
                      onDragOver={onDragOver}
                      onDragLeave={onDragLeave}
                      onClick={() => isEditMode && document.getElementById("imageInput")?.click()}
                    >
                      <input
                        id="imageInput"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          e.target.files?.[0] && handleImageUpload(e.target.files[0])
                        }
                      />
                      <Image
                        src={selectedProduct.image}
                        alt={selectedProduct.name}
                        fill
                        className="object-cover"
                      />
                      {isEditMode && (
                        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity p-4 text-center">
                          <Plus className="text-white mb-2" size={32} />
                          <p className="text-[10px] font-black uppercase text-white tracking-widest">
                            {isDragging ? "Drop to Update" : "Click or Drag Image"}
                          </p>
                        </div>
                      )}
                    </div>
                    {isEditMode && (
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                          Image Path / URL
                        </label>
                        <input
                          value={
                            selectedProduct.image.startsWith("data:")
                              ? "Local Image Attached"
                              : selectedProduct.image
                          }
                          onChange={(e) =>
                            setSelectedProduct({ ...selectedProduct, image: e.target.value })
                          }
                          placeholder="/images/products/name.jpg"
                          className="w-full border-b border-neutral-200 py-2 text-[10px] font-bold focus:border-black outline-none transition-colors"
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                        Product Name
                      </label>
                      <input
                        disabled={!isEditMode}
                        value={selectedProduct.name}
                        onChange={(e) =>
                          setSelectedProduct({ ...selectedProduct, name: e.target.value })
                        }
                        placeholder="e.g. C • Corduroy Black 01"
                        className="w-full border-b border-neutral-200 py-2 text-sm font-black uppercase italic focus:border-black outline-none transition-colors disabled:bg-transparent"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                        Category
                      </label>
                      <select
                        disabled={!isEditMode}
                        value={selectedProduct.category}
                        onChange={(e) =>
                          setSelectedProduct({ ...selectedProduct, category: e.target.value })
                        }
                        className="w-full border-b border-neutral-200 py-2 text-xs font-black uppercase tracking-widest focus:border-black outline-none transition-colors disabled:bg-transparent bg-transparent"
                      >
                        <option value="Tops">Tops</option>
                        <option value="Bottoms">Bottoms</option>
                        <option value="Headwear">Headwear</option>
                        <option value="Accessories">Accessories</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-3 py-2">
                      <input
                        type="checkbox"
                        id="isNew"
                        disabled={!isEditMode}
                        checked={selectedProduct.isNew}
                        onChange={(e) =>
                          setSelectedProduct({ ...selectedProduct, isNew: e.target.checked })
                        }
                        className="w-4 h-4 accent-black"
                      />
                      <label
                        htmlFor="isNew"
                        className="text-[10px] font-black uppercase tracking-widest cursor-pointer"
                      >
                        Feature as New Drop
                      </label>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                        Price (PHP)
                      </label>
                      <input
                        type="text"
                        inputMode="decimal"
                        disabled={!isEditMode}
                        value={selectedProduct.price === 0 ? "" : selectedProduct.price}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) =>
                          setSelectedProduct({
                            ...selectedProduct,
                            price: parseFloat(e.target.value) || 0
                          })
                        }
                        placeholder="0.00"
                        className="w-full border-b border-neutral-200 py-2 text-sm font-black uppercase tracking-widest focus:border-black outline-none transition-colors disabled:bg-transparent"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                        Stock
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        disabled={!isEditMode}
                        value={selectedProduct.stock === 0 ? "" : selectedProduct.stock}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) =>
                          setSelectedProduct({
                            ...selectedProduct,
                            stock: parseInt(e.target.value) || 0
                          })
                        }
                        placeholder="0"
                        className="w-full border-b border-neutral-200 py-2 text-sm font-black uppercase tracking-widest focus:border-black outline-none transition-colors disabled:bg-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    disabled={!isEditMode}
                    value={selectedProduct.description}
                    onChange={(e) =>
                      setSelectedProduct({ ...selectedProduct, description: e.target.value })
                    }
                    placeholder="Enter product story and details..."
                    className="w-full border border-neutral-100 p-4 text-xs font-bold uppercase tracking-tight focus:border-black outline-none transition-colors resize-none disabled:bg-transparent"
                  />
                </div>

                {isEditMode && (
                  <button
                    type="submit"
                    className="w-full bg-black text-white py-5 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-neutral-800 transition-all flex items-center justify-center gap-3"
                  >
                    <Save size={16} /> {isAddingNew ? "Add to Catalog" : "Save Changes"}
                  </button>
                )}
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white max-w-sm w-full relative z-10 p-10 text-center space-y-8"
            >
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-red-50 flex items-center justify-center text-red-600 rounded-full">
                  <AlertTriangle size={32} />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black uppercase italic tracking-tighter">
                  Deauthorize Product?
                </h3>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest leading-relaxed">
                  You are about to remove{" "}
                  <span className="text-black italic">{productToDelete?.name}</span> from the active
                  catalog. This action cannot be undone.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="py-4 text-[10px] font-black uppercase tracking-widest border border-neutral-100 hover:bg-neutral-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="py-4 text-[10px] font-black uppercase tracking-widest bg-red-600 text-white hover:bg-red-700 transition-all"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
