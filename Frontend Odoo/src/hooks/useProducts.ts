import { useEffect, useState } from 'react';
import type { Product, PaginatedResponse } from '../types';
import { productService } from '../services';

export const useProducts = (page: number = 1, limit: number = 10, search?: string, refreshTrigger?: number) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response: PaginatedResponse<Product> = await productService.getAll(page, limit, search);
        setProducts(response.data);
        setMeta(response.meta);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch products');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [page, limit, search, refreshTrigger]);

  return { products, meta, isLoading, error };
};
