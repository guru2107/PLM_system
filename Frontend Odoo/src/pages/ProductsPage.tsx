import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { MainLayout } from '../layouts';
import { Button, Input, Modal, Table, Badge } from '../components';
import type { TableColumn } from '../types';
import { useProducts } from '../hooks';
import type { Product } from '../types';
import { showSuccess, showError } from '../utils/toast';
import { productService } from '../services';

export const ProductsPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    salePrice: '',
    costPrice: '',
    version: '1.0',
    status: 'active',
    sku: '',
  });

  const { products, meta, isLoading } = useProducts(page, 10, search, refreshTrigger);

  const columns: TableColumn<Product>[] = [
    {
      key: 'name',
      label: 'Product Name',
      sortable: true,
    },
    {
      key: 'salePrice',
      label: 'Sale Price',
      render: (value: any) => `$${parseFloat(value).toFixed(2)}`,
    },
    {
      key: 'costPrice',
      label: 'Cost Price',
      render: (value: any) => `$${parseFloat(value).toFixed(2)}`,
    },
    {
      key: 'version',
      label: 'Version',
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: any) => (
        <Badge variant={value === 'active' ? 'success' : 'gray'}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </Badge>
      ),
    },
  ];

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      await productService.create({
        name: formData.name,
        salePrice: parseFloat(formData.salePrice),
        costPrice: parseFloat(formData.costPrice),
        version: formData.version,
        status: formData.status as 'active' | 'archived',
      });
      
      showSuccess('Product created successfully!');
      setIsModalOpen(false);
      setFormData({
        name: '',
        salePrice: '',
        costPrice: '',
        version: '1.0',
        status: 'active',
        sku: '',
      });
      // Trigger refresh
      setRefreshTrigger(prev => prev + 1);
      setPage(1);
    } catch (err: any) {
      showError(err.response?.data?.detail || 'Failed to create product');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <MainLayout>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-dark-900 dark:text-white mb-2">Products</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your product catalog</p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus size={20} />
          New Product
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="mb-6">
        <Input
          placeholder="Search products..."
          icon={<Search size={18} />}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={products}
        isLoading={isLoading}
        onRowClick={(row) => {
          // Navigate to product detail
          console.log('View product:', row.id);
        }}
      />

      {/* Pagination */}
      {!isLoading && meta.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Page {meta.page} of {meta.totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              disabled={meta.page === 1}
              onClick={() => setPage(Math.max(1, page - 1))}
            >
              Previous
            </Button>
            <Button
              variant="secondary"
              disabled={meta.page === meta.totalPages}
              onClick={() => setPage(Math.min(meta.totalPages, page + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Create Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Product"
        description="Add a new product to your catalog"
      >
        <form onSubmit={handleCreateProduct} className="space-y-4">
          <Input
            label="Product Name"
            placeholder="e.g., Industrial Pump"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <Input
            label="SKU"
            placeholder="e.g., SKU-001"
            value={formData.sku}
            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Cost Price"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.costPrice}
              onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
              required
            />

            <Input
              label="Sale Price"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.salePrice}
              onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
              required
            />
          </div>

          <Input
            label="Version"
            placeholder="1.0"
            value={formData.version}
            onChange={(e) => setFormData({ ...formData, version: e.target.value })}
            required
          />

          <div>
            <label className="block text-sm font-medium text-dark-900 dark:text-gray-100 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="input-field w-full"
            >
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="flex-1" isLoading={isCreating}>
              Create Product
            </Button>
          </div>
        </form>
      </Modal>
    </MainLayout>
  );
};
