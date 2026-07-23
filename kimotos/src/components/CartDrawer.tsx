import React, { useState } from 'react';
import { CartItem } from '../types';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Truck, Loader2 } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, selectedSize: string | undefined, newQty: number) => void;
  onRemoveItem: (productId: string, selectedSize: string | undefined) => void;
  onCheckout: (shippingCost: number, shippingName: string) => void;
  isCheckingOut?: boolean;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  isCheckingOut = false
}: CartDrawerProps) {
  const [shippingCep, setShippingCep] = useState('');
  const [shippingOptions, setShippingOptions] = useState<any[]>([]);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  const [selectedShippingId, setSelectedShippingId] = useState<number | null>(null);
  const [shippingError, setShippingError] = useState('');

  if (!isOpen) return null;

  // Calculate Subtotal
  const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  
  // Free Shipping target logic
  const freeShippingTarget = 400; // Frete grátis para compras acima de R$400,00
  const progressToFree = Math.min((subtotal / freeShippingTarget) * 100, 100);
  const leftForFree = freeShippingTarget - subtotal;

  const handleCalculateShipping = async () => {
    if (shippingCep.replace(/\D/g, '').length !== 8) {
      setShippingError('Digite um CEP válido com 8 dígitos.');
      return;
    }
    
    setShippingError('');
    setIsCalculatingShipping(true);
    
    try {
      const response = await fetch('/api/shipping/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination_cep: shippingCep,
          items: cartItems.map(item => ({
            id: item.product.id,
            quantity: item.quantity,
            unit_price: item.product.price,
            weight: 0.5, // 500g default
            width: 15,
            height: 15,
            length: 15
          }))
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao calcular frete');
      }
      
      setShippingOptions(data);
      if (data.length > 0) {
        setSelectedShippingId(data[0].id);
      }
    } catch (err: any) {
      setShippingError(err.message || 'Erro ao calcular frete. Tente novamente mais tarde.');
    } finally {
      setIsCalculatingShipping(false);
    }
  };

  const getSelectedShippingCost = () => {
    if (subtotal >= freeShippingTarget) return 0;
    if (selectedShippingId && shippingOptions.length > 0) {
      const opt = shippingOptions.find(o => o.id === selectedShippingId);
      return opt ? parseFloat(opt.price) : 0;
    }
    return 0; // Default or when no shipping calculated yet
  };
  
  const getSelectedShippingName = () => {
    if (subtotal >= freeShippingTarget) return 'Frete Grátis (Promocional)';
    if (selectedShippingId && shippingOptions.length > 0) {
      const opt = shippingOptions.find(o => o.id === selectedShippingId);
      return opt ? `${opt.company?.name || 'Transportadora'} - ${opt.name}` : 'Frete Padrão';
    }
    return 'Frete Padrão';
  };

  const shippingCost = getSelectedShippingCost();
  const finalTotal = subtotal + shippingCost;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl flex flex-col h-full transform transition-transform duration-300">
        
        {/* Header drawer */}
        <div className="p-4 border-b border-gray-150 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-red-600" />
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">Seu Carrinho</h2>
            <span className="bg-red-50 text-red-600 font-extrabold text-[10px] px-2 py-0.5 rounded border border-red-100">
              {cartItems.reduce((acc, item) => acc + item.quantity, 0)} itens
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 px-2.5 bg-slate-200 hover:bg-slate-300 rounded text-slate-800 text-[10px] font-black uppercase tracking-wide cursor-pointer flex items-center gap-1.5"
          >
            <span>Fechar</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Free Shipping Alert banner */}
        {cartItems.length > 0 && (
          <div className="bg-slate-900 text-white p-3.5 text-center">
            {subtotal >= freeShippingTarget ? (
              <p className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">
                🎉 Parabéns! Seu pedido garantiu Frete Grátis!
              </p>
            ) : (
              <div>
                <p className="text-[10px] font-semibold text-gray-300">
                  Faltam apenas <strong className="text-white">R$ {leftForFree.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong> para ganhar <strong className="text-emerald-400">Frete Grátis!</strong>
                </p>
                <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div className="bg-red-600 h-1.5 transition-all duration-500" style={{ width: `${progressToFree}%` }} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Selected List scroll panel */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 gap-3">
              <div className="bg-red-50 text-red-600 p-4 rounded-full">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-slate-900 font-bold text-sm uppercase tracking-wide">O carrinho está vazio</h3>
                <p className="text-gray-400 text-xs mt-1 leading-relaxed">Explore nosso catálogo completo e comece a adicionar motopeças de alta performance!</p>
              </div>
              <button
                onClick={onClose}
                className="mt-4 bg-slate-900 hover:bg-red-600 text-white font-black uppercase tracking-wider text-[10px] px-5 py-3 rounded-md cursor-pointer transition-colors"
              >
                Voltar às Compras
              </button>
            </div>
          ) : (
            cartItems.map((item, index) => (
              <div
                key={`${item.product.id}-${item.selectedSize || 'nosize'}-${index}`}
                className="flex gap-3 bg-slate-50 border border-slate-150 p-3 rounded-lg relative hover:border-slate-300 transition-colors"
              >
                {/* Thumb */}
                <div className="w-16 h-16 bg-white border border-slate-200 rounded overflow-hidden shrink-0">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                {/* Info block */}
                <div className="flex-1 min-w-0 pr-8">
                  <span className="text-[9px] uppercase font-black tracking-wider text-slate-400 block leading-none">
                    {item.product.brand}
                  </span>
                  <h4 className="text-[11px] font-bold text-slate-800 line-clamp-1 mt-0.5 leading-tight">
                    {item.product.name}
                  </h4>
                  
                  {item.selectedSize && (
                    <span className="inline-block mt-1 bg-red-100 text-red-700 font-extrabold text-[9px] uppercase px-1.5 py-0.5 rounded border border-red-200">
                      Tamanho: {item.selectedSize}
                    </span>
                  )}

                  {/* Pricing and Qty adjust */}
                  <div className="flex items-center justify-between gap-2 mt-3">
                    <span className="text-xs font-black text-slate-900">
                      R$ {item.product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>

                    <div className="flex items-center border border-slate-200 rounded-md bg-white">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.selectedSize, item.quantity - 1)}
                        className="p-1 px-2 text-slate-500 hover:text-red-500 hover:bg-slate-50 transition-colors cursor-pointer"
                        disabled={item.quantity <= 1}
                        aria-label="Diminuir unidade"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-[11px] font-extrabold align-middle text-slate-800 px-1">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.selectedSize, item.quantity + 1)}
                        className="p-1 px-2 text-slate-500 hover:text-red-500 hover:bg-slate-50 transition-colors cursor-pointer"
                        disabled={item.quantity >= item.product.stock}
                        aria-label="Aumentar unidade"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Remove button absolute position */}
                <button
                  onClick={() => onRemoveItem(item.product.id, item.selectedSize)}
                  className="absolute top-3 right-3 text-gray-400 hover:text-red-600 transition-colors cursor-pointer p-1 rounded-sm"
                  title="Remover do carrinho"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}

        {/* Shipping Calculation */}
        {cartItems.length > 0 && subtotal < freeShippingTarget && (
          <div className="pt-4 mt-4 border-t border-gray-150">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-red-600" />
                Calcular Frete
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={9}
                  placeholder="00000-000"
                  value={shippingCep}
                  onChange={(e) => {
                    // mask: 00000-000
                    let val = e.target.value.replace(/\D/g, '');
                    if (val.length > 5) val = val.substring(0, 5) + '-' + val.substring(5, 8);
                    setShippingCep(val);
                  }}
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-red-500"
                />
                <button
                  onClick={handleCalculateShipping}
                  disabled={isCalculatingShipping || shippingCep.length < 8}
                  className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50 flex items-center justify-center min-w-[80px]"
                >
                  {isCalculatingShipping ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Calcular'}
                </button>
              </div>
              
              {shippingError && (
                <p className="text-[10px] text-red-600 font-medium mt-1">{shippingError}</p>
              )}
              
              {shippingOptions.length > 0 && !isCalculatingShipping && (
                <div className="mt-3 space-y-2">
                  {shippingOptions.map((opt) => (
                    <label key={opt.id} className={`flex items-start gap-3 p-2 border rounded-md cursor-pointer transition-colors ${selectedShippingId === opt.id ? 'border-red-500 bg-red-50/50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input
                        type="radio"
                        name="shipping"
                        className="mt-1 accent-red-600"
                        checked={selectedShippingId === opt.id}
                        onChange={() => setSelectedShippingId(opt.id)}
                      />
                      <div className="flex-1 flex justify-between items-center text-xs">
                        <div>
                          <p className="font-bold text-slate-800">{opt.company?.name} - {opt.name}</p>
                          <p className="text-slate-500 text-[10px]">Entrega em até {opt.delivery_time} dias úteis</p>
                        </div>
                        <span className="font-bold text-slate-700">R$ {parseFloat(opt.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        </div>

        {/* Footer drawer checkout block */}
        {cartItems.length > 0 && (
          <div className="p-4 border-t border-gray-150 bg-slate-50">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-slate-500 text-xs">
                <span>Subtotal dos itens</span>
                <span className="font-semibold text-slate-700">
                  R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between text-slate-500 text-xs">
                <span>Frete Estimado</span>
                {subtotal >= freeShippingTarget ? (
                  <span className="text-emerald-600 font-extrabold uppercase text-[10px]">Grátis</span>
                ) : (
                  <span className="font-semibold text-slate-700">
                    {shippingOptions.length > 0 && selectedShippingId ? `R$ ${shippingCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'Calcule o frete'}
                  </span>
                )}
              </div>
              <hr className="border-gray-200" />
              <div className="flex justify-between items-center text-slate-900">
                <span className="text-xs font-black uppercase tracking-wider">Valor Total</span>
                <span className="text-sm font-black text-slate-900">
                  R$ {finalTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <button
              onClick={() => onCheckout(shippingCost, getSelectedShippingName())}
              disabled={isCheckingOut || (subtotal < freeShippingTarget && !selectedShippingId)}
              className={`w-full ${isCheckingOut ? 'bg-slate-400' : 'bg-red-600 hover:bg-red-700'} text-white font-extrabold uppercase tracking-widest text-xs py-3 px-4 rounded-lg flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-lg hover:shadow-xl active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <span>{isCheckingOut ? 'Aguarde...' : 'Finalizar Compra'}</span>
              {!isCheckingOut && <ArrowRight className="w-4.5 h-4.5" />}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
