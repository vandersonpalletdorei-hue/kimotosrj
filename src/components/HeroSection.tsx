import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Banner } from "../types";

function BannerImage({ src, alt, fallbackSrc }: { src: string; alt: string; fallbackSrc: string }) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative w-full aspect-[4/3] md:aspect-[2/1] lg:aspect-[2.5/1] bg-slate-100 overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-200">
          <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
        </div>
      )}
      <img
        src={hasError ? fallbackSrc : src}
        alt={alt}
        loading="lazy"
        className={`w-full h-full object-cover cursor-pointer transition-opacity duration-500 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
      />
    </div>
  );
}

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
      {activeBanners.map((slide, index) => {
        const imageSrc = slide.image && slide.image.length > 5 ? slide.image : DEFAULT_BANNERS[index % DEFAULT_BANNERS.length];
        const fallbackSrc = DEFAULT_BANNERS[index % DEFAULT_BANNERS.length];

        return (
          <div
            key={index}
            className={`col-start-1 row-start-1 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            {/* As imagens dos banners originais já possuem texto, então removemos a camada de texto do código */}
            <BannerImage 
              src={imageSrc} 
              alt={slide.title || "Banner"} 
              fallbackSrc={fallbackSrc} 
            />
          </div>
        );
      })}
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
