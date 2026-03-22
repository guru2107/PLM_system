import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import { Button, Input } from '../components';
import { useAuth } from '../hooks';
import { showSuccess, showError } from '../utils/toast';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await login(formData.email, formData.password);
      showSuccess('Login successful!');
      navigate('/dashboard');
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.statusText ||
        err.message ||
        'Login failed. Please try again.';
      setError(errorMessage);
      showError(errorMessage);
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-surface-50 dark:from-dark-950 dark:via-dark-900 dark:to-dark-950 flex items-center justify-center p-4">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-200/30 dark:bg-primary-900/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary-100/40 dark:bg-primary-900/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-[420px] relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-500 rounded-2xl mb-5 shadow-soft">
            <span className="text-white font-bold text-2xl">P</span>
          </div>
          <h1 className="text-3xl font-bold text-dark-900 dark:text-white tracking-tight">
            PLM System
          </h1>
          <p className="text-dark-400 mt-2 text-sm">Product Lifecycle Management</p>
        </div>

        {/* Card */}
        <div className="card p-8">
          <h2 className="text-xl font-semibold text-dark-900 dark:text-white mb-6">
            Welcome back
          </h2>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800/30 rounded-xl flex gap-3">
              <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              icon={<Mail size={18} />}
              placeholder="you@example.com"
              required
            />

            <Input
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              icon={<Lock size={18} />}
              placeholder="••••••••"
              required
            />

            <Button type="submit" variant="primary" className="w-full mt-6" size="lg" isLoading={isLoading}>
              Sign in
              <ArrowRight size={18} />
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-surface-200 dark:border-dark-700">
            <p className="text-sm text-dark-400 text-center">
              Need an account? Contact your system administrator.
            </p>
          </div>
        </div>

        <div className="mt-4 p-4 bg-white/60 dark:bg-dark-800/60 backdrop-blur-sm border border-surface-200 dark:border-dark-700 rounded-2xl text-center">
          <p className="text-xs text-dark-400">Use credentials created by your administrator.</p>
        </div>
      </div>
    </div>
  );
};
