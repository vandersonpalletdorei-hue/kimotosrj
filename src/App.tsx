// 
import { useState, useEffect } from "react";
import { Product, Category, CartItem, Banner } from "./types";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import ProductCard from "./components/ProductCard";
import CartDrawer from "./components/CartDrawer";
import CheckoutModal from "./components/CheckoutModal";
import QuickViewModal from "./components/QuickViewModal";
import InstitutionalModal from "./components/InstitutionalModal";
import AdminPanel from "./components/AdminPanel";
import Footer from "./components/Footer";
import * as LucideIcons from "lucide-react";

import INITIAL_PRODUCTS from "./products_db.json";
import INITIAL_CATEGORIES from "./categories_db.json";
import INITIAL_BANNERS from "./banners_db.json";

// Dynamic Icon Renderer for database-stored icons names
const DynamicIcon = ({
  name,
  className,
}: {
  name: string;
  className?: string;
}) => {
  const IconComp = (LucideIcons as any)[name] || LucideIcons.HelpCircle;
  return <IconComp className={className} />;
};

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<number>(999999);
  const [onlyPromos, setOnlyPromos] = useState(false);
  const [onlyFreeShipping, setOnlyFreeShipping] = useState(false);

  // Cart State (Hydrate from LocalStorage)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("kimotos_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modal open states
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [institutionalSection, setInstitutionalSection] = useState<
    string | null
  >(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);

  // Sync cart to LocalStorage on modifications
  useEffect(() => {
    localStorage.setItem("kimotos_cart", JSON.stringify(cart));
  }, [cart]);

  // Load catalogs on mount
  const loadData = async () => {
    setLoading(true);
    let loadedProducts = INITIAL_PRODUCTS as Product[];
    let loadedCategories = INITIAL_CATEGORIES as Category[];
    let loadedBanners = INITIAL_BANNERS as Banner[];

    // 1. Check local storage first (for customized state in client)
    try {
      const savedProducts = localStorage.getItem("kimotos_products");
      const savedCategories = localStorage.getItem("kimotos_categories");
      const savedBanners = localStorage.getItem("kimotos_banners");
      if (savedProducts) loadedProducts = JSON.parse(savedProducts);
      if (savedCategories) loadedCategories = JSON.parse(savedCategories);
      if (savedBanners) loadedBanners = JSON.parse(savedBanners);
    } catch (e) {
      console.warn("Failed to load from localStorage", e);
    }

    // 2. Attempt fetching from server API
    try {
      const pRes = await fetch("/api/products");
      const cRes = await fetch("/api/categories");
      const bRes = await fetch(`/api/banners?_t=${Date.now()}`);
      
      if (pRes.ok && cRes.ok) {
        const pData = await pRes.json();
        const cData = await cRes.json();
        const bData = bRes.ok ? await bRes.json() : null;
        
        if (pData.products && pData.products.length > 0) {
          loadedProducts = pData.products;
          localStorage.setItem(
            "kimotos_products",
            JSON.stringify(pData.products),
          );
        }
        if (cData.categories && cData.categories.length > 0) {
          loadedCategories = cData.categories;
          localStorage.setItem(
            "kimotos_categories",
            JSON.stringify(cData.categories),
          );
        }
        if (bData && Array.isArray(bData.banners)) {
          loadedBanners = bData.banners;
          localStorage.setItem(
            "kimotos_banners",
            JSON.stringify(bData.banners),
          );
        }
      }
    } catch (err) {
      console.log("Running in offline-fallback static state:", err);
    }



    setProducts(loadedProducts);
    setCategories(loadedCategories);
    setBanners(loadedBanners);

    // Dynamic pricing filter adjustment based on current products catalog
    if (loadedProducts.length > 0) {
      const prices = loadedProducts.map((p: Product) => p.price);
      setMaxPrice(Math.max(...prices, 1500));
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Cart operations
  const handleAddToCart = (product: Product, size?: string) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedSize === size,
      );

      if (existingIdx > -1) {
        const updated = [...prev];
        const newQty = updated[existingIdx].quantity + 1;
        // Cap quantity at current stock
        if (newQty <= product.stock) {
          updated[existingIdx].quantity = newQty;
        } else {
          alert(
            `Desculpe! Limite máximo de estoque (${product.stock} un) atingido.`,
          );
        }
        return updated;
      } else {
        return [...prev, { product, quantity: 1, selectedSize: size }];
      }
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (
    productId: string,
    size: string | undefined,
    newQty: number,
  ) => {
    if (newQty <= 0) {
      handleRemoveItem(productId, size);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.selectedSize === size
          ? { ...item, quantity: newQty }
          : item,
      ),
    );
  };

  const handleRemoveItem = (productId: string, size: string | undefined) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(item.product.id === productId && item.selectedSize === size),
      ),
    );
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Filtration logic
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.subcategory?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory
      ? p.category === selectedCategory
      : true;
    const matchesPrice = p.price <= maxPrice;
    const matchesPromo = onlyPromos ? !!p.isPromo : true;
    const matchesShipping = onlyFreeShipping ? !!p.freeShipping : true;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesPrice &&
      matchesPromo &&
      matchesShipping
    );
  });

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleCheckoutMP = async (shippingCost: number, shippingName: string) => {
    setIsCheckingOut(true);
    try {
      const checkoutItems = cart.map(item => ({
        id: item.product.id,
        title: item.product.name,
        quantity: item.quantity,
        unit_price: item.product.price,
      }));

      // Add shipping cost as a separate item if it's greater than 0
      if (shippingCost > 0) {
        checkoutItems.push({
          id: 'shipping',
          title: shippingName,
          quantity: 1,
          unit_price: shippingCost,
        });
      }

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: checkoutItems, origin: window.location.origin })
      });
      const data = await response.json();
      if (data.init_point) {
        setCheckoutUrl(data.init_point);
      } else {
        alert('Erro ao iniciar checkout do Mercado Pago.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Erro de conexão ao tentar iniciar checkout.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-800 selection:bg-red-600 selection:text-white">
      {/* 1. Header */}
      <Header
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* 2. Promo Slider Carousel (hide when active filters exist to declutter visual space) */}
      {!searchQuery && !selectedCategory && <HeroSection banners={banners} />}

      {/* 3. Main Catalog Section */}
      <main className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full">
        {/* Dynamic Category Card Rails selection */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4.5">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
              Categorias em Destaque
            </h3>
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory("")}
                className="text-[10px] uppercase font-black tracking-widest text-red-600 hover:text-slate-900 border-b border-red-500 cursor-pointer"
              >
                Ver Todas as Peças
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4.5">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <div
                  key={cat.id}
                  onClick={() => setSelectedCategory(isSelected ? "" : cat.id)}
                  className={`border p-4 rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                    isSelected
                      ? "bg-slate-900 text-white border-slate-900 shadow-lg scale-102 font-bold"
                      : "bg-white text-slate-800 border-slate-150 hover:border-slate-350 hover:shadow-xs"
                  }`}
                >
                  <div
                    className={`p-2.5 rounded-lg mb-2.5 ${isSelected ? "bg-red-600 text-white" : "bg-slate-100 text-slate-700"}`}
                  >
                    <DynamicIcon
                      name={cat.icon || "Shield"}
                      className="w-5 h-5"
                    />
                  </div>
                  <h4 className="text-xs font-bold uppercase tracking-wide leading-none">
                    {cat.name}
                  </h4>
                  <p
                    className={`text-[10px] mt-1.5 leading-tight ${isSelected ? "text-gray-400" : "text-gray-500"} hidden sm:block line-clamp-1`}
                  >
                    {cat.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Catalog and Sidebar Filter layout */}
        <section className="gap-8">
          {/* Right Product Grid catalog display panel */}
          <div className="space-y-6">
            {/* Grid Header Info */}
            <div className="flex justify-between items-center bg-white p-3 border rounded-xl shadow-xs">
              <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                Exibindo {filteredProducts.length} motopeças qualificadas
              </span>
              <div className="text-[10px] font-bold text-slate-800 px-2 py-0.5 bg-slate-100 rounded border">
                Brasil
              </div>
            </div>

            {/* Main items cards trigger loops */}
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="bg-white border rounded-xl p-4 space-y-4 shadow-xs animate-pulse"
                  >
                    <div className="aspect-square bg-slate-200 rounded-lg w-full" />
                    <div className="h-3.5 bg-slate-200 rounded w-1/3" />
                    <div className="h-6 bg-slate-200 rounded w-full" />
                    <div className="h-4 bg-slate-200 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-16 px-4 bg-white border rounded-2xl shadow-xs space-y-4">
                <div className="bg-red-50 text-red-500 p-4.5 rounded-full w-16 h-16 flex items-center justify-center mx-auto shadow-inner">
                  <LucideIcons.SearchSlash className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-slate-900 font-extrabold uppercase text-xs">
                    Motopeça não encontrada
                  </h4>
                  <p className="text-gray-400 text-xs mt-1 max-w-sm mx-auto leading-relaxed">
                    Não encontramos peças que correspondam a essa combinação de
                    filtros. Tente expandir seu campo de pesquisa ou redefinir a
                    faixa de valor máximo.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedCategory("");
                    setSearchQuery("");
                    setOnlyPromos(false);
                    setOnlyFreeShipping(false);
                    setMaxPrice(1500);
                  }}
                  className="bg-slate-900 hover:bg-red-600 text-white font-black uppercase tracking-wider text-[10px] px-4.5 py-2.5 rounded-lg transition-colors cursor-pointer"
                >
                  Ver Tudo Novamente
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                {filteredProducts.map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    onSelectProduct={setSelectedProduct}
                    onAddToCart={(p) => handleAddToCart(p, p.sizes?.[0])}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* 4. Footer */}
      <Footer onOpenInstitutional={setInstitutionalSection} />

      {/* 5. Cart Drawer panel overlay */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={(shippingCost, shippingName) => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* 6. Checkout Step process overlay */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cart}
        onClearCart={handleClearCart}
      />

      {/* 7. Quick View Modal product description card panel */}
      <QuickViewModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* 8. Institutional Rules and information details modal overlay */}
      <InstitutionalModal
        isOpen={!!institutionalSection}
        onClose={() => setInstitutionalSection(null)}
        section={institutionalSection || ""}
      />

      {/* 9. Master Admin panel Supabase hub dashboard overlay */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        categories={categories}
        banners={banners}
        onProductsUpdate={setProducts}
        onCategoriesUpdate={setCategories}
        onBannersUpdate={setBanners}
      />

      {/* 10. Floating WhatsApp Support Button */}
      <a
        href="https://wa.me/5524998359972?text=Olá!%20Gostaria%20de%20falar%20com%20a%20consultora%20Cristiane."
        target="_blank"
        rel="noopener noreferrer"
        id="floating_whatsapp_button"
        title="Chamar no WhatsApp"
        className="fixed bottom-6 right-6 z-40 bg-emerald-500 hover:bg-emerald-600 text-white p-3.5 rounded-full shadow-2xl flex items-center gap-2 group transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer overflow-hidden leading-none"
      >
        <div className="absolute inset-0 bg-white/20 animate-ping rounded-full pointer-events-none" />
        <LucideIcons.MessageSquare className="w-5 h-5 shrink-0" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-40 transition-all duration-300 ease-out text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
          Consultora Cristiane
        </span>
      </a>

      {checkoutUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm text-center">
            <h3 className="text-lg font-black text-slate-800 uppercase mb-2">Checkout Gerado</h3>
            <p className="text-sm text-slate-600 mb-6">
              O seu link de pagamento seguro foi gerado com sucesso pelo Mercado Pago.
            </p>
            <a
              href={checkoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                setCheckoutUrl(null);
                setIsCartOpen(false);
                handleClearCart();
              }}
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg uppercase tracking-wider text-sm transition-colors mb-3"
            >
              Ir para o Pagamento
            </a>
            <button
              onClick={() => setCheckoutUrl(null)}
              className="text-xs text-slate-500 hover:text-slate-700 font-semibold uppercase underline"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
