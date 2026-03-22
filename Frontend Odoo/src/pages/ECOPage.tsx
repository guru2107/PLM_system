import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { MainLayout } from '../layouts';
import { Button, Modal, Stepper, Badge, Card, CardContent } from '../components';
import { apiClient } from '../services';
import { useAuth } from '../hooks';
import { showError, showSuccess } from '../utils/toast';

interface ECOItem {
  id: string;
  number: string;
  type: string;
  status: 'new' | 'approval' | 'done';
  createdAt: string;
}

export const ECOPage: React.FC = () => {
  const { user } = useAuth();
  const canCreate = user?.role === 'admin' || user?.role === 'engineering';
  const canApprove = user?.role === 'admin' || user?.role === 'approver';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedECO, setSelectedECO] = useState<ECOItem | null>(null);
  const [ecos, setEcos] = useState<ECOItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [boms, setBoms] = useState<Array<{ id: number; product_id: number }>>([]);
  const [products, setProducts] = useState<Array<{ id: number; name: string }>>([]);
  const [formData, setFormData] = useState({
    title: '',
    ecoType: 'product',
    productId: '',
    bomId: '',
    effectiveDate: '',
    versionUpdate: true,
  });

  useEffect(() => {
    const fetchEcos = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get('/ecos');
        const rawEcos = Array.isArray(response.data) ? response.data : [];
        const mapped: ECOItem[] = rawEcos.map((item: any) => ({
          id: String(item.id),
          number: `ECO-${String(item.id).padStart(4, '0')}`,
          type: item.eco_type === 'bom' ? 'BOM' : 'Product',
          status: item.status === 'applied' ? 'done' : 'approval',
          createdAt: item.created_at ?? new Date().toISOString(),
        }));
        setEcos(mapped);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEcos();
  }, []);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [productRes, bomRes] = await Promise.all([
          apiClient.get('/products'),
          apiClient.get('/boms'),
        ]);
        const productRows = Array.isArray(productRes.data) ? productRes.data : [];
        const bomRows = Array.isArray(bomRes.data) ? bomRes.data : [];
        setProducts(productRows.map((p: any) => ({ id: p.id, name: p.name })));
        setBoms(bomRows.map((b: any) => ({ id: b.id, product_id: b.product_id })));
      } catch {
        setProducts([]);
        setBoms([]);
      }
    };

    loadOptions();
  }, []);

  const ecoSteps = [
    { id: '1', label: 'New', description: 'Initial ECO creation' },
    { id: '2', label: 'Approval', description: 'Awaiting approval' },
    { id: '3', label: 'Done', description: 'Changes implemented' },
  ];

  const getStatusIndex = (status: string) => {
    switch (status) {
      case 'new':
        return 0;
      case 'approval':
        return 1;
      case 'done':
        return 2;
      default:
        return 0;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'warning';
      case 'approval':
        return 'primary';
      case 'done':
        return 'success';
      default:
        return 'gray';
    }
  };

  const refreshEcos = async () => {
    const response = await apiClient.get('/ecos');
    const rawEcos = Array.isArray(response.data) ? response.data : [];
    const mapped: ECOItem[] = rawEcos.map((item: any) => ({
      id: String(item.id),
      number: `ECO-${String(item.id).padStart(4, '0')}`,
      type: item.eco_type === 'bom' ? 'BOM' : 'Product',
      status: item.status === 'applied' ? 'done' : 'approval',
      createdAt: item.created_at ?? new Date().toISOString(),
    }));
    setEcos(mapped);
  };

  const handleApproveECO = async () => {
    if (!selectedECO) return;
    if (!canApprove) {
      showError('Only approver and admin can approve ECOs.');
      return;
    }

    try {
      await apiClient.post(`/ecos/${selectedECO.id}/approve`);
      showSuccess('ECO approved successfully.');
      setSelectedECO(null);
      await refreshEcos();
    } catch (error: any) {
      showError(error?.response?.data?.detail || 'Failed to approve ECO.');
    }
  };

  const handleCreateECO = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canCreate) {
      showError('Only engineering and admin can create ECOs.');
      return;
    }

    setIsCreating(true);
    try {
      const payload: any = {
        title: formData.title,
        eco_type: formData.ecoType,
        product_id: parseInt(formData.productId, 10),
        version_update: formData.versionUpdate,
        effective_date: formData.effectiveDate || null,
      };
      if (formData.ecoType === 'bom' && formData.bomId) {
        payload.bom_id = parseInt(formData.bomId, 10);
      }

      await apiClient.post('/ecos', payload);
      showSuccess('ECO created successfully.');
      setIsModalOpen(false);
      setFormData({
        title: '',
        ecoType: 'product',
        productId: '',
        bomId: '',
        effectiveDate: '',
        versionUpdate: true,
      });
      await refreshEcos();
    } catch (error: any) {
      showError(error?.response?.data?.detail || 'Failed to create ECO.');
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
            Engineering Change Orders
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage product and BOM changes
          </p>
        </div>
        {canCreate && (
          <Button
            variant="primary"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus size={20} />
            New ECO
          </Button>
        )}
      </div>

      {/* ECO List */}
      <div className="space-y-4">
        {isLoading ? (
          <Card>
            <CardContent className="p-6 text-sm text-gray-500 dark:text-gray-400">Loading ECOs...</CardContent>
          </Card>
        ) : ecos.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-sm text-gray-500 dark:text-gray-400">No ECOs available.</CardContent>
          </Card>
        ) : (
          ecos.map((eco) => (
            <Card
              key={eco.id}
              interactive
              onClick={() => setSelectedECO(eco)}
              className="cursor-pointer"
            >
              <CardContent className="flex items-center justify-between p-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-dark-900 dark:text-white">
                      {eco.number}
                    </h3>
                    <Badge variant={getStatusColor(eco.status)}>
                      {eco.status.charAt(0).toUpperCase() + eco.status.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {eco.type} • Created {new Date(eco.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Button variant="ghost">View Details</Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* ECO Detail Modal */}
      <Modal
        isOpen={!!selectedECO}
        onClose={() => setSelectedECO(null)}
        title={selectedECO?.number}
        description={`Type: ${selectedECO?.type}`}
      >
        <div className="space-y-6">
          {/* Stepper */}
          <div>
            <h4 className="text-sm font-semibold text-dark-900 dark:text-white mb-4">
              ECO Progress
            </h4>
            <Stepper
              steps={ecoSteps}
              currentStep={getStatusIndex(selectedECO?.status || 'new')}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-dark-700">
            {selectedECO?.status === 'approval' && canApprove && (
              <>
                <Button variant="primary" className="flex-1" onClick={handleApproveECO}>
                  Approve
                </Button>
              </>
            )}
            {selectedECO?.status === 'approval' && !canApprove && (
              <p className="text-sm text-gray-600 dark:text-gray-400 w-full text-center">
                Waiting for approver action.
              </p>
            )}
            {selectedECO?.status === 'done' && (
              <p className="text-sm text-green-600 dark:text-green-400 w-full text-center">
                ✓ This ECO has been approved and implemented
              </p>
            )}
          </div>
        </div>
      </Modal>

      {/* Create ECO Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New ECO"
        description="Submit a new engineering change order"
      >
        <form onSubmit={handleCreateECO} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-900 dark:text-gray-100 mb-2">Title</label>
            <input
              type="text"
              className="input-field w-full"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-900 dark:text-gray-100 mb-2">ECO Type</label>
            <select
              className="input-field w-full"
              value={formData.ecoType}
              onChange={(e) => setFormData((prev) => ({ ...prev, ecoType: e.target.value, bomId: '' }))}
            >
              <option value="product">Product</option>
              <option value="bom">BOM</option>
            </select>
          </div>

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

          {formData.ecoType === 'bom' && (
            <div>
              <label className="block text-sm font-medium text-dark-900 dark:text-gray-100 mb-2">BOM</label>
              <select
                className="input-field w-full"
                value={formData.bomId}
                onChange={(e) => setFormData((prev) => ({ ...prev, bomId: e.target.value }))}
                required
              >
                <option value="">Select BOM...</option>
                {boms
                  .filter((b) => !formData.productId || String(b.product_id) === formData.productId)
                  .map((b) => (
                    <option key={b.id} value={b.id}>BOM-{b.id}</option>
                  ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-dark-900 dark:text-gray-100 mb-2">Effective Date</label>
            <input
              type="date"
              className="input-field w-full"
              value={formData.effectiveDate}
              onChange={(e) => setFormData((prev) => ({ ...prev, effectiveDate: e.target.value }))}
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4"
              checked={formData.versionUpdate}
              onChange={(e) => setFormData((prev) => ({ ...prev, versionUpdate: e.target.checked }))}
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Update version</span>
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isCreating}>
              Create ECO
            </Button>
          </div>
        </form>
      </Modal>
    </MainLayout>
  );
};
