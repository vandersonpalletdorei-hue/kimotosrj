import { Category, Product } from './types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'capacetes',
    name: 'Capacetes',
    icon: 'Shield',
    description: 'Capacetes integrados, escamoteáveis e abertos das melhores marcas.'
  },
  {
    id: 'pneus',
    name: 'Pneus',
    icon: 'CircleDot',
    description: 'Pneus e câmaras de ar de alta aderência para asfalto e off-road.'
  },
  {
    id: 'lubrificantes',
    name: 'Lubrificantes & Químicos',
    icon: 'Droplet',
    description: 'Lubrificantes de motor, fluidos de freio, graxas e aditivos.'
  },
  {
    id: 'acessorios',
    name: 'Acessórios & Equipamentos',
    icon: 'Sparkles',
    description: 'Luvas, capas de chuva, mochilas, travas e espelhos personalizados.'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-ls2-rapid-matte',
    name: 'Capacete LS2 Rapid Single Mono - Preto Fosco',
    category: 'capacetes',
    categoryLabel: 'Capacetes',
    brand: 'LS2',
    price: 589.90,
    originalPrice: 699.90,
    image: 'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1595348020949-87cdfbc44174?auto=format&fit=crop&q=80&w=600'
    ],
    description: 'O LS2 Rapid é sinônimo de alta segurança e design aerodinâmico. Fabricado em HPTT (High Pressure Thermoplastic Technology), uma mistura de plásticos ABS injetados sob pressão que resulta em uma estrutura leve e extremamente resistente.',
    rating: 4.8,
    reviewsCount: 124,
    isPromo: true,
    isNew: true,
    freeShipping: true,
    sizes: ['56', '58', '60', '62'],
    stock: 12,
    subcategory: 'Capacetes Fechados',
    attributes: {
      'Material': 'HPTT (Resina Termoplástica Premium)',
      'Forração': 'Removível, lavável, hipoalergênica',
      'Viseira': 'Espessura de 2mm, antirrisco e proteção UV',
      'Fecho': 'Engate micrométrico reforçado'
    }
  },
  {
    id: 'prod-norisk-razor-red',
    name: 'Capacete Norisk Razor - Solid Vermelho Brilho',
    category: 'capacetes',
    categoryLabel: 'Capacetes',
    brand: 'Norisk',
    price: 479.00,
    originalPrice: 519.00,
    image: 'https://images.unsplash.com/photo-1595348020949-87cdfbc44174?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1595348020949-87cdfbc44174?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&q=80&w=600'
    ],
    description: 'O Norisk Razor foi desenvolvido para quem busca um capacete compacto, leve e com linhas agressivas. Conta com dutos de ar perfeitamente desenhados para excelente refrigeração interna e defletor de ar embutido.',
    rating: 4.6,
    reviewsCount: 82,
    isPromo: true,
    freeShipping: false,
    sizes: ['56', '58', '60'],
    stock: 5,
    subcategory: 'Capacetes Fechados',
    attributes: {
      'Material': 'ABS de alto impacto',
      'Viseira': 'Policarbonato de classe A, antirrisco',
      'Peso': 'Apenas 1250g para conforto incomparável',
      'Ventilação': '2 entradas superiores, 1 frontal e exaustão traseira'
    }
  },
  {
    id: 'prod-pirelli-diablo-140',
    name: 'Pneu Traseiro Pirelli Diablo Rosso II - 140/70 R17 66H TL',
    category: 'pneus',
    categoryLabel: 'Pneus',
    brand: 'Pirelli',
    price: 620.00,
    originalPrice: 659.90,
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=600',
    description: 'O Pirelli Diablo Rosso II é o pneu superesportivo ideal para o uso diário e estradas sinuosas. Conta com bi-composto no pneu traseiro, o que melhora o rendimento quilométrico e garante aderência extrema em curvas de alta inclinação.',
    rating: 4.9,
    reviewsCount: 231,
    isNew: true,
    freeShipping: true,
    stock: 24,
    subcategory: 'Pneus Esportivos',
    attributes: {
      'Medida': '140/70 R17',
      'Modelo': 'Diablo Rosso II',
      'Aro': '17 Polegadas',
      'Tipo de Uso': 'Sem câmara de ar (Tubeless)'
    }
  },
  {
    id: 'prod-motul-5100',
    name: 'Óleo de Motor Motul 5100 15W50 Semissintético 4T Premium',
    category: 'lubrificantes',
    categoryLabel: 'Lubrificantes & Químicos',
    brand: 'Motul',
    price: 69.90,
    image: 'https://images.unsplash.com/photo-1635812328222-38600d869269?auto=format&fit=crop&q=80&w=600',
    description: 'Lubrificante Technosynthese® à base de Éster para motocicletas de quatro tempos. Melhora a resistência da película lubrificante em altas temperaturas e velocidades extremas, protegendo a engrenagem do câmbio e garantindo trocas de marchas suaves.',
    rating: 4.9,
    reviewsCount: 412,
    stock: 150,
    subcategory: 'Óleo de Motor',
    attributes: {
      'Viscosidade': '15W50 Semissintético',
      'Norma API': 'API SM / SL / SJ',
      'Norma JASO': 'JASO MA2 M033MOT158',
      'Volume': '1 Litro'
    }
  },
  {
    id: 'prod-luva-x11-fit-x',
    name: 'Luva X11 Fit X Meio Dedo - Neoprene e Amara',
    category: 'acessorios',
    categoryLabel: 'Acessórios & Equipamentos',
    brand: 'X11',
    price: 89.90,
    originalPrice: 99.90,
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=600',
    description: 'Para o uso diário ou pequenos trajetos, a Luva X11 Fit X meio dedo oferece ótima flexibilidade e proteção nas mãos com visual minimalista. Produzida em tecido de neoprene macio e palma reforçada em Amara.',
    rating: 4.5,
    reviewsCount: 54,
    isPromo: true,
    sizes: ['P', 'M', 'G', 'GG'],
    stock: 45,
    subcategory: 'Luvas',
    attributes: {
      'Material': 'Poliéster, Neoprene e Amara',
      'Garantia': '3 meses contra defeitos de fabricação',
      'Fecho': 'Fecho emborrachado prático no punho',
      'Proteção': 'Reforço na palma e costura reforçada'
    }
  },
  {
    id: 'prod-retrovisor-tomok',
    name: 'Par de Retrovisores Esportivos Estilo Tomok Alumínio CNC',
    category: 'acessorios',
    categoryLabel: 'Acessórios & Equipamentos',
    brand: 'Tomok',
    price: 159.00,
    originalPrice: 199.00,
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=600',
    description: 'Renove a estética da sua moto com o retrovisor esportivo Tomok. Usinado diretamente de blocos sólidos de alumínio em tornos CNC, oferece um acabamento perfeito, alta resistência a oxidação e espelhos antirreflexo azuis.',
    rating: 4.4,
    reviewsCount: 19,
    stock: 8,
    subcategory: 'Retrovisores',
    attributes: {
      'Material': 'Alumínio Anodizado T6061 CNC',
      'Espelho': 'Vidro azul especial contra ofuscamento',
      'Compatibilidade': 'Universal (Acompanha adaptadores M8/M10)',
      'Ajuste': 'Multiarticulável'
    }
  }
];
