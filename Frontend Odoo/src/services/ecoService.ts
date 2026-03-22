import apiClient from './api';
import type { ECO, CreateECORequest, PaginatedResponse, ECOApproval } from '../types';

export interface ECOStage {
  id: number;
  name: string;
  requires_approval: boolean;
  approver_role?: string | null;
  order: number;
  is_default: boolean;
}

export interface ECOStageCreateRequest {
  name: string;
  requires_approval: boolean;
  approver_role?: string | null;
  approver_user_id?: number | null;
  order?: number | null;
  is_default?: boolean;
}

export interface AdminUserOption {
  id: number;
  name: string;
  email: string;
  role: string;
}

export const ecoService = {
  getAll: async (page: number = 1, limit: number = 10): Promise<PaginatedResponse<ECO>> => {
    const response = await apiClient.get('/ecos', { params: { page, limit } });
    return response.data;
  },

  getById: async (id: string): Promise<ECO> => {
    const response = await apiClient.get(`/ecos/${id}`);
    return response.data;
  },

  create: async (data: CreateECORequest): Promise<ECO> => {
    const response = await apiClient.post('/ecos', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateECORequest>): Promise<ECO> => {
    const response = await apiClient.put(`/ecos/${id}`, data);
    return response.data;
  },

  approve: async (id: string, comments?: string): Promise<ECOApproval> => {
    const response = await apiClient.post(`/ecos/${id}/approve`, { comments });
    return response.data;
  },

  reject: async (id: string, comments?: string): Promise<ECOApproval> => {
    const response = await apiClient.post(`/ecos/${id}/reject`, { comments });
    return response.data;
  },

  getApprovals: async (id: string): Promise<ECOApproval[]> => {
    const response = await apiClient.get(`/ecos/${id}/approvals`);
    return response.data;
  },

  getStages: async (): Promise<ECOStage[]> => {
    const response = await apiClient.get('/ecos/stages');
    return response.data;
  },

  configureStages: async (): Promise<{ message: string; count: number }> => {
    const response = await apiClient.post('/ecos/stages/configure');
    return response.data;
  },

  createStage: async (data: ECOStageCreateRequest): Promise<ECOStage> => {
    const response = await apiClient.post('/ecos/stages', data);
    return response.data;
  },

  getAdminUsers: async (): Promise<AdminUserOption[]> => {
    const response = await apiClient.get('/auth/users');
    return response.data;
  },
};
