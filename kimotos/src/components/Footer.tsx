import React from 'react';
import { CreditCard, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

interface FooterProps {
  onOpenInstitutional: (section: string) => void;
}

export default function Footer({ onOpenInstitutional }: FooterProps) {
  return (
    <footer className="bg-slate-900 text-gray-400 text-xs mt-12">
      {/* Advantage Banner inside margins */}
      <div className="border-b border-red-700 bg-red-600 py-8 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 text-white rounded-lg">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-wider">Frete Expresso</h4>
              <p className="text-[11px] text-red-100 mt-0.5">Envios rápidos para todo o Brasil com rastreio.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 text-white rounded-lg">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-wider">Parcele em até 4x</h4>
              <p className="text-[11px] text-red-100 mt-0.5">Sem juros nos cartões de crédito ou desconto no PIX.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 text-white rounded-lg">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-wider">Troca Facilitada</h4>
              <p className="text-[11px] text-red-100 mt-0.5">Até 7 dias após a entrega para trocar ou devolver.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 text-white rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-wider">Compra 100% Segura</h4>
              <p className="text-[11px] text-red-100 mt-0.5">Certificados SSL de segurança criptografada.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer directories link */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-red-600 rounded-md flex items-center justify-center text-white font-black text-base rotate-[-4deg]">
              K
            </div>
            <h3 className="text-white font-black text-sm uppercase tracking-tight">KIMOTOS</h3>
          </div>
          <p className="text-[11px] text-gray-500 leading-relaxed mb-4">
            A Kimotos Motopeças é a escolha líder de motociclistas exigentes. Oferecemos o maior catálogo de capacetes premium, pneus, óleos lubrificantes e acessórios de alta performance.
          </p>
          <span className="text-white font-semibold block mt-4 mb-2">Atendimento presencial:</span>
          <p className="text-[11px] text-gray-500 mt-1">Rua João Gregório Galindo, 38, Japuiba<br />Angra dos Reis / RJ</p>
          <p className="text-[11px] text-gray-500 mt-2">Segunda a Sexta: 8h às 18h<br />Sábado: 8h às 14h</p>
        </div>

        <div>
          <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-4">Institucional</h4>
          <ul className="space-y-2.5">
            <li>
              <button onClick={() => onOpenInstitutional('sobre')} className="hover:text-white transition-colors text-left font-medium">
                Sobre a Kimotos
              </button>
            </li>
            <li>
              <button onClick={() => onOpenInstitutional('lojas')} className="hover:text-white transition-colors text-left font-medium">
                Nossas Lojas Físicas
              </button>
            </li>
            <li>
              <button onClick={() => onOpenInstitutional('novidades')} className="hover:text-white transition-colors text-left font-medium">
                Blog e Novidades
              </button>
            </li>
            <li>
              <button onClick={() => onOpenInstitutional('contato')} className="hover:text-white transition-colors text-left font-medium">
                Fale Conosco
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-4">Políticas & Ajuda</h4>
          <ul className="space-y-2.5">
            <li>
              <button onClick={() => onOpenInstitutional('entregas')} className="hover:text-white transition-colors text-left font-medium">
                Prazos e Entregas
              </button>
            </li>
            <li>
              <button onClick={() => onOpenInstitutional('trocas')} className="hover:text-white transition-colors text-left font-medium">
                Trocas e Devoluções
              </button>
            </li>
            <li>
              <button onClick={() => onOpenInstitutional('garantia')} className="hover:text-white transition-colors text-left font-medium">
                Termo de Garantia
              </button>
            </li>
            <li>
              <button onClick={() => onOpenInstitutional('privacidade')} className="hover:text-white transition-colors text-left font-medium text-slate-550 italic">
                Política de Privacidade (LGPD)
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-4">Bandeiras Aceitas</h4>
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="bg-slate-800 text-white font-bold px-2 py-1 rounded text-[10px]">VISA</span>
            <span className="bg-slate-800 text-white font-bold px-2 py-1 rounded text-[10px]">MASTERCARD</span>
            <span className="bg-slate-800 text-white font-bold px-2 py-1 rounded text-[10px]">ELO</span>
            <span className="bg-slate-800 text-white font-bold px-2 py-1 rounded text-[10px]">AMEX</span>
            <span className="bg-slate-800 bg-emerald-950 text-emerald-400 font-extrabold px-2 py-1 rounded text-[10px]">PIX</span>
            <span className="bg-slate-800 text-white font-bold px-2 py-1 rounded text-[10px]">BOLETO</span>
          </div>
          <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-3">Segurança Protegida</h4>
          <span className="text-[10px] text-gray-500 font-medium block">Criptografia SSL de 256 bits ativo.</span>
        </div>
      </div>

      {/* Copyright bottom section */}
      <div className="bg-slate-950 py-6 px-4 border-t border-slate-900 text-center text-slate-500 text-[10px]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
          <p>© {new Date().getFullYear()} KIMOTOS Comercio de Motopeças Ltda. Todos os direitos reservados.</p>
          <p>CNPJ: 14.288.623/0001-90 | IE: 110.223.340.119 - Angra dos Reis - RJ</p>
        </div>
      </div>
    </footer>
  );
}
