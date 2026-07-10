import React, { useState, useEffect } from 'react';
import { Product, Category } from '../types';
import { X, RefreshCw, Database, CloudLightning, ShieldAlert, ArrowUpRight, ArrowDownRight, Edit2, Trash2, Plus, ArrowDownToLine, Check, Copy } from 'lucide-react';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  categories: Category[];
  onProductsUpdate: (newProducts: Product[]) => void;
  onCategoriesUpdate: (newCategories: Category[]) => void;
}

interface SupabaseStatus {
  configured: boolean;
  connected: boolean;
  url: string | null;
  error: string | null;
  tables: { products: boolean; categories: boolean };
}

export default function AdminPanel({
  isOpen,
  onClose,
  products,
  categories,
  onProductsUpdate,
  onCategoriesUpdate
}: AdminPanelProps) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'status' | 'prod' | 'cat'>('status');
  
  // Status State
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [supabaseStatus, setSupabaseStatus] = useState<SupabaseStatus>({
    configured: false,
    connected: false,
    url: null,
    error: null,
    tables: { products: false, categories: false }
  });

  const [copiedSql, setCopiedSql] = useState(false);
  const [syncing, setSyncing] = useState<'push' | 'pull' | null>(null);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  // Form states for Products CRUD
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [itemForm, setItemForm] = useState<Partial<Product>>({});
  const [showProductForm, setShowProductForm] = useState(false);

  // Form states for Categories CRUD
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [catForm, setCatForm] = useState<Partial<Category>>({});
  const [showCategoryForm, setShowCategoryForm] = useState(false);

  // Fetch Supabase configuration status from Express Server
  const fetchSupabaseStatus = async () => {
    setLoadingStatus(true);
    try {
      const res = await fetch('/api/supabase/status');
      if (res.ok) {
        const data = await res.json();
        setSupabaseStatus(data);
      }
    } catch (err: any) {
      console.error('Error fetching Supabase status:', err);
    } finally {
      setLoadingStatus(false);
    }
  };

  useEffect(() => {
    fetchSupabaseStatus();
  }, []);

  // Trigger server Push (local to cloud)
  const handlePushToCloud = async () => {
    setSyncing('push');
    setSyncMessage(null);
    try {
      const res = await fetch('/api/supabase/push', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setSyncMessage('Sucesso: Todos os dados locais foram exportados para o seu Supabase cloud!');
        fetchSupabaseStatus();
      } else {
        setSyncMessage(`Erro ao empurrar: ${data.error || 'Erro desconhecido'}`);
      }
    } catch (err: any) {
      setSyncMessage(`Erro na requisição: ${err.message}`);
    } finally {
      setSyncing(null);
    }
  };

  // Trigger server Pull (cloud to local)
  const handlePullFromCloud = async () => {
    setSyncing('pull');
    setSyncMessage(null);
    try {
      const res = await fetch('/api/supabase/pull', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setSyncMessage(`Sucesso: Puxado da nuvem! Sincronizado ${data.productsCount} produtos e ${data.categoriesCount} categorias.`);
        
        // Reload local React state by fetching products and categories again from server
        const prodRes = await fetch('/api/products');
        const catRes = await fetch('/api/categories');
        if (prodRes.ok && catRes.ok) {
          const prodData = await prodRes.json();
          const catData = await catRes.json();
          onProductsUpdate(prodData.products);
          onCategoriesUpdate(catData.categories);
        }
        fetchSupabaseStatus();
      } else {
        setSyncMessage(`Erro ao puxar: ${data.error || 'Erro desconhecido'}`);
      }
    } catch (err: any) {
      setSyncMessage(`Erro na requisição: ${err.message}`);
    } finally {
      setSyncing(null);
    }
  };

  // SQL Copy trigger
  const sqlCode = `-- 1. CRIAR TABELA DE CATEGORIAS
create table if not exists public.categories (
  id text primary key,
  name text not null,
  icon text default 'Shield',
  description text
);

-- Ativar segurança e acesso público total para testes rápidos
alter table public.categories enable row level security;
create policy "Acesso público irrestrita" on public.categories for select using (true);
create policy "Escrita irrestrita" on public.categories for all using (true) with check (true);

-- 2. CRIAR TABELA DE PRODUTOS (CONECTADA POR REFERENCES)
create table if not exists public.products (
  id text primary key,
  name text not null,
  category text not null references public.categories(id) on delete cascade,
  categoryLabel text,
  brand text,
  price numeric not null,
  originalPrice numeric,
  image text,
  images jsonb,
  description text,
  rating numeric default 5.0,
  reviewsCount integer default 0,
  isPromo boolean default false,
  isNew boolean default false,
  freeShipping boolean default false,
  sizes jsonb,
  stock integer default 0,
  subcategory text,
  attributes jsonb
);

alter table public.products enable row level security;
create policy "Acesso público irrestrita" on public.products for select using (true);
create policy "Escrita irrestrita" on public.products for all using (true) with check (true);
`;

  const copySqlToClipboard = () => {
    navigator.clipboard.writeText(sqlCode);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  // Products CRUD handlings
  const handleOpenProductForm = (p: Product | null) => {
    if (p) {
      setEditingProduct(p);
      setItemForm({ ...p });
    } else {
      setEditingProduct(null);
      setItemForm({
        id: `prod-${Math.floor(1000 + Math.random() * 9000)}`,
        name: '',
        brand: '',
        price: 0,
        originalPrice: undefined,
        category: categories[0]?.id || '',
        categoryLabel: categories[0]?.name || '',
        image: 'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&q=80&w=600',
        description: '',
        rating: 5.0,
        reviewsCount: 0,
        stock: 10,
        subcategory: '',
        isNew: true,
        isPromo: false,
        freeShipping: false,
        sizes: ['56', '58', '60']
      });
    }
    setShowProductForm(true);
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemForm.name || !itemForm.price || !itemForm.category) {
      alert('Por favor, preencha nome, preço e categoria!');
      return;
    }

    const currentCat = categories.find(c => c.id === itemForm.category);
    const updatedForm = {
      ...itemForm,
      categoryLabel: currentCat ? currentCat.name : itemForm.category
    } as Product;

    let updatedProducts: Product[] = [];
    if (editingProduct) {
      updatedProducts = products.map(p => p.id === editingProduct.id ? updatedForm : p);
    } else {
      updatedProducts = [updatedForm, ...products];
    }

    // Persist locally in localStorage first for static/offline-first support on Netlify
    try {
      localStorage.setItem('kimotos_products', JSON.stringify(updatedProducts));
    } catch (err) {
      console.warn('Failed to save products to localStorage:', err);
    }
    onProductsUpdate(updatedProducts);
    setShowProductForm(false);

    // Try server sync
    try {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: updatedProducts })
      });
      fetchSupabaseStatus();
    } catch (err: any) {
      console.log('Skipping backend sync on product save (running in static offline mode):', err.message);
    }
  };

  const handleProductDelete = async (id: string) => {
    if (!confirm('Deseja realmente deletar esta motopeça?')) return;
    const updated = products.filter(p => p.id !== id);

    // Persist locally in localStorage first for static/offline-first support on Netlify
    try {
      localStorage.setItem('kimotos_products', JSON.stringify(updated));
    } catch (err) {
      console.warn('Failed to delete product from localStorage:', err);
    }
    onProductsUpdate(updated);

    // Try server sync
    try {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: updated })
      });
      fetchSupabaseStatus();
    } catch (err: any) {
      console.log('Skipping backend sync on product delete (running in static offline mode):', err.message);
    }
  };

  // Categories CRUD handlings
  const handleOpenCatForm = (c: Category | null) => {
    if (c) {
      setEditingCategory(c);
      setCatForm({ ...c });
    } else {
      setEditingCategory(null);
      setCatForm({
        id: `cat-${Math.floor(10 + Math.random() * 90)}`,
        name: '',
        icon: 'Shield',
        description: ''
      });
    }
    setShowCategoryForm(true);
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catForm.id || !catForm.name) {
      alert('Preencha o identificador único e o nome!');
      return;
    }

    const item = catForm as Category;
    let updated: Category[] = [];
    if (editingCategory) {
      updated = categories.map(c => c.id === editingCategory.id ? item : c);
    } else {
      updated = [...categories, item];
    }

    // Persist locally in localStorage first for static/offline-first support on Netlify
    try {
      localStorage.setItem('kimotos_categories', JSON.stringify(updated));
    } catch (err) {
      console.warn('Failed to save categories to localStorage:', err);
    }
    onCategoriesUpdate(updated);
    setShowCategoryForm(false);

    // Try server sync
    try {
      await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categories: updated })
      });
      fetchSupabaseStatus();
    } catch (err: any) {
      console.log('Skipping backend sync on category save (running in static offline mode):', err.message);
    }
  };

  const handleCategoryDelete = async (id: string) => {
    if (!confirm('Deseja realmente deletar esta categoria? Todos os produtos vinculados poderão ser afetados no Supabase.')) return;
    const updated = categories.filter(c => c.id !== id);

    // Persist locally in localStorage first for static/offline-first support on Netlify
    try {
      localStorage.setItem('kimotos_categories', JSON.stringify(updated));
    } catch (err) {
      console.warn('Failed to delete category from localStorage:', err);
    }
    onCategoriesUpdate(updated);

    // Try server sync
    try {
      await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categories: updated })
      });
      fetchSupabaseStatus();
    } catch (err: any) {
      console.log('Skipping backend sync on category delete (running in static offline mode):', err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 max-w-4xl w-full bg-white shadow-2xl flex flex-col h-full transform transition-transform duration-300">
        
        {/* Header panel */}
        <div className="p-4 border-b border-gray-150 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-red-500" />
            <h2 className="text-xs font-black uppercase tracking-widest">Painel Administrativo Kimotos</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 px-2.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 text-[10px] font-bold uppercase tracking-wide cursor-pointer flex items-center gap-1.5"
          >
            <span>Fechar Painel</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Dashboard directory tabs */}
        <div className="bg-slate-950 text-white py-1.5 px-4 flex border-b border-slate-800 text-[10px] font-black uppercase tracking-widest space-x-4">
          <button
            onClick={() => { setActiveTab('status'); setShowProductForm(false); setShowCategoryForm(false); }}
            className={`pb-1 border-b-2 hover:text-white transition-all cursor-pointer ${
              activeTab === 'status' ? 'border-red-500 text-white' : 'border-transparent text-gray-500'
            }`}
          >
            Sincronizador Supabase
          </button>
          <button
            onClick={() => { setActiveTab('prod'); setShowProductForm(false); setShowCategoryForm(false); }}
            className={`pb-1 border-b-2 hover:text-white transition-all cursor-pointer ${
              activeTab === 'prod' ? 'border-red-500 text-white' : 'border-transparent text-gray-500'
            }`}
          >
            Gerenciar Peças ({products.length})
          </button>
          <button
            onClick={() => { setActiveTab('cat'); setShowProductForm(false); setShowCategoryForm(false); }}
            className={`pb-1 border-b-2 hover:text-white transition-all cursor-pointer ${
              activeTab === 'cat' ? 'border-red-500 text-white' : 'border-transparent text-gray-500'
            }`}
          >
            Categorias ({categories.length})
          </button>
        </div>

        {/* Core dynamic body panel */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">

          {activeTab === 'status' && (
            <div className="space-y-6">
              
              {/* Connection Status block */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xs font-black uppercase text-slate-800 flex items-center gap-1.5">
                      <CloudLightning className="w-4.5 h-4.5 text-indigo-650" />
                      Status da Integração Cloud
                    </h3>
                    <p className="text-[10px] text-gray-500 mt-1 max-w-sm">Verifica a comunicação serverless direta entre o Express backend e a sua URL do Supabase.</p>
                  </div>
                  <button
                    onClick={fetchSupabaseStatus}
                    disabled={loadingStatus}
                    className="self-start py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold uppercase rounded-md tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loadingStatus ? 'animate-spin' : ''}`} />
                    <span>Testar Conexão</span>
                  </button>
                </div>

                {/* Response Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 border-t pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-[11px] font-bold">
                      <span className="text-slate-500">Credenciais configuradas:</span>
                      {supabaseStatus.configured ? (
                        <span className="text-emerald-600 font-extrabold uppercase">✔ Sim</span>
                      ) : (
                        <span className="text-red-500 font-extrabold uppercase">✘ Ausente (Fallback Local)</span>
                      )}
                    </div>
                    <div className="flex justify-between text-[11px] font-bold">
                      <span className="text-slate-500">Conexão Estabelecida:</span>
                      {supabaseStatus.connected ? (
                        <span className="text-emerald-600 font-extrabold uppercase">🚀 Conectado</span>
                      ) : (
                        <span className="text-amber-500 font-extrabold uppercase">⚠ Offline</span>
                      )}
                    </div>
                    <div className="flex flex-col text-[11px] font-semibold text-slate-500 pt-1">
                      <span>URL do Projeto Supabase:</span>
                      <span className="font-mono text-[10px] bg-slate-50 p-1 rounded mt-1 overflow-x-auto text-slate-700 border">
                        {supabaseStatus.url || 'http://localhost (Offline fallback)'}
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4.5 rounded-lg border flex flex-col justify-between">
                    <div>
                      <h4 className="font-black uppercase text-[10px] text-slate-700">Tabelas Identificadas na Nuvem:</h4>
                      <div className="space-y-1.5 mt-2 text-[10px] font-bold">
                        <div className="flex justify-between">
                          <span>• categories</span>
                          <span className={supabaseStatus.tables.categories ? 'text-emerald-600 font-black' : 'text-red-500 font-black'}>
                            {supabaseStatus.tables.categories ? 'ENCONTRADA' : 'NÃO ENCONTRADA'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>• products</span>
                          <span className={supabaseStatus.tables.products ? 'text-emerald-600 font-black' : 'text-red-500 font-black'}>
                            {supabaseStatus.tables.products ? 'ENCONTRADA' : 'NÃO ENCONTRADA'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {!supabaseStatus.connected && supabaseStatus.configured && (
                      <span className="text-[9px] text-red-500 font-extrabold flex items-center gap-1 uppercase mt-3">
                        <ShieldAlert className="w-3.5 h-3.5" /> Tabelas pendentes de criação. Veja abaixo!
                      </span>
                    )}
                  </div>
                </div>

                {supabaseStatus.error && (
                  <div className="mt-4 p-3.5 bg-red-50 border border-red-200 rounded-lg text-red-700 text-[10px] font-mono whitespace-pre-wrap leading-tight">
                    <strong>Mensagem de Erro:</strong> {supabaseStatus.error}
                  </div>
                )}
              </div>

              {/* Force cloud synchronization triggers */}
              {supabaseStatus.configured && (
                <div className="bg-gradient-to-br from-indigo-850 to-indigo-900 border border-indigo-950 text-white rounded-xl p-5 shadow-md">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider flex items-center gap-2">
                      <Database className="w-4.5 h-4.5 text-red-500" />
                      Núcleo Sincronizador de Dados (Sync)
                    </h3>
                    <p className="text-[10px] text-gray-300 mt-1 max-w-xl">
                      Escolha entre <strong>Empurrar</strong> seus arquivos locais de backup (`products_db.json`/`categories_db.json`) para a nuvem de banco de dados ativa do Supabase, ou <strong>Puxar</strong> a última versão armazenada na nuvem para sobrescrever o ambiente local.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                    <button
                      onClick={handlePushToCloud}
                      disabled={!!syncing}
                      className="bg-white hover:bg-slate-100 text-slate-900 py-3 px-4 rounded-lg font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors"
                    >
                      <ArrowUpRight className="w-4.5 h-4.5 text-red-600" />
                      <span>{syncing === 'push' ? 'Empurrando...' : 'Forçar Upload na Nuvem (Push)'}</span>
                    </button>

                    <button
                      onClick={handlePullFromCloud}
                      disabled={!!syncing}
                      className="bg-slate-900 hover:bg-slate-950 text-white py-3 px-4 rounded-lg font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer border border-slate-700 transition-colors"
                    >
                      <ArrowDownRight className="w-4.5 h-4.5 text-emerald-500" />
                      <span>{syncing === 'pull' ? 'Puxando...' : 'Sobrescrever Local da Nuvem (Pull)'}</span>
                    </button>
                  </div>

                  {syncMessage && (
                    <div className="mt-4 p-3 bg-white/10 rounded-lg text-xs font-semibold leading-relaxed border border-white/10 text-slate-100">
                      {syncMessage}
                    </div>
                  )}
                </div>
              )}

              {/* SQL script migration guide */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-black uppercase text-slate-800">
                      1. Script de Migração SQL Supabase
                    </h4>
                    <p className="text-[10px] text-gray-500 mt-0.5">Se as tabelas de banco estiverem ausentes no painel acima, execute as sentenças abaixo no seu painel editor SQL do Supabase.</p>
                  </div>
                  <button
                    onClick={copySqlToClipboard}
                    className="self-start py-1.5 px-3 bg-red-600 hover:bg-red-700 text-white text-[10px] font-black uppercase tracking-wider rounded-md flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSql ? 'Copiado!' : 'Copiar SQL'}</span>
                  </button>
                </div>

                <div className="max-h-60 overflow-y-auto bg-slate-900 rounded-xl p-4 text-[9px] font-mono text-gray-300 border leading-relaxed select-all">
                  <pre>{sqlCode}</pre>
                </div>
              </div>

              {/* Download Code Base ZIP Widget */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-black uppercase text-slate-800">Exportar Projeto Completo (ZIP)</h4>
                  <p className="text-[10px] text-gray-500 mt-1 max-w-sm">Gera e baixa um arquivo ZIP contendo toda a base de código do e-commerce, perfeito para backups de custódia.</p>
                </div>
                <a
                  href="/api/download-zip"
                  className="bg-slate-900 hover:bg-red-600 text-white text-[10px] font-black uppercase tracking-wider py-2.5 px-4 rounded-lg flex items-center gap-2 transition-all cursor-pointer shadow-xs self-start sm:self-center"
                >
                  <ArrowDownToLine className="w-4 h-4" /> Exportar ZIP
                </a>
              </div>

            </div>
          )}

          {/* Products CRUD view */}
          {activeTab === 'prod' && !showProductForm && (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-white p-3 border rounded-xl shadow-xs">
                <span className="text-slate-600 font-extrabold text-[11px] uppercase tracking-wider">Motopeças Listadas ({products.length})</span>
                <button
                  onClick={() => handleOpenProductForm(null)}
                  className="bg-red-600 hover:bg-red-700 text-white font-black uppercase text-[10px] tracking-wider py-1.5 px-3 rounded-lg flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Adicionar Peça
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3.5">
                {products.map((p) => (
                  <div key={p.id} className="bg-white border rounded-lg p-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-slate-350 transition-colors">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="w-12 h-12 rounded object-cover border" />
                      <div>
                        <h4 className="font-bold text-xs text-slate-800 line-clamp-1">{p.name}</h4>
                        <div className="flex gap-2 text-[10px] font-extrabold uppercase mt-1 text-slate-500 italic">
                          <span>{p.categoryLabel}</span>
                          <span>|</span>
                          <span>{p.brand}</span>
                          <span>|</span>
                          <span className="text-slate-800 font-black">R$ {p.price.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 self-end sm:self-center">
                      <button
                        onClick={() => handleOpenProductForm(p)}
                        className="p-1 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border text-[10px] font-bold uppercase rounded flex items-center gap-1 cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Editar
                      </button>
                      <button
                        onClick={() => handleProductDelete(p.id)}
                        className="p-1 px-2.5 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 border border-red-200 text-[10px] font-bold uppercase rounded flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Deletar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Product edit/addition Form overlay inside tab */}
          {activeTab === 'prod' && showProductForm && (
            <form onSubmit={handleProductSubmit} className="bg-white border p-6 rounded-xl shadow-md space-y-4 max-w-xl mx-auto">
              <h3 className="text-xs font-black uppercase text-slate-800 border-b pb-1">
                {editingProduct ? `Editar Peça: ${editingProduct.name}` : 'Novidade Motopeça'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-600 uppercase mb-1">Identificador Único *</label>
                  <input
                    type="text"
                    required
                    disabled={!!editingProduct}
                    value={itemForm.id}
                    onChange={e => setItemForm({ ...itemForm, id: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-xs font-semibold focus:outline-hidden disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-600 uppercase mb-1">Nome Comercial *</label>
                  <input
                    type="text"
                    required
                    value={itemForm.name}
                    onChange={e => setItemForm({ ...itemForm, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-xs font-semibold focus:outline-hidden focus:border-red-500"
                    placeholder="Capacete Premium LS2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-600 uppercase mb-1">Preço Atual (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={itemForm.price || ''}
                    onChange={e => setItemForm({ ...itemForm, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border rounded-lg text-xs font-semibold focus:outline-hidden focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-600 uppercase mb-1">Preço Original (Opcional)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={itemForm.originalPrice || ''}
                    onChange={e => setItemForm({ ...itemForm, originalPrice: parseFloat(e.target.value) || undefined })}
                    className="w-full px-3 py-2 border rounded-lg text-xs font-semibold focus:outline-hidden focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-600 uppercase mb-1">Estoque Físico *</label>
                  <input
                    type="number"
                    required
                    value={itemForm.stock || ''}
                    onChange={e => setItemForm({ ...itemForm, stock: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border rounded-lg text-xs font-semibold focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-600 uppercase mb-1">Categoria de Referência *</label>
                  <select
                    value={itemForm.category}
                    onChange={e => setItemForm({ ...itemForm, category: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-xs font-semibold bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-600 uppercase mb-1">Marca Produtora *</label>
                  <input
                    type="text"
                    required
                    value={itemForm.brand}
                    onChange={e => setItemForm({ ...itemForm, brand: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-xs font-semibold"
                    placeholder="LS2, Pirelli"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-600 uppercase mb-1">Subcategoria</label>
                  <input
                    type="text"
                    value={itemForm.subcategory}
                    onChange={e => setItemForm({ ...itemForm, subcategory: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-xs font-semibold"
                    placeholder="Capacete Fechado"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-slate-600 uppercase mb-1">Imagem Principal (URL) *</label>
                <input
                  type="url"
                  required
                  value={itemForm.image}
                  onChange={e => setItemForm({ ...itemForm, image: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-slate-600 uppercase mb-1">Descrição Explicativa *</label>
                <textarea
                  required
                  rows={3}
                  value={itemForm.description}
                  onChange={e => setItemForm({ ...itemForm, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-xs font-semibold"
                  placeholder="Detalhes comerciais do produto..."
                />
              </div>

              <div className="flex flex-wrap gap-4 bg-slate-50 p-3 rounded-lg text-[10px] font-bold text-slate-700">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!itemForm.isNew}
                    onChange={e => setItemForm({ ...itemForm, isNew: e.target.checked })}
                  />
                  <span>PRODUTO NOVO</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!itemForm.isPromo}
                    onChange={e => setItemForm({ ...itemForm, isPromo: e.target.checked })}
                  />
                  <span>PRODUTO EM PROMOÇÃO</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!itemForm.freeShipping}
                    onChange={e => setItemForm({ ...itemForm, freeShipping: e.target.checked })}
                  />
                  <span>FRETE GRÁTIS</span>
                </label>
              </div>

              <div className="flex gap-2 justify-end pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowProductForm(false)}
                  className="px-4 py-2 border rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider rounded-lg transition-colors"
                >
                  Gravar Peça
                </button>
              </div>
            </form>
          )}

          {/* Categories CRUD view */}
          {activeTab === 'cat' && !showCategoryForm && (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-white p-3 border rounded-xl shadow-xs">
                <span className="text-slate-600 font-extrabold text-[11px] uppercase tracking-wider">Categorias Cadastradas ({categories.length})</span>
                <button
                  onClick={() => handleOpenCatForm(null)}
                  className="bg-red-600 hover:bg-red-700 text-white font-black uppercase text-[10px] tracking-wider py-1.5 px-3 rounded-lg flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Nova Categoria
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3.5">
                {categories.map((c) => (
                  <div key={c.id} className="bg-white border rounded-lg p-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-slate-350 transition-colors">
                    <div>
                      <h4 className="font-extrabold text-xs text-slate-800">{c.name}</h4>
                      <p className="text-[10px] text-slate-500 mt-1">ID: <span className="font-mono">{c.id}</span> | Ícone: <span className="font-mono">{c.icon}</span></p>
                      <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1">{c.description || 'Sem descrição'}</p>
                    </div>

                    <div className="flex gap-2 self-end sm:self-center">
                      <button
                        onClick={() => handleOpenCatForm(c)}
                        className="p-1 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border text-[10px] font-bold uppercase rounded flex items-center gap-1 cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Editar
                      </button>
                      <button
                        onClick={() => handleCategoryDelete(c.id)}
                        className="p-1 px-2.5 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 border border-red-200 text-[10px] font-bold uppercase rounded flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Deletar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Category Edit/Form inside tab */}
          {activeTab === 'cat' && showCategoryForm && (
            <form onSubmit={handleCategorySubmit} className="bg-white border p-6 rounded-xl shadow-md space-y-4 max-w-sm mx-auto">
              <h3 className="text-xs font-black uppercase text-slate-800 border-b pb-1">
                {editingCategory ? `Editar Categoria: ${editingCategory.name}` : 'Nova Categoria'}
              </h3>

              <div>
                <label className="block text-[10px] font-extrabold text-slate-600 uppercase mb-1">Identificador ID Único *</label>
                <input
                  type="text"
                  required
                  disabled={!!editingCategory}
                  value={catForm.id}
                  onChange={e => setCatForm({ ...catForm, id: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  className="w-full px-3 py-2 border rounded-lg text-xs font-semibold focus:outline-hidden disabled:bg-gray-100"
                  placeholder="capacetes"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-slate-600 uppercase mb-1">Nome *</label>
                <input
                  type="text"
                  required
                  value={catForm.name}
                  onChange={e => setCatForm({ ...catForm, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-xs font-semibold"
                  placeholder="Capacetes"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-slate-600 uppercase mb-1">Ícone (Nome Lucide)</label>
                <input
                  type="text"
                  value={catForm.icon}
                  onChange={e => setCatForm({ ...catForm, icon: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-xs font-mono font-bold"
                  placeholder="Shield / Droplet / CircleDot"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-slate-600 uppercase mb-1">Pequena descrição</label>
                <textarea
                  rows={2}
                  value={catForm.description}
                  onChange={e => setCatForm({ ...catForm, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-xs font-semibold"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowCategoryForm(false)}
                  className="px-4 py-2 border rounded-sm text-xs font-bold hover:bg-slate-550 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase rounded-lg transition-colors"
                >
                  Salvar
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}
