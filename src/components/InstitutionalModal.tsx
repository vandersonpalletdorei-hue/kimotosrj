import React from 'react';
import { X, Mail, MapPin, Send, HelpCircle, PhoneCall } from 'lucide-react';

interface InstitutionalModalProps {
  isOpen: boolean;
  onClose: () => void;
  section: string; // 'sobre', 'lojas', 'entregas', 'trocas', 'garantia', 'privacidade', 'contato'
}

export default function InstitutionalModal({
  isOpen,
  onClose,
  section
}: InstitutionalModalProps) {
  if (!isOpen) return null;

  const getSectionContent = () => {
    switch (section) {
      case 'sobre':
        return {
          title: 'Sobre a Kimotos Motopeças',
          html: (
            <div className="space-y-4">
              <p>Fundada em 2011 na lendária região de comércio de motopeças de Brasil, a <strong>Kimotos</strong> nasceu com a missão de trazer o que há de mais moderno e seguro para quem vive sobre duas rodas.</p>
              <p>Hoje, nossa marca é sinônimo de excelência e atendimento especializado. Divididos entre nossas lojas físicas e nossa plataforma digital robusta, atendemos milhares de motociclistas de todo o país diariamente.</p>
              <p>Nosso controle rigoroso de qualidade assegura que 100% do nosso catálogo seja original, certificado pelo INMETRO, e fornecido diretamente pelas fábricas parceiras (LS2, Norisk, Pirelli, Motul, X11, Tomok, etc).</p>
            </div>
          )
        };
      case 'lojas':
        return {
          title: 'Nossa Rede de Lojas Físicas',
          html: (
            <div className="space-y-4">
              <div className="border border-slate-200 p-4 rounded-xl bg-slate-50">
                <h5 className="font-extrabold uppercase text-[11px] text-red-600">Loja Única</h5>
                <p className="text-slate-600 mt-1 leading-relaxed">
                  Rua João Gregório Galindo,38,Japuiba Angra dos Reis/RJ<br />
                  <strong>WhatsApp:</strong> (24) 99835-9972 - Consultora de vendas Cristiane
                </p>
              </div>
              <p className="text-[10px] text-slate-500 italic block text-center">Visite-nos para tomar um café e experimentar seu capacete na hora com ajuda de especialistas de pilotagem!</p>
            </div>
          )
        };
      case 'entregas':
        return {
          title: 'Prazos e Métodos de Entrega',
          html: (
            <div className="space-y-4">
              <p>Trabalhamos em estreita parceria com os Correios e as melhores transportadoras privadas brasileiras de carga rodoviária e aérea.</p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Frete Expresso:</strong> Prazo de 3 a 5 dias úteis para Sul, Sudeste e Centro-Oeste; 5 a 10 dias úteis para Norte e Nordeste.</li>
                <li><strong>Frete Grátis:</strong> Válido automaticamente para todas as compras acima de R$ 400,00 enviadas na categoria econômica de transportadora parceira.</li>
              </ul>
              <p>O rastreio em tempo real é disponibilizado no seu WhatsApp e email em até 24 Horas após a emissão da Nota Fiscal Eletrônica.</p>
            </div>
          )
        };
      case 'trocas':
        return {
          title: 'Política de Trocas e Devoluções',
          html: (
            <div className="space-y-4">
              <p>Seguimos estritamente o <strong>Código de Defesa do Consumidor (Lei nº 8.078/1990)</strong> para assegurar conformidade e transparência em todas as suas compras:</p>
              
              <h5 className="font-extrabold uppercase text-[11px] text-slate-800 mt-2">1. Direito de Arrependimento</h5>
              <p>Conforme o Art. 49 do CDC, você tem até <strong>7 (sete) dias corridos</strong>, contados a partir do recebimento do pacote, para desistir da compra ou solicitar troca sem qualquer cobrança extra. O frete de devolução (logística reversa) é por nossa conta.</p>
              
              <h5 className="font-extrabold uppercase text-[11px] text-slate-800 mt-2">2. Trocas por Defeito (Garantia)</h5>
              <p>Para produtos com defeito de fabricação, o cliente tem o prazo legal de <strong>90 dias corridos</strong> (Art. 26 do CDC). O produto passará por análise da nossa equipe e do fabricante.</p>
              
              <h5 className="font-extrabold uppercase text-[11px] text-slate-800 mt-2">3. Condição dos Itens</h5>
              <ul className="list-disc list-inside space-y-1">
                <li>O produto deve ser retornado intacto, sem indícios de uso ou desgaste.</li>
                <li>Embalagem original, acompanhado de acessórios, manual e lacres protetores sem violação.</li>
                <li>É obrigatório o envio da respectiva Nota Fiscal (DANFE).</li>
              </ul>
              
              <h5 className="font-extrabold uppercase text-[11px] text-slate-800 mt-2">4. Estorno de Valores</h5>
              <p>Pagamentos no Cartão de Crédito serão estornados em até 2 faturas. Pagamentos via Pix serão reembolsados na conta de origem em até 5 dias úteis após o recebimento e análise do item devolvido.</p>

              <p className="font-bold text-red-600 mt-4">Entre em contato via WhatsApp (24) 99835-9972 para gerar a sua etiqueta reversa sem custos adicionais!</p>
            </div>
          )
        };
      case 'garantia':
        return {
          title: 'Políticas de Garantia',
          html: (
            <div className="space-y-4">
              <p>A maioria das marcas de renome fornecidas pela Kimotos conta com garantias estendidas oficiais:</p>
              <p><strong>Capacetes LS2 & Norisk:</strong> Garantia estrutural de fábrica estendida de 6 meses contra defeitos de costura, fixações, fecho ou montagens estruturais do casco.</p>
              <p><strong>Outras motopeças:</strong> Garantia legal de 90 dias conforme previsto em lei nacional.</p>
              <p className="text-slate-500 text-[11px] leading-relaxed">Observação: Danos decorrentes de desgaste abrasivo natural, quedas bruscas de pilotagem ou má montagem mecânica por terceiros não credenciados não são acobertados sob garantia.</p>
            </div>
          )
        };
      case 'privacidade':
        return {
          title: 'Política de Privacidade e Segurança (LGPD)',
          html: (
            <div className="space-y-4">
              <p>A <strong>Kimotos Motopeças</strong> leva a sério a privacidade dos seus dados. Nossa política está totalmente adequada à <strong>Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018)</strong>.</p>
              
              <h5 className="font-extrabold uppercase text-[11px] text-slate-800 mt-2">1. Coleta e Uso de Dados</h5>
              <p>Seus dados cadastrais (nome, CPF, endereço, e-mail) são utilizados exclusivamente para processamento de pagamentos, emissão de Nota Fiscal e envio de pedidos. <strong>Nós nunca vendemos ou comercializamos seus dados para terceiros.</strong></p>

              <h5 className="font-extrabold uppercase text-[11px] text-slate-800 mt-2">2. Segurança em Pagamentos</h5>
              <p>Todo o fluxo financeiro de sua compra é criptografado de ponta-a-ponta e processado diretamente pelos servidores seguros do Mercado Pago. <strong>Não armazenamos números de cartão de crédito em nossos bancos de dados.</strong></p>

              <h5 className="font-extrabold uppercase text-[11px] text-slate-800 mt-2">3. Seus Direitos</h5>
              <p>Você tem total direito a qualquer momento de solicitar a retificação ou exclusão permanente da sua conta e de seus dados pessoais do nosso sistema, bastando acionar o nosso suporte no WhatsApp ou Email.</p>

              <h5 className="font-extrabold uppercase text-[11px] text-slate-800 mt-2">4. Uso de Cookies</h5>
              <p>O site utiliza cookies de sessão necessários para o funcionamento do carrinho de compras e navegação, os quais você pode limpar no seu navegador quando desejar.</p>
            </div>
          )
        };
      case 'contato':
        return {
          title: 'Fale Conosco',
          html: (
            <form onSubmit={(e) => { e.preventDefault(); alert('Mensagem enviada com sucesso! Logo daremos retorno!'); onClose(); }} className="space-y-4">
              <p className="text-slate-600">Envie-nos sua dúvida de peças ou cotação técnica. Nosso tempo de resposta médio por email é de 2 horas úteis!</p>
              <div>
                <label className="block text-[9px] font-black uppercase text-gray-500 mb-1">Seu Nome *</label>
                <input type="text" required placeholder="João Alves" className="w-full px-3 py-2 border rounded-lg text-xs font-semibold focus:outline-hidden focus:border-red-500" />
              </div>
              <div>
                <label className="block text-[9px] font-black uppercase text-gray-500 mb-1">Email de Retorno *</label>
                <input type="email" required placeholder="joao@gmail.com" className="w-full px-3 py-2 border rounded-lg text-xs font-semibold focus:outline-hidden focus:border-red-500" />
              </div>
              <div>
                <label className="block text-[9px] font-black uppercase text-gray-500 mb-1">Seu Telefone *</label>
                <input type="tel" required placeholder="(11) 99999-0000" className="w-full px-3 py-2 border rounded-lg text-xs font-semibold focus:outline-hidden focus:border-red-500" />
              </div>
              <div>
                <label className="block text-[9px] font-black uppercase text-gray-500 mb-1">Mensagem ou Custo de Frete *</label>
                <textarea required rows={3} placeholder="Escreva aqui..." className="w-full px-3 py-2 border rounded-lg text-xs font-semibold focus:outline-hidden focus:border-red-500" />
              </div>
              <button type="submit" className="w-full bg-slate-900 hover:bg-red-600 text-white font-black uppercase text-xs py-2.5 rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-colors">
                <Send className="w-4 h-4" /> Enviar Mensagem
              </button>
            </form>
          )
        };
      default:
        return {
          title: 'Kimotos Regulamentos',
          html: <p className="text-gray-400 italic">Termo Geral operacional de motopeças.</p>
        };
    }
  };

  const content = getSectionContent();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 font-sans">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs" onClick={onClose} />

      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl relative overflow-hidden z-10 border border-slate-150 flex flex-col max-h-[85vh]">
        
        {/* Header of Modal */}
        <div className="p-5 border-b border-gray-150 flex items-center justify-between bg-slate-50">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-950">{content.title}</h3>
          <button
            onClick={onClose}
            className="p-1 px-2.5 bg-slate-200 hover:bg-slate-300 rounded text-slate-800 text-[10px] font-black uppercase tracking-wide cursor-pointer flex items-center gap-1"
          >
            <span>Fechar</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Content of Modal */}
        <div className="p-6 overflow-y-auto text-xs text-slate-700 leading-relaxed font-medium">
          {content.html}
        </div>

      </div>
    </div>
  );
}
