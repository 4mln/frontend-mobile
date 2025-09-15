export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  condition: 'new' | 'used' | 'refurbished';
  location: string;
  images: string[];
  specifications: ProductSpecification[];
  seller: Seller;
  rating: number;
  reviewCount: number;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface Seller {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  responseTime: string;
  verified: boolean;
  location: string;
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: string;
  location?: string;
  search?: string;
  sortBy?: 'newest' | 'price_low' | 'price_high' | 'popularity';
  page?: number;
  limit?: number;
}

export interface ProductSearchResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  condition: 'new' | 'used' | 'refurbished';
  location: string;
  images: string[];
  specifications: ProductSpecification[];
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  originalPrice?: number;
  category?: string;
  condition?: 'new' | 'used' | 'refurbished';
  location?: string;
  images?: string[];
  specifications?: ProductSpecification[];
  isAvailable?: boolean;
}









