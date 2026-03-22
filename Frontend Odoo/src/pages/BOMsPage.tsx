import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { MainLayout } from '../layouts';
import { Button, Modal, Table } from '../components';
import type { TableColumn } from '../types';
import { apiClient } from '../services';
import { useAuth } from '../hooks';
import { showError, showSuccess } from '../utils/toast';

interface BOM {
  id: string;
  name: string;
  productName: string;
  version: string;
  materialCount: number;
  status: 'active' | 'archived';
}

export const BOMsPage: React.FC = () => {
  const { user } = useAuth();
  const canCreate = user?.role === 'admin' || user?.role === 'engineering';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [boms, setBoms] = useState<BOM[]>([]);
  const [products, setProducts] = useState<Array<{ id: number; name: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    productId: '',
    componentName: '',
    quantity: '1',
    unit: 'pcs',
    operationName: '',
    durationMinutes: '10',
    workCenter: '',
  });

  useEffect(() => {
    const fetchBoms = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get('/boms');
        const rawBoms = Array.isArray(response.data) ? response.data : [];
        const mapped: BOM[] = rawBoms.map((item: any) => ({
          id: String(item.id),
          name: `BOM-${item.id}`,
          productName: `Product #${item.product_id}`,
          version: String(item.version ?? 1),
          materialCount: Array.isArray(item.components) ? item.components.length : 0,
          status: item.status === 'archived' ? 'archived' : 'active',
        }));
        setBoms(mapped);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBoms();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiClient.get('/products');
        const rows = Array.isArray(response.data) ? response.data : [];
        setProducts(rows.map((p: any) => ({ id: p.id, name: p.name })));
      } catch {
        setProducts([]);
      }
    };

    fetchProducts();
  }, []);

  const columns: TableColumn<BOM>[] = [
    { key: 'name', label: 'BOM Name', sortable: true },
    { key: 'productName', label: 'Product' },
    { key: 'version', label: 'Version' },
    { key: 'materialCount', label: 'Materials' },
    {
      key: 'status',
      label: 'Status',
      render: (value: any) => (
        <span className={`text-sm font-medium ${value === 'active' ? 'text-green-600' : 'text-gray-500'}`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      ),
    },
  ];

  const handleCreateBOM = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canCreate) {
      showError('Only engineering and admin can create BOMs.');
      return;
    }

    setIsCreating(true);
    try {
      const payload = {
        product_id: parseInt(formData.productId, 10),
        components: [
          {
            component_name: formData.componentName,
            quantity: parseFloat(formData.quantity),
            unit: formData.unit,
          },
        ],
        operations: [
          {
            operation_name: formData.operationName,
            duration_minutes: parseInt(formData.durationMinutes, 10),
            work_center: formData.workCenter,
          },
        ],
      };

      await apiClient.post('/boms', payload);
      showSuccess('BOM created successfully.');
      setIsModalOpen(false);
      setFormData({
        productId: '',
        componentName: '',
        quantity: '1',
        unit: 'pcs',
        operationName: '',
        durationMinutes: '10',
        workCenter: '',
      });

      const refresh = await apiClient.get('/boms');
      const rawBoms = Array.isArray(refresh.data) ? refresh.data : [];
      const mapped: BOM[] = rawBoms.map((item: any) => ({
        id: String(item.id),
        name: `BOM-${item.id}`,
        productName: `Product #${item.product_id}`,
        version: String(item.version ?? 1),
        materialCount: Array.isArray(item.components) ? item.components.length : 0,
        status: item.status === 'archived' ? 'archived' : 'active',
      }));
      setBoms(mapped);
    } catch (error: any) {
      showError(error?.response?.data?.detail || 'Failed to create BOM.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <MainLayout>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-dark-900 dark:text-white mb-2">
            Bills of Materials
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Manage BOMs and components</p>
        </div>
        {canCreate && (
          <Button
            variant="primary"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus size={20} />
            New BOM
          </Button>
        )}
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={boms}
        isLoading={isLoading}
        onRowClick={() => {
          console.log('View BOM details');
        }}
      />

      {/* Create BOM Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New BOM"
        description="Create a new Bill of Materials"
      >
        <form onSubmit={handleCreateBOM} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-900 dark:text-gray-100 mb-2">Product</label>
            <select
              className="input-field w-full"
              value={formData.productId}
              onChange={(e) => setFormData((prev) => ({ ...prev, productId: e.target.value }))}
              required
            >
              <option value="">Select product...</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-dark-900 dark:text-gray-100 mb-2">Component</label>
              <input
                type="text"
                className="input-field w-full"
                value={formData.componentName}
                onChange={(e) => setFormData((prev) => ({ ...prev, componentName: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-900 dark:text-gray-100 mb-2">Quantity</label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                className="input-field w-full"
                value={formData.quantity}
                onChange={(e) => setFormData((prev) => ({ ...prev, quantity: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1">
              <label className="block text-sm font-medium text-dark-900 dark:text-gray-100 mb-2">Unit</label>
              <input
                type="text"
                className="input-field w-full"
                value={formData.unit}
                onChange={(e) => setFormData((prev) => ({ ...prev, unit: e.target.value }))}
                required
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-dark-900 dark:text-gray-100 mb-2">Operation</label>
              <input
                type="text"
                className="input-field w-full"
                value={formData.operationName}
                onChange={(e) => setFormData((prev) => ({ ...prev, operationName: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-dark-900 dark:text-gray-100 mb-2">Duration (min)</label>
              <input
                type="number"
                min="1"
                className="input-field w-full"
                value={formData.durationMinutes}
                onChange={(e) => setFormData((prev) => ({ ...prev, durationMinutes: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-900 dark:text-gray-100 mb-2">Work center</label>
              <input
                type="text"
                className="input-field w-full"
                value={formData.workCenter}
                onChange={(e) => setFormData((prev) => ({ ...prev, workCenter: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isCreating}>
              Create BOM
            </Button>
          </div>
        </form>
      </Modal>
    </MainLayout>
  );
};
