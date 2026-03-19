import { useState, useEffect } from "react";
import { regions, provinces, cities, barangays } from "select-philippines-address";
import { getZipCode } from "@/data/ph-locations";
import usePostalPH from "use-postal-ph";

interface RegionData {
  region_code: string;
  region_name: string;
}

interface ProvinceData {
  province_code: string;
  province_name: string;
}

interface CityData {
  city_code: string;
  city_name: string;
}

interface BarangayData {
  brgy_code: string;
  brgy_name: string;
}

export function useCheckout(clearCart: () => void) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  const { fetchDataLists } = usePostalPH();

  const [regionData, setRegionData] = useState<RegionData[]>([]);
  const [provinceData, setProvinceData] = useState<ProvinceData[]>([]);
  const [cityData, setCityData] = useState<CityData[]>([]);
  const [barangayData, setBarangayData] = useState<BarangayData[]>([]);

  const [formData, setFormData] = useState({
    region: "",
    regionCode: "",
    province: "",
    provinceCode: "",
    city: "",
    cityCode: "",
    barangay: "",
    postalCode: ""
  });

  // Load regions on mount
  useEffect(() => {
    regions().then((res: RegionData[]) => setRegionData(res));
  }, []);

  // Load provinces when region changes
  useEffect(() => {
    if (formData.regionCode) {
      provinces(formData.regionCode).then((res: ProvinceData[]) => setProvinceData(res));
    } else {
      if (provinceData.length > 0) {
        setTimeout(() => setProvinceData([]), 0);
      }
    }
  }, [formData.regionCode, provinceData.length]);

  // Load cities when province changes
  useEffect(() => {
    if (formData.provinceCode) {
      cities(formData.provinceCode).then((res: CityData[]) => setCityData(res));
    } else {
      if (cityData.length > 0) {
        setTimeout(() => setCityData([]), 0);
      }
    }
  }, [formData.provinceCode, cityData.length]);

  // Load barangays when city changes
  useEffect(() => {
    if (formData.cityCode) {
      barangays(formData.cityCode).then((res: BarangayData[]) => setBarangayData(res));
    } else {
      if (barangayData.length > 0) {
        setTimeout(() => setBarangayData([]), 0);
      }
    }
  }, [formData.cityCode, barangayData.length]);

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const region = regionData.find((r) => r.region_code === e.target.value);
    if (region) {
      setFormData((prev) => ({
        ...prev,
        region: region.region_name,
        regionCode: e.target.value,
        province: "",
        provinceCode: "",
        city: "",
        cityCode: "",
        barangay: "",
        postalCode: ""
      }));
    }
  };

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const province = provinceData.find((p) => p.province_code === e.target.value);
    if (province) {
      setFormData((prev) => ({
        ...prev,
        province: province.province_name,
        provinceCode: e.target.value,
        city: "",
        cityCode: "",
        barangay: "",
        postalCode: ""
      }));
    }
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const city = cityData.find((c) => c.city_code === e.target.value);
    if (city) {
      let foundCode = getZipCode(city.city_name);

      // If not in manual fast-lookup list, use the comprehensive library
      if (!foundCode) {
        const cleanName = city.city_name
          .replace(/ City$/i, "")
          .replace(/ Municipality$/i, "")
          .trim();
        const res = (
          fetchDataLists as (args: { search: string }) => { data: { post_code: number }[] }
        )({ search: cleanName });
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
        postalCode: foundCode || ""
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

  return {
    isProcessing,
    isSuccess,
    showAnimation,
    formData,
    setFormData,
    regionData,
    provinceData,
    cityData,
    barangayData,
    handleRegionChange,
    handleProvinceChange,
    handleCityChange,
    handleSubmit
  };
}
