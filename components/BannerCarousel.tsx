"use client";

import { useEffect, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

interface Banner {
  title: string;
  description?: string;
  imageUrl: string;
  linkUrl?: string;
}

export default function BannerCarousel() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const res = await fetch('/api/banners');
      const data = await res.json();
      setBanners(data.banners);
    } catch (err) {
      console.error('Failed to fetch banners:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="h-64 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="w-full">
      <Carousel
        autoPlay
        infiniteLoop
        showStatus={false}
        showIndicators={false}
        showThumbs={false}
        interval={5000}
      >
        {banners.map((banner) => (
          <div key={banner.imageUrl} className="relative h-[400px]">
            <img
              src={banner.imageUrl}
              alt={banner.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-6">
              <h2 className="text-2xl font-bold mb-2">{banner.title}</h2>
              {banner.description && (
                <p className="text-lg">{banner.description}</p>
              )}
              {banner.linkUrl && (
                <a
                  href={banner.linkUrl}
                  className="mt-4 inline-block px-6 py-3 bg-white text-black rounded-full hover:bg-gray-100"
                >
                  Shop Now
                </a>
              )}
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
}
