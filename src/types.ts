export interface Category {
  id: string;
  name: string;
  icon?: string;
  description?: string;
}

export interface Product {
  id: string;
  name: string;
  category: string; // matches Category.id
  categoryLabel?: string;
  brand?: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  description: string;
  rating: number;
  reviewsCount: number;
  isPromo?: boolean;
  isNew?: boolean;
  freeShipping?: boolean;
  sizes?: string[];
  stock: number;
  subcategory?: string;
  attributes?: Record<string, string>;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}
