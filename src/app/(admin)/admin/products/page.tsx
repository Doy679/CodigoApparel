"use client";

import { products as initialProducts, Product } from "@/data/products";
import { Plus, Search, Edit2, Trash2, Eye, X, Save, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

export default function AdminProducts() {
  const [productList, setProductList] = useState<Product[]>(initialProducts);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const handleStockChange = (id: string, newStock: string) => {
    const value = parseInt(newStock) || 0;
    setProductList(prev => prev.map(p => 
      p.id === id ? { ...p, stock: value } : p
    ));
  };

  const handleView = (product: Product) => {
    setSelectedProduct(product);
    setIsEditMode(false);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsEditMode(true);
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      setProductList(prev => prev.filter(p => p.id !== productToDelete.id));
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProduct) {
      setProductList(prev => prev.map(p => 
        p.id === selectedProduct.id ? selectedProduct : p
      ));
      setSelectedProduct(null);
    }
  };

  return (
    <div className="space-y-10 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-black uppercase italic tracking-tighter leading-none">Catalog</h2>
          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Manage your products and collections</p>
        </div>
        <button className="bg-black text-white px-8 py-4 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-neutral-800 transition-all flex items-center gap-3 w-fit">
          <Plus size={16} /> Add New Product
        </button>
      </div>

      <div className="bg-white border border-neutral-100 overflow-hidden">
        <div className="p-6 border-b border-neutral-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input 
              type="text" 
              placeholder="Search catalog..." 
              className="bg-neutral-50 border-none py-3 pl-12 pr-6 text-[10px] font-bold uppercase tracking-widest w-full md:w-80 outline-none focus:ring-1 focus:ring-black transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-50">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Product</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Category</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Price</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 w-32">Stock</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Status</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {productList.map((product, i) => (
                <motion.tr 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={product.id} 
                  className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors group"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-6">
                      <div className="relative w-12 h-16 bg-neutral-100 overflow-hidden">
                        <Image src={product.image} alt={product.name} fill className="object-cover" />
                      </div>
                      <div>
                        <h4 className="text-[10px] font-black uppercase italic tracking-tighter">{product.name}</h4>
                        <p className="text-[8px] font-bold text-neutral-400 uppercase tracking-[0.1em] mt-1">ID: SKU-00{product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-[10px] font-black uppercase tracking-widest">{product.category}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-[10px] font-black uppercase tracking-widest">₱{product.price.toLocaleString()}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="relative flex items-center group/stock">
                      <input 
                        type="number"
                        value={product.stock}
                        onChange={(e) => handleStockChange(product.id, e.target.value)}
                        className="bg-neutral-50 border-none py-2 px-3 text-[10px] font-black uppercase tracking-widest w-20 outline-none focus:ring-1 focus:ring-black transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      {product.stock <= 5 && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-white animate-pulse"></span>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${product.stock > 0 ? "bg-green-500" : "bg-red-500"}`}></div>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
                        {product.stock > 0 ? "Active" : "Out of Stock"}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => handleView(product)}
                        className="text-neutral-400 hover:text-black transition-colors" title="View"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => handleEdit(product)}
                        className="text-neutral-400 hover:text-black transition-colors" title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(product)}
                        className="text-neutral-400 hover:text-red-600 transition-colors" title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
                <button onClick={() => setSelectedProduct(null)} className="text-neutral-400 hover:text-black transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="aspect-[3/4] relative bg-neutral-100 overflow-hidden">
                    <Image src={selectedProduct.image} alt={selectedProduct.name} fill className="object-cover" />
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Product Name</label>
                      <input 
                        disabled={!isEditMode}
                        value={selectedProduct.name}
                        onChange={(e) => setSelectedProduct({ ...selectedProduct, name: e.target.value })}
                        className="w-full border-b border-neutral-200 py-2 text-sm font-black uppercase italic focus:border-black outline-none transition-colors disabled:bg-transparent"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Price (PHP)</label>
                      <input 
                        type="number"
                        disabled={!isEditMode}
                        value={selectedProduct.price}
                        onChange={(e) => setSelectedProduct({ ...selectedProduct, price: parseFloat(e.target.value) })}
                        className="w-full border-b border-neutral-200 py-2 text-sm font-black uppercase tracking-widest focus:border-black outline-none transition-colors disabled:bg-transparent"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Stock</label>
                      <input 
                        type="number"
                        disabled={!isEditMode}
                        value={selectedProduct.stock}
                        onChange={(e) => setSelectedProduct({ ...selectedProduct, stock: parseInt(e.target.value) || 0 })}
                        className="w-full border-b border-neutral-200 py-2 text-sm font-black uppercase tracking-widest focus:border-black outline-none transition-colors disabled:bg-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Description</label>
                  <textarea 
                    rows={3}
                    disabled={!isEditMode}
                    value={selectedProduct.description}
                    onChange={(e) => setSelectedProduct({ ...selectedProduct, description: e.target.value })}
                    className="w-full border border-neutral-100 p-4 text-xs font-bold uppercase tracking-tight focus:border-black outline-none transition-colors resize-none disabled:bg-transparent"
                  />
                </div>

                {isEditMode && (
                  <button type="submit" className="w-full bg-black text-white py-5 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-neutral-800 transition-all flex items-center justify-center gap-3">
                    <Save size={16} /> Save Changes
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
                <h3 className="text-xl font-black uppercase italic tracking-tighter">Deauthorize Product?</h3>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest leading-relaxed">
                  You are about to remove <span className="text-black italic">{productToDelete?.name}</span> from the active catalog. This action cannot be undone.
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
