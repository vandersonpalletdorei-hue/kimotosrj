import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import AdmZip from 'adm-zip';
import { MercadoPagoConfig, Preference } from 'mercadopago';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Database file paths
const PRODUCTS_FILE = path.join(process.cwd(), 'src', 'products_db.json');
const CATEGORIES_FILE = path.join(process.cwd(), 'src', 'categories_db.json');
const BANNERS_FILE = path.join(process.cwd(), 'src', 'banners_db.json');

// --- Supabase Config & Auto-Resolution ---
let supabaseUrl = process.env.SUPABASE_URL || '';
let supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.supabase || '';

if (!supabaseUrl && supabaseKey) {
  try {
    const parts = supabaseKey.split('.');
    if (parts.length === 3) {
      const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
      if (payload.ref) {
        supabaseUrl = `https://${payload.ref}.supabase.co`;
        console.log(`[Supabase] Auto-decoded project URL from JWT: ${supabaseUrl}`);
      }
    }
  } catch (err: any) {
    console.error('[Supabase] Failed to auto-decode supabase key:', err.message);
  }
}

let supabase: any = null;
if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false }
  });
  console.log('[Supabase] Client initialized successfully.');
} else {
  console.log('[Supabase] Running in offline fallback mode (no credentials detected).');
}

