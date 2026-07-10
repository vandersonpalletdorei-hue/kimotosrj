import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Fuel, ArrowRight } from "lucide-react";
import CastrolBanner from "../assets/images/castrol_kimotos_banner_1782415795695.jpg";

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Chegou os novos Capacetes Liberty3 Jet!",
      subtitle:
        "Confira a linha de capacetes com design aerodinâmico e estilo incomparável para o seu dia a dia.",
      caption: "Lançamento Exclusivo",
      image:
        "https://kimotos.netlify.app/assets/banner_capacetes_1781547169383-DZX5sPEQ.jpg",
      cta: "Ver Capacetes",
    },
    {
      title: "Kimotos - Oficina, Peças & Acessórios",
      subtitle:
        "A maior e mais completa loja da região. Excelência para Honda, Yamaha, Suzuki e muito mais!",
      caption: "Estrutura Completa",
      image:
        "https://kimotos.netlify.app/assets/banner_kimotos_1781547189632-Bqc_XeQY.jpg",
      cta: "Ver todos os Produtos",
    },
    {
      title: "O Melhor Para Sua Moto, Máxima Performance!",
      subtitle:
        "Castrol parceira oficial Kimotos. Proteção superior, mais vida útil e desempenho máximo em qualquer condição.",
      caption: "Parceira Oficial",
      image: CastrolBanner,
      cta: "Ver Produtos Castrol",
    },
    {
      title: "Dê uma olhada nos melhores pneus para sua moto!",
      subtitle:
        "Lançamentos exclusivos e ofertas imperdíveis para garantir a máxima segurança em duas rodas.",
      caption: "Promoções Imperdíveis",
      image:
        "https://kimotos.netlify.app/assets/banner_pneus_1781547154840-B9RODW4U.jpg",
      cta: "Ver Pneus",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative w-full bg-slate-900 group overflow-hidden shadow-sm">
      {/* Invisible placeholder to establish native height based on aspect ratio */}
      <img
        src={slides[0].image}
        alt="placeholder"
        className="w-full h-auto invisible"
        style={{ maxWidth: "100%" }}
      />
      {/* Slides tracks */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* Back imagery */}
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover object-center"
            style={{ maxWidth: "100%" }}
          />
        </div>
      ))}

      {/* Buttons */}
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

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
        {slides.map((_, index) => (
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
