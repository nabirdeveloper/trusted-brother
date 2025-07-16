"use client";

import { useEffect, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

interface CategorySlider {
  title: string;
  description?: string;
  imageUrl: string;
  linkUrl?: string;
  category: {
    _id: string;
    name: string;
  };
}

export default function CategorySliderCarousel() {
  const [sliders, setSliders] = useState<CategorySlider[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSliders();
  }, []);

  const fetchSliders = async () => {
    try {
      const res = await fetch('/api/category-sliders');
      const data = await res.json();
      setSliders(data.sliders);
    } catch (err) {
      console.error('Failed to fetch category sliders:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="h-64 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4">Categories</h2>
      <Carousel
        autoPlay
        infiniteLoop
        showStatus={false}
        showIndicators={false}
        showThumbs={false}
        interval={5000}
        className="bg-gray-100 p-4 rounded-lg"
      >
        {sliders.map((slider) => (
          <div key={slider.imageUrl} className="relative">
            <div className="relative h-[300px]">
              <img
                src={slider.imageUrl}
                alt={`${slider.category.name} - ${slider.title}`}
                className="w-full h-full object-cover rounded-lg"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
                <h3 className="text-xl font-bold mb-2">{slider.category.name}</h3>
                <h4 className="text-lg font-semibold mb-2">{slider.title}</h4>
                {slider.description && (
                  <p className="text-sm">{slider.description}</p>
                )}
                {slider.linkUrl && (
                  <a
                    href={slider.linkUrl}
                    className="mt-4 inline-block px-6 py-3 bg-white text-black rounded-full hover:bg-gray-100"
                  >
                    View Category
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
}