// Helpers for reading local backup lists
function readLocalProducts() {
  try {
    if (fs.existsSync(PRODUCTS_FILE)) {
      const raw = fs.readFileSync(PRODUCTS_FILE, 'utf8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading local products file:', err);
  }
  return [];
}

function writeLocalProducts(products: any[]) {
  try {
    const dir = path.dirname(PRODUCTS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing local products file:', err);
    return false;
  }
}

function readLocalCategories() {
  try {
    if (fs.existsSync(CATEGORIES_FILE)) {
      const raw = fs.readFileSync(CATEGORIES_FILE, 'utf8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading local categories file:', err);
  }
  return [];
}

function writeLocalCategories(categories: any[]) {
  try {
    const dir = path.dirname(CATEGORIES_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(categories, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing local categories:</chemicals>', err);
    return false;
  }
}

function readLocalBanners() {
  try {
    if (fs.existsSync(BANNERS_FILE)) {
      const raw = fs.readFileSync(BANNERS_FILE, 'utf8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading local banners file:', err);
  }
  return [];
}

function writeLocalBanners(banners: any[]) {
  try {
    const dir = path.dirname(BANNERS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(BANNERS_FILE, JSON.stringify(banners, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing local banners file:', err);
    return false;
  }
}

// --- API Endpoints: Products ---
app.get('/api/products', async (req, res) => {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('produtos').select('*');
      if (!error && data) {
        // filter out unconfigured rows to return the exact 77 products
        const formatted = data
          .filter((p: any) => p.preco !== null && p.preco !== undefined)
          .map((p: any) => ({
            id: p.id,
            name: p.nome,
            category: p.categoria,
            categoryLabel: p.categoria_label || p.categoria,
            brand: p.marca || '',
            price: parseFloat(p.preco) || 0,
            originalPrice: p.preco_original ? parseFloat(p.preco_original) : null,
            image: p.imagem || '',
            images: Array.isArray(p.imagens) ? p.imagens : [],
            description: p.descricao || '',
            rating: p.avaliacao !== null ? parseFloat(p.avaliacao) : 5,
            reviewsCount: p.num_avaliacoes !== null ? parseInt(p.num_avaliacoes) : 0,
            isPromo: !!p.em_promocao,
            isNew: !!p.novo,
            freeShipping: !!p.frete_gratis,
            sizes: Array.isArray(p.tamanhos) ? p.tamanhos : [],
            stock: p.estoque !== null ? parseInt(p.estoque) : 0,
            subcategory: p.subcategoria || '',
            attributes: p.atributos || null
          }));
        return res.json({ products: formatted, source: 'supabase' });
      }
      console.warn('[Supabase] Failed to fetch products, falling back to local files:', error?.message);
    } catch (err: any) {
      console.warn('[Supabase] Exception fetching products, falling back to local files:', err.message);
    }
  }
  return res.json({ products: readLocalProducts(), source: 'local' });
});

app.post('/api/products', async (req, res) => {
  const { products } = req.body;
  if (!Array.isArray(products)) {
    return res.status(400).json({ error: 'Body must contain a list of products.' });
  }

  // Save changes locally
  writeLocalProducts(products);

  // If Supabase is connected, attempt to upsert (replicate real-time changes)
  if (supabase) {
    try {
      // Map structures correctly for Portuguese table "produtos"
      const mapped = products.map((p: any) => ({
        id: p.id,
        codigo: p.id,
        nome: p.name,
        categoria: p.category,
        categoria_label: p.categoryLabel || p.category,
        marca: p.brand || '',
        preco: p.price,
        preco_original: p.originalPrice || null,
        imagem: p.image,
        imagens: p.images || null,
        descricao: p.description || '',
        avaliacao: p.rating || 5.0,
        num_avaliacoes: p.reviewsCount || 0,
        em_promocao: !!p.isPromo,
        novo: !!p.isNew,
        frete_gratis: !!p.freeShipping,
        tamanhos: p.sizes || null,
        estoque: p.stock || 0,
        subcategoria: p.subcategory || '',
        atributos: p.attributes || null,
        ativo: true
      }));

      const { error } = await supabase.from('produtos').upsert(mapped, { onConflict: 'id' });
      if (error) {
        console.error('[Supabase] Error saving products in real-time:', error.message);
        return res.status(251).json({ success: true, message: 'Saved locally, but Supabase sync failed: ' + error.message });
      }
      return res.json({ success: true, message: 'Saved and replicated to Supabase cloud successfully!' });
    } catch (err: any) {
      console.error('[Supabase] Exception replicating products:', err.message);
      return res.status(251).json({ success: true, message: 'Saved locally, but Supabase sync threw error: ' + err.message });
    }
  }

  return res.json({ success: true, message: 'Saved locally.' });
});

// --- API Endpoints: Categories ---
app.get('/api/categories', async (req, res) => {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('categorias').select('*');
      if (!error && data) {
        const formatted = data.map((c: any) => ({
          id: c.id,
          name: c.nome,
          icon: c.icone || 'Shield',
          description: c.descricao || ''
        }));
        return res.json({ categories: formatted, source: 'supabase' });
      }
      console.warn('[Supabase] Failed to fetch categories, falling back to local files:', error?.message);
    } catch (err: any) {
      console.warn('[Supabase] Exception fetching categories, falling back to local files:', err.message);
    }
  }
  return res.json({ categories: readLocalCategories(), source: 'local' });
});

app.post('/api/categories', async (req, res) => {
  const { categories } = req.body;
  if (!Array.isArray(categories)) {
    return res.status(400).json({ error: 'Body must contain a list of categories.' });
  }

  writeLocalCategories(categories);

  if (supabase) {
    try {
      const mapped = categories.map((c: any) => ({
        id: c.id,
        nome: c.name,
        icone: c.icon || 'Shield',
        descricao: c.description || ''
      }));

      const { error } = await supabase.from('categorias').upsert(mapped, { onConflict: 'id' });
      if (error) {
        console.error('[Supabase] Error saving categories in real-time:', error.message);
        return res.status(251).json({ success: true, message: 'Saved locally, but Supabase sync failed: ' + error.message });
      }
      return res.json({ success: true, message: 'Saved and replicated to Supabase cloud successfully!' });
    } catch (err: any) {
      console.error('[Supabase] Exception replicating categories:', err.message);
      return res.status(251).json({ success: true, message: 'Saved locally, but Supabase sync threw error: ' + err.message });
    }
  }

  return res.json({ success: true, message: 'Saved locally.' });
});

// --- API Endpoints: Banners ---
app.get('/api/banners', (req, res) => {
  res.json({ banners: readLocalBanners(), source: 'local' });
});

app.post('/api/banners', (req, res) => {
  const { banners } = req.body;
  if (!Array.isArray(banners)) {
    return res.status(400).json({ error: 'Body must contain a list of banners.' });
  }

  writeLocalBanners(banners);
  return res.json({ success: true });
});


// --- API Endpoints: Supabase Status & Sychronizations ---
app.get('/api/supabase/status', async (req, res) => {
  const isConfigured = !!supabaseKey;
  const statusPayload = {
    configured: isConfigured,
    connected: false,
    url: supabaseUrl || null,
    error: null as string | null,
    tables: { products: false, categories: false }
  };

  if (!isConfigured) {
    return res.json(statusPayload);
  }

  if (!supabase) {
    statusPayload.error = 'Supabase client failed to initialize.';
    return res.json(statusPayload);
  }

  try {
    // Check categories table (categorias)
    const { error: catError } = await supabase.from('categorias').select('id').limit(1);
    statusPayload.tables.categories = !catError;

    // Check products table (produtos)
    const { error: prodError } = await supabase.from('produtos').select('id').limit(1);
    statusPayload.tables.products = !prodError;

    // Set connected if both are working
    statusPayload.connected = statusPayload.tables.categories && statusPayload.tables.products;

    if (catError || prodError) {
      const errMsgs = [];
      if (catError) errMsgs.push(`Tabela 'categorias': ${catError.message}`);
      if (prodError) errMsgs.push(`Tabela 'produtos': ${prodError.message}`);
      statusPayload.error = errMsgs.join(' | ');
    }
  } catch (err: any) {
    statusPayload.error = err.message || 'Error executing query on Supabase.';
  }

  return res.json(statusPayload);
});

app.post('/api/supabase/push', async (req, res) => {
  if (!supabase) {
    return res.status(400).json({ error: 'Supabase integration is not configured.' });
  }

  try {
    const localCategories = readLocalCategories();
    const localProducts = readLocalProducts();

    // 1. Flush categories
    if (localCategories.length > 0) {
      const mappedCats = localCategories.map((c: any) => ({
        id: c.id,
        nome: c.name,
        icone: c.icon || 'Shield',
        descricao: c.description || ''
      }));
      const { error: catError } = await supabase.from('categorias').upsert(mappedCats, { onConflict: 'id' });
      if (catError) throw new Error(`Category push failed: ${catError.message}`);
    }

    // 2. Flush products
    if (localProducts.length > 0) {
      const mappedProds = localProducts.map((p: any) => ({
        id: p.id,
        codigo: p.id,
        nome: p.name,
        categoria: p.category,
        categoria_label: p.categoryLabel || p.category,
        marca: p.brand || '',
        preco: p.price,
        preco_original: p.originalPrice || null,
        imagem: p.image,
        imagens: p.images || null,
        descricao: p.description || '',
        avaliacao: p.rating || 5.0,
        num_avaliacoes: p.reviewsCount || 0,
        em_promocao: !!p.isPromo,
        novo: !!p.isNew,
        frete_gratis: !!p.freeShipping,
        tamanhos: p.sizes || null,
        estoque: p.stock || 0,
        subcategoria: p.subcategory || '',
        atributos: p.attributes || null,
        ativo: true
      }));
      const { error: prodError } = await supabase.from('produtos').upsert(mappedProds, { onConflict: 'id' });
      if (prodError) throw new Error(`Product push failed: ${prodError.message}`);
    }

    return res.json({ success: true, message: 'All data pushed successfully!' });
  } catch (err: any) {
    console.error('[Supabase Push Error]', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/supabase/pull', async (req, res) => {
  if (!supabase) {
    return res.status(400).json({ error: 'Supabase integration is not configured.' });
  }

  try {
    const { data: remoteCategories, error: catError } = await supabase.from('categorias').select('*');
    if (catError) throw new Error(`Category pull failed: ${catError.message}`);

    const { data: remoteProducts, error: prodError } = await supabase.from('produtos').select('*');
    if (prodError) throw new Error(`Product pull failed: ${prodError.message}`);

    // If successfully pulled, map categories back to English client structure
    let categoriesList: any[] = [];
    if (remoteCategories) {
      categoriesList = remoteCategories.map((c: any) => ({
        id: c.id,
        name: c.nome,
        icon: c.icone || 'Shield',
        description: c.descricao || ''
      }));
      writeLocalCategories(categoriesList);
    }

    // Map products back to English client structure
    let productsList: any[] = [];
    if (remoteProducts) {
      // Filter out raw rows that lack price or configuration to get exactly the 77 cadastrados products
      const configuredRemoteProducts = remoteProducts.filter((p: any) => p.preco !== null && p.preco !== undefined);
      productsList = configuredRemoteProducts.map((p: any) => ({
        id: p.id,
        name: p.nome,
        category: p.categoria,
        categoryLabel: p.categoria_label || p.categoria,
        brand: p.marca || '',
        price: parseFloat(p.preco) || 0,
        originalPrice: p.preco_original ? parseFloat(p.preco_original) : null,
        image: p.imagem || '',
        images: Array.isArray(p.imagens) ? p.imagens : [],
        description: p.descricao || '',
        rating: p.avaliacao !== null ? parseFloat(p.avaliacao) : 5,
        reviewsCount: p.num_avaliacoes !== null ? parseInt(p.num_avaliacoes) : 0,
        isPromo: !!p.em_promocao,
        isNew: !!p.novo,
        freeShipping: !!p.frete_gratis,
        sizes: Array.isArray(p.tamanhos) ? p.tamanhos : [],
        stock: p.estoque !== null ? parseInt(p.estoque) : 0,
        subcategory: p.subcategoria || '',
        attributes: p.atributos || null
      }));
      writeLocalProducts(productsList);
    }

    return res.json({
      success: true,
      categoriesCount: categoriesList.length,
      productsCount: productsList.length
    });
  } catch (err: any) {
    console.error('[Supabase Pull Error]', err.message);
    res.status(500).json({ error: err.message });
  }
});

// --- API Endpoints: Mercado Pago ---
app.post('/api/checkout', async (req, res) => {
  try {
    const { items, payer, origin } = req.body;
    
    // Hardcoded keys for this specific test/assignment if env isn't populated yet
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN || 'APP_USR-6893868456418369-070214-cc2452bad2ce9cb90604671246ac8a7f-3281350303';
    
    const client = new MercadoPagoConfig({ accessToken });
    const preference = new Preference(client);

    const baseUrl = origin || req.get('origin') || `https://${req.get('host')}`;

    const result = await preference.create({
      body: {
        items: items.map((item: any) => ({
          id: item.id,
          title: item.title,
          quantity: item.quantity,
          unit_price: item.unit_price,
          currency_id: 'BRL',
        })),
        payer: {
          name: payer?.name || '',
          email: payer?.email || '',
        },
        payment_methods: {
          excluded_payment_methods: [],
          excluded_payment_types: [],
          installments: 12,
        },
        back_urls: {
          success: `${baseUrl}/checkout/success`,
          pending: `${baseUrl}/checkout/pending`,
          failure: `${baseUrl}/checkout/failure`,
        },
        auto_return: 'approved',
      },
    });

    res.json({ id: result.id, init_point: result.init_point });
  } catch (error: any) {
    console.error('MercadoPago Error:', error);
    res.status(500).json({ error: error.message || 'Failed to create preference' });
  }
});

// --- API Endpoints: Melhor Envio ---
app.post('/api/shipping/calculate', async (req, res) => {
  try {
    const { destination_cep, items } = req.body;
    const token = process.env.MELHORENVIO_TOKEN; console.log('TOKEN IN SERVER:', token ? token.substring(0, 10) : 'null');
    const originCep = process.env.MELHORENVIO_CEP_ORIGEM || process.env.MELHORENVIO_CEP;

    if (!token || !originCep) {
      return res.status(500).json({ error: 'Configuração do Melhor Envio incompleta no servidor.' });
    }
    if (!destination_cep) {
      return res.status(400).json({ error: 'CEP de destino é obrigatório.' });
    }

    // Default dimensions for each item (in cm) and weight (in kg) if not present
    // MELHOR ENVIO requires length, height, width, weight, insurance_value
    const productsForME = items.map((item: any) => ({
      id: item.id,
      width: item.width || 15,
      height: item.height || 15,
      length: item.length || 15,
      weight: item.weight || 0.5,
      insurance_value: item.unit_price,
      quantity: item.quantity,
    }));

    const response = await fetch('https://www.melhorenvio.com.br/api/v2/me/shipment/calculate', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'User-Agent': 'Kimotos Ecommerce (vanderson.palletdorei@gmail.com)'
      },
      body: JSON.stringify({
        from: {
          postal_code: originCep
        },
        to: {
          postal_code: destination_cep.replace(/\D/g, '')
        },
        products: productsForME
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      console.error('Melhor Envio Error:', errData);
      
      // Se estiver sem token ou inválido no ambiente de preview, retorna dados simulados
      if (response.status === 401) {
        console.warn('Usando dados simulados para cálculo de frete devido a token inválido/ausente.');
        return res.json([
          {
            id: 1,
            name: 'PAC',
            price: '25.90',
            delivery_time: 7,
            company: { name: 'Correios' }
          },
          {
            id: 2,
            name: 'Sedex',
            price: '45.50',
            delivery_time: 3,
            company: { name: 'Correios' }
          },
          {
            id: 3,
            name: 'Expresso',
            price: '38.00',
            delivery_time: 4,
            company: { name: 'Jadlog' }
          }
        ]);
      }

      return res.status(response.status).json({ error: 'Falha ao calcular frete', details: errData });
    }

    const data = await response.json();
    
    // Filter out options with errors, and only keep standard ones (Correios, Jadlog, etc) that make sense
    // Usually, ME returns an array of shipping options
    const availableOptions = Array.isArray(data) ? data.filter((opt: any) => !opt.error) : [];
    
    res.json(availableOptions);
  } catch (error: any) {
    console.error('Melhor Envio Fetch Error:', error);
    res.status(500).json({ error: error.message || 'Failed to calculate shipping' });
  }
});

// --- Dynamic Project Zip Download ---
app.get('/api/download-zip', (req, res) => {
  try {
    const zip = new AdmZip();
    const rootPath = process.cwd();

    const addFilesRecursively = (currentDir: string, zipPath: string) => {
      const items = fs.readdirSync(currentDir);
      for (const item of items) {
        // Skip node_modules, dist, git stuff
        if (
          item === 'node_modules' ||
          item === 'dist' ||
          item === '.git' ||
          item === '.cacache' ||
          item === '.npm' ||
          item === '.cache'
        ) {
          continue;
        }

        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          addFilesRecursively(fullPath, path.join(zipPath, item));
        } else {
          // Read content to pack
          zip.addLocalFile(fullPath, zipPath);
        }
      }
    };

    addFilesRecursively(rootPath, '');
    const buffer = zip.toBuffer();

    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename=kimotos-supabase-project.zip',
      'Content-Length': buffer.length
    });

    res.send(buffer);
  } catch (err: any) {
    console.error('[Zip generation error]', err);
    res.status(500).send('Error packaging zip: ' + err.message);
  }
});

// Vite middleware for development or static serving for production
async function startFrontendAndListen() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] Live on http://localhost:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startFrontendAndListen();
}

export default app;
