import React from "react";
import { Product } from "../types";
import { Star, ShoppingCart, Eye } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({
  product,
  onSelectProduct,
  onAddToCart,
}: ProductCardProps) {
  // Calculate discount percentage if original price is available
  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100,
        )
      : 0;

  return (
    <div className="bg-white border border-slate-150 rounded-xl overflow-hidden shadow-xs hover:shadow-md hover:border-slate-300 transition-all group flex flex-col h-full relative">
      {/* Absolute Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
        {product.isNew && (
          <span className="bg-emerald-500 text-white font-extrabold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded shadow-sm">
            Novidade
          </span>
        )}
        {discountPercent > 0 && (
          <span className="bg-red-600 text-white font-extrabold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded shadow-sm">
            {discountPercent}% OFF
          </span>
        )}
        {product.freeShipping && (
          <span className="bg-slate-900 text-white font-extrabold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded shadow-sm">
            Frete Grátis
          </span>
        )}
      </div>

      {/* Product Image Thumbnail & Hover trigger */}
      <div
        className="relative aspect-square overflow-hidden bg-white border-b border-slate-100 cursor-pointer"
        onClick={() => onSelectProduct(product)}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain p-4 object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Overlay hover effect */}
        <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectProduct(product);
            }}
            className="p-2.5 bg-white text-slate-900 rounded-full hover:bg-red-600 hover:text-white transition-colors shadow-lg cursor-pointer"
            title="Visualização Rápida"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content description & Rating */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Brand & Subcategory */}
          <div className="flex items-center justify-between gap-1 text-[10px] text-gray-500 uppercase font-black tracking-wider">
            <span>{product.brand || "Original"}</span>
            <span>{product.subcategory || ""}</span>
          </div>

          {/* Title */}
          <h3
            onClick={() => onSelectProduct(product)}
            className="text-xs font-bold text-slate-800 hover:text-red-600 mt-1 cursor-pointer line-clamp-2 h-8 leading-tight transition-colors"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Stars rating */}
          <div className="flex items-center gap-1 mt-2">
            <div className="flex items-center text-amber-500">
              <Star className="w-3 h-3 fill-amber-500" />
            </div>
            <span className="text-[10px] font-bold text-slate-700">
              {product.rating.toFixed(1)}
            </span>
            <span className="text-[10px] text-gray-400">
              ({product.reviewsCount})
            </span>
          </div>
        </div>

        {/* Pricing details & add to cart */}
        <div>
          <div className="flex flex-col gap-0.5">
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[10px] text-gray-400 line-through">
                R${" "}
                {product.originalPrice.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            )}
            <div className="flex items-baseline gap-1">
              <span className="text-[13px] font-black text-slate-900">
                R${" "}
                {product.price.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
              <span className="text-[9px] text-emerald-600 font-black uppercase tracking-wider">
                no PIX
              </span>
            </div>
            <p className="text-[9px] text-gray-500">
              ou 4x de R$ {(product.price / 4).toFixed(2)} sem juros
            </p>
          </div>

          {/* Stock indicator or Add to Cart button */}
          <div className="mt-3.5">
            {product.stock > 0 ? (
              <button
                onClick={() => onAddToCart(product)}
                className="w-full bg-slate-900 hover:bg-red-600 text-white font-extrabold uppercase tracking-wider text-[10px] py-2 px-3 rounded-md flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs border border-transparent hover:border-red-600"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Adicionar</span>
              </button>
            ) : (
              <button
                disabled
                className="w-full bg-gray-100 text-gray-400 font-extrabold uppercase tracking-wider text-[10px] py-2 px-3 rounded-md cursor-not-allowed border border-gray-150"
              >
                Fora de Estoque
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
