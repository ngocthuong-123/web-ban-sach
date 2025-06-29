"use client";
import { getImageURL } from "@/app/config";
import { useEffect, useState } from "react";
import Image from "next/image";

type Banner = {
  id: number;
  title: string | null;
  image: string;
  link: string | null;
};

type Props = {
  banners: Banner[];
};

const BannerCarousel = ({ banners }: Props) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 2) % banners.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [banners.length]);

  if (banners.length === 0) return null;

  const visibleBanners = [
    banners[current],
    banners[(current + 1) % banners.length],
  ];

  return (
    <div className="relative w-full h-auto overflow-hidden shadow-md mb-6">
      <div className="flex transition-all duration-700 gap-2">
        {visibleBanners.map((banner) => (
          <a
            key={banner.id}
            href={banner.link || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="w-1/2"
          >
            <div className="relative w-full aspect-[841/359]">
              <Image
                src={getImageURL(banner.image || "")}
                alt={banner.title || ""}
                fill
                loading="lazy"
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default BannerCarousel;
