import React, { useState } from 'react';
import { Product } from '../types';
import { X, Star, Shield, HelpCircle, ShoppingCart } from 'lucide-react';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, size?: string) => void;
}

export default function QuickViewModal({
  product,
  onClose,
  onAddToCart
}: QuickViewModalProps) {
  if (!product) return null;

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews'>('desc');

  const handleAdd = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      alert('Por favor, selecione um tamanho antes de adicionar ao carrinho!');
      return;
    }
    onAddToCart(product, selectedSize);
    onClose();
  };

  // Mock comments
  const comments = [
    { name: 'Marcos Roberto', note: 5, date: '12/06/2026', msg: 'Excelente acabamento, muito resistente e leve. Recomendo muito.' },
    { name: 'Gisele Alves', note: 4, date: '04/05/2026', msg: 'Ótimo produto, encaixou perfeitamente. O design é agressivo e bonito.' }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 font-sans">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs" onClick={onClose} />

      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl relative overflow-hidden z-10 border border-slate-150 flex flex-col max-h-[90vh]">
        
        {/* Close Button on Top Margin */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer transition-colors"
          aria-label="Fechar"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Core Layout */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Image display */}
            <div className="space-y-4">
              <div className="aspect-square bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-xs relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover object-center"
                />
                <span className="absolute top-3 left-3 bg-slate-900/90 text-white font-extrabold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded shadow-xs">
                  {product.brand}
                </span>
              </div>
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((img, i) => (
                    <div key={i} className="aspect-square bg-slate-50 border border-slate-200 rounded-lg overflow-hidden cursor-pointer hover:border-red-600 transition-colors">
                      <img src={img} alt={`Detalhe ${i}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Config particulars panels */}
            <div className="flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-black tracking-widest text-red-600 block">
                  {product.brand} • {product.subcategory || 'Original'}
                </span>
                
                <h3 className="text-sm md:text-base font-black text-slate-950 leading-tight mt-1">
                  {product.name}
                </h3>

                {/* Rating summary */}
                <div className="flex items-center gap-1.5 mt-3">
                  <div className="flex items-center text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                  </div>
                  <span className="text-xs font-black text-slate-700">{product.rating.toFixed(1)}</span>
                  <span className="text-xs text-gray-400">({product.reviewsCount} avaliações)</span>
                </div>

                {/* Pricing panel */}
                <div className="mt-4 bg-slate-50/80 p-3.5 border border-slate-100 rounded-xl">
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-xs text-slate-400 line-through">
                      R$ {product.originalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  )}
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-base font-black text-slate-950">
                      R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-extrabold bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded">
                      À vista no PIX
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1">Ou parcelado em até 4x de R$ {(product.price / 4).toFixed(2)} sem juros</p>
                </div>

                {/* Sizes configurations if applicable */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="mt-5">
                    <label className="block text-[10px] font-black text-slate-600 uppercase mb-2">Selecione o Tamanho:</label>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => setSelectedSize(sz)}
                          className={`min-w-[40px] h-[40px] border px-2 text-xs font-black uppercase rounded-lg cursor-pointer transition-all ${
                            selectedSize === sz
                              ? 'bg-red-600 text-white border-red-600 shadow-md'
                              : 'bg-white text-slate-800 border-slate-200 hover:border-slate-400'
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action indicators bottom */}
              <div className="mt-6 pt-5 border-t border-gray-150 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500 font-medium">Disponibilidade:</span>
                  {product.stock > 0 ? (
                    <span className="text-emerald-600 font-extrabold uppercase text-[10px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                      ✔ {product.stock} em estoque
                    </span>
                  ) : (
                    <span className="text-red-500 font-extrabold uppercase text-[10px] bg-red-50 px-2 py-0.5 rounded border border-red-100">
                      ✘ Fora de Estoque
                    </span>
                  )}
                </div>

                {product.stock > 0 ? (
                  <button
                    onClick={handleAdd}
                    className="w-full bg-slate-900 hover:bg-red-600 text-white font-black uppercase tracking-wider text-xs py-3 px-4 rounded-lg flex items-center justify-center gap-2.5 transition-all shadow-md active:scale-98 cursor-pointer"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Adicionar ao Meu Carrinho</span>
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full bg-gray-100 text-gray-400 font-bold uppercase tracking-wider text-xs py-3 px-4 rounded-lg cursor-not-allowed border border-gray-200"
                  >
                    Indisponível no Momento
                  </button>
                )}
              </div>

            </div>

          </div>

          {/* Navigation specifications/description tabs */}
          <div className="mt-8 border-t border-slate-150 pt-6">
            <div className="flex border-b border-slate-200 text-xs font-extrabold uppercase tracking-wider space-x-6">
              <button
                onClick={() => setActiveTab('desc')}
                className={`pb-3 focus:outline-hidden cursor-pointer ${
                  activeTab === 'desc' ? 'border-b-2 border-red-600 text-slate-900' : 'text-gray-400 hover:text-slate-700'
                }`}
              >
                Descrição Geral
              </button>
              <button
                onClick={() => setActiveTab('specs')}
                className={`pb-3 focus:outline-hidden cursor-pointer ${
                  activeTab === 'specs' ? 'border-b-2 border-red-600 text-slate-900' : 'text-gray-400 hover:text-slate-700'
                }`}
              >
                Ficha Técnica
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-3 focus:outline-hidden cursor-pointer ${
                  activeTab === 'reviews' ? 'border-b-2 border-red-600 text-slate-900' : 'text-gray-400 hover:text-slate-700'
                }`}
              >
                Avaliações ({product.reviewsCount})
              </button>
            </div>

            <div className="py-4 text-xs font-medium text-slate-700 leading-relaxed min-h-[120px]">
              {activeTab === 'desc' && (
                <p className="whitespace-pre-line">{product.description}</p>
              )}

              {activeTab === 'specs' && (
                product.attributes && Object.keys(product.attributes).length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 max-w-xl">
                    {Object.entries(product.attributes).map(([key, val]) => (
                      <div key={key} className="flex justify-between border-b pb-1">
                        <span className="font-extrabold uppercase text-[10px] text-gray-500">{key}</span>
                        <span className="text-slate-800 font-semibold">{val}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 italic">Produto original selado de fábrica. Informações técnicas padrões do fabricante.</p>
                )
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-4">
                  {comments.map((comment, idx) => (
                    <div key={idx} className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                      <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase">
                        <span>{comment.name}</span>
                        <span>{comment.date}</span>
                      </div>
                      <div className="flex items-center text-amber-500 gap-0.5 mt-1">
                        {Array.from({ length: comment.note }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-500" />
                        ))}
                      </div>
                      <p className="text-slate-600 mt-1.5">{comment.msg}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
