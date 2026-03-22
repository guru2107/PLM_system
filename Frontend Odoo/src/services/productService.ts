import apiClient from './api';
import type { Product, CreateProductRequest, PaginatedResponse } from '../types';

export const productService = {
  getAll: async (page: number = 1, limit: number = 10, search?: string): Promise<PaginatedResponse<Product>> => {
    const params: Record<string, any> = {};
    if (search) params.search = search;
    const response = await apiClient.get('/products', { params });
    
    // Backend returns array of products, convert to paginated format
    const products = Array.isArray(response.data) ? response.data : response.data.data || [];
    
    // Transform snake_case to camelCase
    const transformedProducts: Product[] = products.map((p: any) => ({
      id: String(p.id),
      name: p.name,
      salePrice: p.sale_price || 0,
      costPrice: p.cost_price || 0,
      version: p.version?.toString() || '1',
      status: p.status || 'active',
      description: p.description,
      sku: p.sku || '',
      createdAt: p.created_at || new Date().toISOString(),
      updatedAt: p.updated_at || new Date().toISOString(),
    }));

    // Create pagination metadata
    const total = transformedProducts.length;
    const totalPages = Math.ceil(total / limit);

    return {
      data: transformedProducts.slice((page - 1) * limit, page * limit),
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  },

  getById: async (id: string): Promise<Product> => {
    const response = await apiClient.get(`/products/${id}`);
    const p = response.data;
    return {
      id: String(p.id),
      name: p.name,
      salePrice: p.sale_price || 0,
      costPrice: p.cost_price || 0,
      version: p.version?.toString() || '1',
      status: p.status || 'active',
      description: p.description,
      sku: p.sku || '',
      createdAt: p.created_at || new Date().toISOString(),
      updatedAt: p.updated_at || new Date().toISOString(),
    };
  },

  create: async (data: CreateProductRequest): Promise<Product> => {
    const payload = {
      name: data.name,
      sale_price: data.salePrice,
      cost_price: data.costPrice,
      version: parseInt(data.version) || 1,
      status: data.status,
    };
    const response = await apiClient.post('/products', payload);
    const p = response.data;
    return {
      id: String(p.id),
      name: p.name,
      salePrice: p.sale_price || 0,
      costPrice: p.cost_price || 0,
      version: p.version?.toString() || '1',
      status: p.status || 'active',
      description: p.description,
      sku: p.sku || '',
      createdAt: p.created_at || new Date().toISOString(),
      updatedAt: p.updated_at || new Date().toISOString(),
    };
  },

  update: async (id: string, data: Partial<CreateProductRequest>): Promise<Product> => {
    const payload: any = {};
    if (data.name) payload.name = data.name;
    if (data.salePrice) payload.sale_price = data.salePrice;
    if (data.costPrice) payload.cost_price = data.costPrice;
    if (data.version) payload.version = parseInt(data.version);
    if (data.status) payload.status = data.status;
    
    const response = await apiClient.put(`/products/${id}`, payload);
    const p = response.data;
    return {
      id: String(p.id),
      name: p.name,
      salePrice: p.sale_price || 0,
      costPrice: p.cost_price || 0,
      version: p.version?.toString() || '1',
      status: p.status || 'active',
      description: p.description,
      sku: p.sku || '',
      createdAt: p.created_at || new Date().toISOString(),
      updatedAt: p.updated_at || new Date().toISOString(),
    };
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/products/${id}`);
  },
};
