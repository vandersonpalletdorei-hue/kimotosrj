import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Banner } from "../types";

interface HeroSectionProps {
  banners: Banner[];
}

export default function HeroSection({ banners }: HeroSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Use only active banners
  const activeBanners = banners.filter(b => b.active);

  useEffect(() => {
    if (currentSlide >= activeBanners.length) {
      setCurrentSlide(0);
    }
  }, [activeBanners.length, currentSlide]);

  useEffect(() => {

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeBanners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [activeBanners.length]);

  const nextSlide = () => {
    if (activeBanners.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % activeBanners.length);
  };

  const prevSlide = () => {
    if (activeBanners.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
  };

  const DEFAULT_BANNERS = [
    "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=1200",
    "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=1200",
    "https://images.unsplash.com/photo-1590201146747-d352bc85fbcc?q=80&w=1200"
  ];

  if (activeBanners.length === 0) {
    return null;
  }

  return (
    <section className="relative w-full bg-slate-900 group overflow-hidden shadow-sm grid">
      {activeBanners.map((slide, index) => (
        <div
          key={index}
          className={`col-start-1 row-start-1 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
          }`}
        >
          {/* As imagens dos banners originais já possuem texto, então removemos a camada de texto do código */}
          <img
            src={slide.image && slide.image.length > 5 ? slide.image : DEFAULT_BANNERS[index % DEFAULT_BANNERS.length]}
            alt={slide.title}

            className="w-full h-full object-cover aspect-[4/3] md:aspect-[2/1] lg:aspect-[2.5/1] cursor-pointer"
            onError={(e) => {
              (e.target as HTMLImageElement).src = DEFAULT_BANNERS[index % DEFAULT_BANNERS.length];
            }}
          />
        </div>
      ))}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2.5 bg-slate-950/40 text-white hover:bg-red-600 rounded-full transition-colors opacity-0 group-hover:opacity-100"
        aria-label="Anterior"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2.5 bg-slate-950/40 text-white hover:bg-red-600 rounded-full transition-colors opacity-0 group-hover:opacity-100"
        aria-label="Próximo"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
        {activeBanners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              index === currentSlide ? "bg-red-500 w-6" : "bg-white/40"
            }`}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
