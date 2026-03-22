import apiClient from './api';
import type { BOM, CreateBOMRequest, PaginatedResponse } from '../types';

export const bomService = {
  getAll: async (page: number = 1, limit: number = 10): Promise<PaginatedResponse<BOM>> => {
    const response = await apiClient.get('/boms', { params: { page, limit } });
    return response.data;
  },

  getById: async (id: string): Promise<BOM> => {
    const response = await apiClient.get(`/boms/${id}`);
    return response.data;
  },

  create: async (data: CreateBOMRequest): Promise<BOM> => {
    const response = await apiClient.post('/boms', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateBOMRequest>): Promise<BOM> => {
    const response = await apiClient.put(`/boms/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/boms/${id}`);
  },
};
