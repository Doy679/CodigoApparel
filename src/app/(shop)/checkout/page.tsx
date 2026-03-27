"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ShieldCheck, Truck, CreditCard, MapPin } from "lucide-react";
import Image from "next/image";
import { regions, provinces, cities, barangays } from "select-philippines-address";
import { useEffect } from "react";
import DeliveryAnimation from "@/components/DeliveryAnimation";
import { getZipCode } from "@/data/ph-locations";
import usePostalPH from "use-postal-ph";

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  
  const { fetchDataLists } = usePostalPH();

  const [regionData, setRegionData] = useState<any[]>([]);
  const [provinceData, setProvinceData] = useState<any[]>([]);
  const [cityData, setCityData] = useState<any[]>([]);
  const [barangayData, setBarangayData] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    region: "",
    regionCode: "",
    province: "",
    provinceCode: "",
    city: "",
    cityCode: "",
    barangay: "",
    postalCode: "",
  });

  // Load regions on mount
  useEffect(() => {
    regions().then((res: any[]) => setRegionData(res));
  }, []);

  // Load provinces when region changes
  useEffect(() => {
    if (formData.regionCode) {
      provinces(formData.regionCode).then((res: any[]) => setProvinceData(res));
    } else {
      setProvinceData([]);
    }
    setFormData(prev => ({ ...prev, province: "", provinceCode: "", city: "", cityCode: "", barangay: "", postalCode: "" }));
  }, [formData.regionCode]);

  // Load cities when province changes
  useEffect(() => {
    if (formData.provinceCode) {
      cities(formData.provinceCode).then((res: any[]) => setCityData(res));
    } else {
      setCityData([]);
    }
    setFormData(prev => ({ ...prev, city: "", cityCode: "", barangay: "", postalCode: "" }));
  }, [formData.provinceCode]);

  // Load barangays when city changes
  useEffect(() => {
    if (formData.cityCode) {
      barangays(formData.cityCode).then((res: any[]) => setBarangayData(res));
    } else {
      setBarangayData([]);
    }
    // Note: Postal code is set in the handle onChange, barangay reset is done there too to avoid effect loops
  }, [formData.cityCode]);

    const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const city = cityData.find(c => c.city_code === e.target.value);
      if (city) {
        let foundCode = getZipCode(city.city_name);
        
        // If not in manual fast-lookup list, use the comprehensive library
        if (!foundCode) {
          const cleanName = city.city_name.replace(/ City$/i, "").replace(/ Municipality$/i, "").trim();
          const res = (fetchDataLists as any)({ search: cleanName });
          if (res && res.data && res.data.length > 0) {
            // Take the first matching postal code
            foundCode = res.data[0].post_code.toString();
          }
        }
  
        setFormData({
          ...formData,
          city: city.city_name,
          cityCode: e.target.value,
          barangay: "",
          postalCode: foundCode
        });
      }
    };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setShowAnimation(true);
    
    // Simulate payment processing + animation time
    setTimeout(() => {
      setIsProcessing(false);
      setShowAnimation(false);
      setIsSuccess(true);
      clearCart();
    }, 4500); // 4.5 seconds for a better animation experience
  };

  if (showAnimation) {
    return <DeliveryAnimation />;
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center space-y-8"
        >
          <div className="flex justify-center">
            <CheckCircle2 size={80} className="text-black" />
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-black uppercase italic tracking-tighter">Order Decoded</h1>
            <p className="text-neutral-500 font-medium">Your package is being prepared for the street. You will receive a confirmation email shortly.</p>
          </div>
          <Link 
            href="/" 
            className="inline-block w-full bg-black text-white py-5 text-xs font-black uppercase tracking-[0.2em] hover:bg-neutral-800 transition-all"
          >
            Back to Home
          </Link>
        </motion.div>
      </div>
    );
  }

  if (cart.length === 0 && !isSuccess) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 gap-6">
        <h1 className="text-2xl font-black uppercase italic tracking-tighter text-neutral-400">Your bag is empty</h1>
        <Link href="/store" className="bg-black text-white px-8 py-4 text-xs font-black uppercase tracking-widest">
          Go to Store
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-32 pb-24">
      <div className="container mx-auto px-4 md:px-8">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:text-neutral-500 transition-colors mb-12"
        >
          <ArrowLeft size={14} />
          Back to selection
        </Link>

        <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-none mb-16">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Shipping Form */}
          <form onSubmit={handleSubmit} className="space-y-12">
            <div className="space-y-8">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                <h2 className="text-xs font-black uppercase tracking-[0.3em]">Shipping Information</h2>
                <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-neutral-400">
                  <MapPin size={12} />
                  Philippines
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input required placeholder="First Name" className="border-b border-neutral-200 py-3 text-sm focus:border-black outline-none transition-colors uppercase font-bold tracking-tight" />
                <input required placeholder="Last Name" className="border-b border-neutral-200 py-3 text-sm focus:border-black outline-none transition-colors uppercase font-bold tracking-tight" />
                <input required placeholder="Email Address" type="email" className="md:col-span-2 border-b border-neutral-200 py-3 text-sm focus:border-black outline-none transition-colors uppercase font-bold tracking-tight" />
                
                {/* Region Selection */}
                <select 
                  required 
                  className="md:col-span-2 border-b border-neutral-200 py-3 text-sm focus:border-black outline-none transition-colors uppercase font-bold tracking-tight bg-white appearance-none cursor-pointer"
                  value={formData.regionCode}
                  onChange={(e) => {
                    const region = regionData.find(r => r.region_code === e.target.value);
                    setFormData({ ...formData, region: region.region_name, regionCode: e.target.value });
                  }}
                >
                  <option value="" disabled>Select Region</option>
                  {regionData.map(region => (
                    <option key={region.region_code} value={region.region_code}>{region.region_name}</option>
                  ))}
                </select>

                {/* Province Selection */}
                <select 
                  required 
                  disabled={!formData.regionCode}
                  className="border-b border-neutral-200 py-3 text-sm focus:border-black outline-none transition-colors uppercase font-bold tracking-tight bg-white appearance-none cursor-pointer disabled:opacity-30"
                  value={formData.provinceCode}
                  onChange={(e) => {
                    const province = provinceData.find(p => p.province_code === e.target.value);
                    setFormData({ ...formData, province: province.province_name, provinceCode: e.target.value });
                  }}
                >
                  <option value="" disabled>Select Province</option>
                  {provinceData.map(province => (
                    <option key={province.province_code} value={province.province_code}>{province.province_name}</option>
                  ))}
                </select>

                {/* City Selection */}
                <select 
                  required 
                  disabled={!formData.provinceCode}
                  className="border-b border-neutral-200 py-3 text-sm focus:border-black outline-none transition-colors uppercase font-bold tracking-tight bg-white appearance-none cursor-pointer disabled:opacity-30"
                  value={formData.cityCode}
                  onChange={(e) => {
                    const city = cityData.find(c => c.city_code === e.target.value);
                    setFormData({ ...formData, city: city.city_name, cityCode: e.target.value });
                  }}
                >
                  <option value="" disabled>Select City / Municipality</option>
                  {cityData.map(city => (
                    <option key={city.city_code} value={city.city_code}>{city.city_name}</option>
                  ))}
                </select>

                {/* Barangay Selection */}
                <select 
                  required 
                  disabled={!formData.cityCode}
                  className="border-b border-neutral-200 py-3 text-sm focus:border-black outline-none transition-colors uppercase font-bold tracking-tight bg-white appearance-none cursor-pointer disabled:opacity-30"
                  value={formData.barangay}
                  onChange={(e) => setFormData({ ...formData, barangay: e.target.value })}
                >
                  <option value="" disabled>Select Barangay</option>
                  {barangayData.map(brgy => (
                    <option key={brgy.brgy_code} value={brgy.brgy_name}>{brgy.brgy_name}</option>
                  ))}
                </select>

                <input 
                  required 
                  placeholder="Postal Code" 
                  className="border-b border-neutral-200 py-3 text-sm focus:border-black outline-none transition-colors uppercase font-bold tracking-tight"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                />
                <input required placeholder="Street Address / House No." className="md:col-span-2 border-b border-neutral-200 py-3 text-sm focus:border-black outline-none transition-colors uppercase font-bold tracking-tight" />
              </div>
            </div>

            <div className="space-y-8">
              <h2 className="text-xs font-black uppercase tracking-[0.3em] border-b border-neutral-100 pb-4">Payment Method</h2>
              <div className="p-6 border-2 border-black flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <CreditCard size={24} />
                  <span className="text-xs font-black uppercase tracking-widest">Cash on Delivery</span>
                </div>
                <div className="w-4 h-4 rounded-full border-4 border-black bg-white"></div>
              </div>
              <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Secure encrypted checkout. Your data remains private.</p>
            </div>

            <button 
              disabled={isProcessing}
              className="w-full bg-black text-white py-6 text-xs font-black uppercase tracking-[0.3em] hover:bg-neutral-800 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
            >
              {isProcessing ? "PROCESSING CODE..." : "CONFIRM ORDER"}
            </button>
          </form>

          {/* Order Summary */}
          <div className="bg-neutral-50 p-8 md:p-12 space-y-8">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] border-b border-neutral-200 pb-4">Order Summary</h2>
            
            <div className="space-y-6">
              {cart.map((item) => (
                <div key={item.id + item.selectedSize} className="flex gap-4">
                  <div className="relative w-16 aspect-[3/4] bg-neutral-200 overflow-hidden">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-grow flex flex-col justify-center">
                    <h4 className="text-[10px] font-black uppercase italic tracking-tighter">{item.name}</h4>
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">QTY: {item.quantity} {item.selectedSize && `| SIZE: ${item.selectedSize}`}</p>
                    <p className="text-[10px] font-black uppercase mt-1">₱{(item.price * item.quantity).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-8 border-t border-neutral-200">
              <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-neutral-500">
                <span>Shipping</span>
                <span>FREE</span>
              </div>
              <div className="flex justify-between text-lg font-black uppercase italic tracking-tighter border-t border-neutral-200 pt-4">
                <span>Total</span>
                <span>₱{cartTotal.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-8">
              <div className="flex items-center gap-3 text-[8px] font-black uppercase tracking-widest text-neutral-400">
                <ShieldCheck size={16} />
                Authentic Code
              </div>
              <div className="flex items-center gap-3 text-[8px] font-black uppercase tracking-widest text-neutral-400">
                <Truck size={16} />
                Tracked Shipping
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
