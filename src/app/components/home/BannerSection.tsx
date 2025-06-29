"use client";
import { useEffect, useState } from "react";
import BannerCarousel from "../banners/BannerCarousel";
import { getBanners } from "../../services/api/banner";

type Banner = {
  id: number;
  title: string | null;
  image: string;
  link: string | null;
  position: number;
  status: number;
};

const BannerSection = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await getBanners();
        setBanners(res.data);
      } catch (err) {
        console.error("Lỗi khi tải banner:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  if (loading) return null;
  if (!banners || banners.length === 0) return null;

  return <BannerCarousel banners={banners} />;
};

export default BannerSection;
