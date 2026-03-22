import apiClient from './api';
import type { AuthResponse, LoginRequest } from '../types';

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    // Backend expects JSON with email/password, returns { access_token, token_type }
    const tokenResponse = await apiClient.post('/auth/login', {
      email: data.email,
      password: data.password,
    });

    const accessToken = tokenResponse.data.access_token;
    localStorage.setItem('token', accessToken);

    // Fetch user profile now that we have the token
    const userResponse = await apiClient.get('/auth/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const user = userResponse.data;
    localStorage.setItem('user', JSON.stringify(user));

    return { token: accessToken, user };
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};
