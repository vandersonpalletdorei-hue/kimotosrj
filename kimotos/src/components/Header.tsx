import React from 'react';
import { ShoppingCart, Search, User, MapPin, Phone, HelpCircle } from 'lucide-react';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenAdmin: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function Header({
  cartCount,
  onOpenCart,
  onOpenAdmin,
  searchQuery,
  onSearchChange
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-150 shadow-xs">
      {/* Top bar: Contact & Local store info */}
      <div className="bg-slate-900 text-white text-[11px] py-2 px-4 font-sans font-medium">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5 opacity-90">
              <Phone className="w-3.5 h-3.5 text-emerald-500" />
              (24) 99835-9972 (WhatsApp) - Consultora de vendas Cristiane
            </span>
          </div>
          <div className="flex items-center gap-4 text-gray-300">
            <span className="hover:text-white transition-colors cursor-pointer">Como comprar</span>
            <span className="opacity-40">|</span>
            <span className="hover:text-white transition-colors cursor-pointer flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5" /> Suporte
            </span>
          </div>
        </div>
      </div>

      {/* Main header block */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand logo (Kimotos style) */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => window.location.reload()}>
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-white font-black text-xl shadow-md rotate-[-4deg] transition-transform hover:rotate-0">
              K
            </div>
            <div>
              <h1 className="text-xl font-black uppercase tracking-tighter text-slate-900 leading-tight flex items-center gap-1">
                <span>KIMOTOS</span>
              </h1>
              <p className="text-[10px] text-gray-500 font-extrabold uppercase tracking-widest">Motopeças & Acessórios</p>
            </div>
          </div>

          {/* Quick buttons on responsive screens */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={onOpenAdmin}
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-full transition-colors relative"
              aria-label="Acesso Admin"
            >
              <User className="w-5.5 h-5.5" />
            </button>
            
            <button
              onClick={onOpenCart}
              className="p-2 text-slate-900 hover:bg-slate-100 rounded-full transition-colors relative"
              aria-label="Carrinho"
            >
              <ShoppingCart className="w-5.5 h-5.5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-600 text-white font-black text-[9px] w-5 h-5 rounded-full flex items-center justify-center animate-pulse border-2 border-white">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Live Search bar */}
        <div className="w-full md:max-w-xl relative flex items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Pesquise por capacetes, pneus, marcas (Pirelli, LS2)..."
            className="w-full px-4 py-2.5 pl-11 bg-slate-100/90 focus:bg-white border border-transparent focus:border-red-500 text-xs font-semibold text-slate-800 placeholder-slate-500 rounded-lg outline-hidden transition-all shadow-inner"
          />
          <Search className="w-4.5 h-4.5 text-slate-550 absolute left-4 pointer-events-none" />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-4 text-[10px] font-black uppercase text-gray-400 hover:text-slate-800"
            >
              Limpar
            </button>
          )}
        </div>

        {/* Action icons for desktop */}
        <div className="hidden md:flex items-center gap-4">
          {/* Admin link */}
          <button
            onClick={onOpenAdmin}
            className="px-3.5 py-2 hover:bg-slate-50 border border-transparent hover:border-slate-200 text-xs font-bold text-slate-700 rounded-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <User className="w-4.5 h-4.5 text-slate-500" />
            <span>Área do Lojista</span>
          </button>

          {/* Cart triggers */}
          <button
            onClick={onOpenCart}
            className="bg-slate-900 hover:bg-red-600 text-white px-4 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-2.5 transition-all shadow-md cursor-pointer relative"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Meu Carrinho</span>
            <span className="bg-white text-slate-900 font-extrabold text-[10px] px-2 py-0.5 rounded-md min-w-[20px] text-center">
              {cartCount}
            </span>
          </button>
        </div>

      </div>
    </header>
  );
}
