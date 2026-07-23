import React, { useState } from 'react';
import { CartItem } from '../types';
import { X, CheckCircle, Truck, Copy, Check, QrCode, CreditCard as CardIcon } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onClearCart: () => void;
}

type Step = 'delivery' | 'payment' | 'success';

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  onClearCart
}: CheckoutModalProps) {
  if (!isOpen) return null;

  const [step, setStep] = useState<Step>('delivery');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit'>('pix');
  const [copiedPix, setCopiedPix] = useState(false);

  // Address State
  const [address, setAddress] = useState({
    name: '',
    phone: '',
    cep: '',
    street: '',
    number: '',
    neighborhood: '',
    city: '',
    state: 'SP'
  });

  // Credit Card State
  const [card, setCard] = useState({
    number: '',
    holder: '',
    expiry: '',
    cvv: '',
    installments: '1'
  });

  const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const freeShipping = subtotal >= 400;
  const shippingFee = freeShipping ? 0 : 29.90;
  const total = subtotal + shippingFee;

  // Fake static PIX key
  const pixKey = '00020126580014BR.GOV.BCB.PIX0136vesojzznxnchywbcxfub0219KIMOTOS_E_COMMERCE5204000053039865405' + Math.floor(total) + '5802BR5915KIMOTOS_MOTO6009SAO_PAULO62070503***6304AD14';

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixKey);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2000);
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.name || !address.phone || !address.cep || !address.street || !address.number) {
      alert('Por favor, preencha todos os campos obrigatórios da entrega!');
      return;
    }
    setStep('payment');
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === 'credit') {
      if (!card.number || !card.holder || !card.expiry || !card.cvv) {
        alert('Por favor, preencha todos os dados do cartão de crédito!');
        return;
      }
    }
    setStep('success');
  };

  const handleFinishSuccess = () => {
    onClearCart();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs" onClick={onClose} />

      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl relative overflow-hidden z-10 border border-slate-150 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-gray-150 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">Finalização do Pedido</h3>
            <p className="text-[10px] text-gray-500 font-extrabold uppercase tracking-widest mt-0.5">Seguro & Criptografado</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-200 text-slate-600 rounded bg-slate-100 cursor-pointer"
            aria-label="Minimizar modal"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Steps indicator */}
        {step !== 'success' && (
          <div className="bg-slate-900 text-white py-3 px-6 flex justify-between items-center text-[10px] font-black uppercase tracking-widest border-b border-slate-800">
            <span className={`${step === 'delivery' ? 'text-red-500' : 'text-gray-400'}`}>1. Entrega</span>
            <span className="text-gray-600">&gt;&gt;</span>
            <span className={`${step === 'payment' ? 'text-red-500' : 'text-gray-400'}`}>2. Pagamento</span>
            <span className="text-gray-600">&gt;&gt;</span>
            <span className="text-gray-400">3. Confirmado</span>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {step === 'delivery' && (
            <form onSubmit={handleAddressSubmit} className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 border-b pb-1">Preencha seu endereço de entrega</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-600 uppercase mb-1">Nome Completo *</label>
                  <input
                    type="text"
                    required
                    value={address.name}
                    onChange={e => setAddress({ ...address, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-250 rounded-lg text-xs font-semibold focus:border-red-500 focus:outline-hidden"
                    placeholder="João da Silva"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-600 uppercase mb-1">Telefone WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={address.phone}
                    onChange={e => setAddress({ ...address, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-250 rounded-lg text-xs font-semibold focus:border-red-500 focus:outline-hidden"
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-600 uppercase mb-1">CEP de Entrega *</label>
                  <input
                    type="text"
                    required
                    value={address.cep}
                    onChange={e => setAddress({ ...address, cep: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-250 rounded-lg text-xs font-semibold focus:border-red-500 focus:outline-hidden"
                    placeholder="01000-000"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-extrabold text-slate-600 uppercase mb-1">Rua / Logradouro *</label>
                  <input
                    type="text"
                    required
                    value={address.street}
                    onChange={e => setAddress({ ...address, street: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-250 rounded-lg text-xs font-semibold focus:border-red-500 focus:outline-hidden"
                    placeholder="Av. Paulista"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-600 uppercase mb-1">Número *</label>
                  <input
                    type="text"
                    required
                    value={address.number}
                    onChange={e => setAddress({ ...address, number: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-250 rounded-lg text-xs font-semibold focus:border-red-500 focus:outline-hidden"
                    placeholder="1000"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-600 uppercase mb-1">Bairro *</label>
                  <input
                    type="text"
                    required
                    value={address.neighborhood}
                    onChange={e => setAddress({ ...address, neighborhood: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-250 rounded-lg text-xs font-semibold focus:border-red-500 focus:outline-hidden"
                    placeholder="Bela Vista"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-600 uppercase mb-1">Cidade / UF *</label>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      required
                      value={address.city}
                      onChange={e => setAddress({ ...address, city: e.target.value })}
                      className="w-full px-2 py-2 border border-slate-250 rounded-lg text-xs font-semibold focus:border-red-500 focus:outline-hidden"
                      placeholder="Brasil"
                    />
                    <input
                      type="text"
                      required
                      maxLength={2}
                      value={address.state}
                      onChange={e => setAddress({ ...address, state: e.target.value.toUpperCase() })}
                      className="w-12 px-1 py-2 border border-slate-250 rounded-lg text-xs font-bold text-center focus:border-red-500 focus:outline-hidden"
                      placeholder="SP"
                    />
                  </div>
                </div>
              </div>

              {/* Order total indicator inside step */}
              <div className="bg-slate-50 border border-slate-200 p-3 h-auto rounded-lg text-slate-600 mt-6 space-y-1.5">
                <div className="flex justify-between text-[11px] font-bold">
                  <span>Subtotal das peças:</span>
                  <span>R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-[11px] font-bold">
                  <span>Frete Expresso:</span>
                  <span>{freeShipping ? 'Grátis' : `R$ ${shippingFee.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}</span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between text-xs font-extrabold text-slate-900 uppercase">
                  <span>Total do Pedido:</span>
                  <span>R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-red-600 text-white font-black uppercase tracking-wider text-xs py-3 px-4 rounded-lg cursor-pointer transition-colors"
                >
                  Continuar para Pagamento
                </button>
              </div>
            </form>
          )}

          {step === 'payment' && (
            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 border-b pb-1">Selecione uma forma de pagamento</h4>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('pix')}
                  className={`p-3 border-2 rounded-xl flex flex-col items-center justify-center gap-1.5 font-bold uppercase text-[11px] transition-all cursor-pointer ${
                    paymentMethod === 'pix'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                      : 'border-slate-200 hover:border-slate-350 text-slate-700'
                  }`}
                >
                  <QrCode className="w-6 h-6 text-emerald-500" />
                  <span>PIX (Desconto)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('credit')}
                  className={`p-3 border-2 rounded-xl flex flex-col items-center justify-center gap-1.5 font-bold uppercase text-[11px] transition-all cursor-pointer ${
                    paymentMethod === 'credit'
                      ? 'border-red-500 bg-red-50 text-red-800'
                      : 'border-slate-200 hover:border-slate-350 text-slate-700'
                  }`}
                >
                  <CardIcon className="w-6 h-6 text-red-500" />
                  <span>Cartão de Crédito</span>
                </button>
              </div>

              {paymentMethod === 'pix' ? (
                <div className="bg-slate-50 border border-emerald-150 p-4 rounded-xl space-y-4 text-center mt-6">
                  <div className="bg-white p-3 border-2 border-slate-100 rounded-lg mx-auto w-36 h-36 flex items-center justify-center shadow-xs">
                    {/* SVG Pix simulated QR code */}
                    <svg className="w-full h-full text-slate-900" viewBox="0 0 100 100">
                      <rect width="10" height="10" x="5" y="5" />
                      <rect width="10" height="10" x="85" y="5" />
                      <rect width="10" height="10" x="5" y="85" />
                      <rect width="6" height="6" x="7" y="7" fill="white" />
                      <rect width="6" height="6" x="87" y="7" fill="white" />
                      <rect width="6" height="6" x="7" y="87" fill="white" />
                      
                      {/* Fake pixel blocks */}
                      <rect width="5" height="5" x="25" y="15" />
                      <rect width="8" height="5" x="40" y="25" />
                      <rect width="5" height="8" x="65" y="15" />
                      <rect width="10" height="4" x="30" y="50" />
                      <rect width="5" height="5" x="15" y="60" />
                      <rect width="9" height="5" x="75" y="65" />
                      <rect width="5" height="10" x="50" y="75" />
                      <rect width="5" height="5" x="80" y="40" />
                      <rect width="8" height="8" x="45" y="45" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="font-extrabold text-xs text-slate-800 uppercase">Instruções do PIX</h5>
                    <p className="text-[10px] text-gray-500 mt-1 max-w-xs mx-auto leading-relaxed">Escaneie o QR Code acima ou copie a chave Pix Copie-e-Cole abaixo para efetuar a transferência rápida no app do seu banco.</p>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={pixKey}
                      className="w-full bg-white px-2.5 py-1.5 border border-slate-200 rounded-lg text-[9px] font-mono select-all outline-hidden text-slate-500 overflow-ellipsis"
                    />
                    <button
                      type="button"
                      onClick={handleCopyPix}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white font-black text-[10px] px-3.5 py-2 rounded-lg flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors"
                    >
                      {copiedPix ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedPix ? 'Copiado!' : 'Copiar'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 mt-6">
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-600 uppercase mb-1">Número do Cartão *</label>
                    <input
                      type="text"
                      maxLength={19}
                      value={card.number}
                      onChange={e => setCard({ ...card, number: e.target.value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim() })}
                      className="w-full px-3 py-2 border border-slate-250 rounded-lg text-xs font-semibold focus:border-red-500 focus:outline-hidden"
                      placeholder="0000 0000 0000 0000"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-600 uppercase mb-1">Titular Impresso no Cartão *</label>
                    <input
                      type="text"
                      value={card.holder}
                      onChange={e => setCard({ ...card, holder: e.target.value.toUpperCase() })}
                      className="w-full px-3 py-2 border border-slate-250 rounded-lg text-xs font-semibold focus:border-red-500 focus:outline-hidden"
                      placeholder="JOAO DA SILVA"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-600 uppercase mb-1">Vencimento (MM/AA) *</label>
                      <input
                        type="text"
                        maxLength={5}
                        value={card.expiry}
                        onChange={e => setCard({ ...card, expiry: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-250 rounded-lg text-xs font-semibold focus:border-red-500 focus:outline-hidden"
                        placeholder="12/28"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-600 uppercase mb-1">Cód. Segurança (CVV) *</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={card.cvv}
                        onChange={e => setCard({ ...card, cvv: e.target.value.replace(/\D/g, '') })}
                        className="w-full px-3 py-2 border border-slate-250 rounded-lg text-xs font-semibold focus:border-red-500 focus:outline-hidden"
                        placeholder="123"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-600 uppercase mb-1">Opções de Parcelamento *</label>
                    <select
                      value={card.installments}
                      onChange={e => setCard({ ...card, installments: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-250 bg-white rounded-lg text-xs font-bold focus:border-red-500 focus:outline-hidden"
                    >
                      <option value="1">1x de R$ {total.toFixed(2)} (Sem juros)</option>
                      <option value="2">2x de R$ {(total/2).toFixed(2)} (Sem juros)</option>
                      <option value="3">3x de R$ {(total/3).toFixed(2)} (Sem juros)</option>
                      <option value="4">4x de R$ {(total/4).toFixed(2)} (Sem juros)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Total Summary */}
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg text-center mt-6 text-xs text-slate-800">
                <span>Valor Total de Cobrança: </span>
                <strong className="text-sm font-black">R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep('delivery')}
                  className="w-1/3 border border-slate-250 hover:bg-slate-50 text-slate-700 font-bold uppercase tracking-wider text-[10px] py-3 px-2 rounded-lg cursor-pointer transition-colors"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  className="w-2/3 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-wider text-xs py-3 px-4 rounded-lg cursor-pointer transition-colors"
                >
                  {paymentMethod === 'pix' ? 'Concluir Pagamento PIX' : 'Concluir Compra'}
                </button>
              </div>
            </form>
          )}

          {step === 'success' && (
            <div className="text-center p-4 space-y-6">
              <div className="bg-emerald-50 text-emerald-500 p-4.5 rounded-full w-20 h-20 flex items-center justify-center mx-auto shadow-md animate-bounce">
                <CheckCircle className="w-12 h-12" />
              </div>
              <div>
                <h4 className="text-sm font-black uppercase tracking-wider text-slate-950">Pedido Reservado com Sucesso!</h4>
                <p className="text-[11px] text-gray-500 mt-2 max-w-sm mx-auto leading-relaxed">
                  Quase lá! Seu número do pedido é <strong>#KM-{Math.floor(1000 + Math.random() * 9000)}</strong>. Enviamos a cópia da fatura de reserva para o email cadastrado.
                </p>
              </div>

              <div className="border border-slate-150 rounded-xl p-4 bg-slate-50 text-left space-y-3">
                <div className="flex gap-2 text-slate-800 text-[11px] leading-relaxed">
                  <Truck className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-extrabold uppercase">Entrega Destinada para:</span>
                    <p className="text-slate-500 mt-0.5">{address.name} - {address.street}, {address.number}, {address.neighborhood}, {address.city}-{address.state}</p>
                  </div>
                </div>
                <div className="text-[10px] text-slate-500 italic border-t pt-2 block text-center">
                  Prazo previsto de entrega: <strong>3 a 5 dias úteis</strong> após aprovação financeira.
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleFinishSuccess}
                  className="w-full bg-slate-900 hover:bg-red-600 text-white font-black uppercase tracking-widest text-xs py-3 px-4 rounded-lg cursor-pointer transition-all"
                >
                  Continuar Navegando
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
