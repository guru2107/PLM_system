import React, { useEffect, useState } from 'react';
import { MainLayout } from '../layouts';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '../components';
import { ecoService, type ECOStage, type AdminUserOption } from '../services/ecoService';
import { showError, showSuccess } from '../utils/toast';

export const SettingsPage: React.FC = () => {
  const [stages, setStages] = useState<ECOStage[]>([]);
  const [users, setUsers] = useState<AdminUserOption[]>([]);
  const [isLoadingStages, setIsLoadingStages] = useState(false);
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [isCreatingStage, setIsCreatingStage] = useState(false);
  const [newStage, setNewStage] = useState({
    name: '',
    requiresApproval: false,
    approverUserId: '',
    approverRole: 'approver',
    order: '',
  });

  const loadStages = async () => {
    setIsLoadingStages(true);
    try {
      const rows = await ecoService.getStages();
      setStages(rows);
    } catch {
      setStages([]);
      showError('Failed to load ECO stages.');
    } finally {
      setIsLoadingStages(false);
    }
  };

  useEffect(() => {
    loadStages();
  }, []);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const rows = await ecoService.getAdminUsers();
        setUsers(rows);
      } catch {
        setUsers([]);
      }
    };

    loadUsers();
  }, []);

  const handleConfigureStages = async () => {
    setIsConfiguring(true);
    try {
      const result = await ecoService.configureStages();
      showSuccess(result.message || 'ECO stages configured successfully.');
      await loadStages();
    } catch (error: any) {
      showError(error?.response?.data?.detail || 'Failed to configure ECO stages.');
    } finally {
      setIsConfiguring(false);
    }
  };

  const handleCreateStage = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingStage(true);
    try {
      await ecoService.createStage({
        name: newStage.name,
        requires_approval: newStage.requiresApproval,
        approver_user_id: newStage.requiresApproval && newStage.approverUserId ? parseInt(newStage.approverUserId, 10) : null,
        approver_role: newStage.requiresApproval ? newStage.approverRole : null,
        order: newStage.order ? parseInt(newStage.order, 10) : null,
      });
      showSuccess('Stage created successfully.');
      setNewStage({
        name: '',
        requiresApproval: false,
        approverUserId: '',
        approverRole: 'approver',
        order: '',
      });
      await loadStages();
    } catch (error: any) {
      showError(error?.response?.data?.detail || 'Failed to create stage.');
    } finally {
      setIsCreatingStage(false);
    }
  };

  return (
    <MainLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-dark-900 dark:text-white mb-2">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage system configuration and rules
        </p>
      </div>

      {/* ECO Stages */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>ECO Stages</CardTitle>
            <Button size="sm" variant="primary" onClick={handleConfigureStages} isLoading={isConfiguring}>
              Configure Default Stages
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoadingStages ? (
            <div className="p-4 bg-gray-50 dark:bg-dark-800 rounded-lg text-sm text-gray-600 dark:text-gray-300">
              Loading ECO stages...
            </div>
          ) : stages.length === 0 ? (
            <div className="p-4 bg-gray-50 dark:bg-dark-800 rounded-lg text-sm text-gray-600 dark:text-gray-300">
              No ECO stages configured.
            </div>
          ) : (
            stages
              .slice()
              .sort((a, b) => a.order - b.order)
              .map((stage) => (
                <div
                  key={stage.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-800 rounded-lg"
                >
                  <div>
                    <h4 className="font-semibold text-dark-900 dark:text-white">{stage.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Stage {stage.order} of ECO workflow
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {stage.is_default && <Badge variant="info">Default</Badge>}
                    {stage.requires_approval && <Badge variant="warning">Approval Required</Badge>}
                  </div>
                </div>
              ))
          )}
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add ECO Stage Rule</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateStage} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-900 dark:text-gray-100 mb-2">Stage Name</label>
              <input
                type="text"
                className="input-field w-full"
                value={newStage.name}
                onChange={(e) => setNewStage((prev) => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-900 dark:text-gray-100 mb-2">Order (optional)</label>
              <input
                type="number"
                min="1"
                className="input-field w-full"
                value={newStage.order}
                onChange={(e) => setNewStage((prev) => ({ ...prev, order: e.target.value }))}
              />
            </div>

            <div className="md:col-span-2 flex items-center gap-2">
              <input
                id="requiresApproval"
                type="checkbox"
                className="w-4 h-4"
                checked={newStage.requiresApproval}
                onChange={(e) => setNewStage((prev) => ({ ...prev, requiresApproval: e.target.checked }))}
              />
              <label htmlFor="requiresApproval" className="text-sm text-gray-700 dark:text-gray-300">Requires approval</label>
            </div>

            {newStage.requiresApproval && (
              <>
                <div>
                  <label className="block text-sm font-medium text-dark-900 dark:text-gray-100 mb-2">Approver Role</label>
                  <select
                    className="input-field w-full"
                    value={newStage.approverRole}
                    onChange={(e) => setNewStage((prev) => ({ ...prev, approverRole: e.target.value }))}
                  >
                    <option value="approver">approver</option>
                    <option value="admin">admin</option>
                    <option value="engineering">engineering</option>
                    <option value="operations">operations</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-900 dark:text-gray-100 mb-2">Associate User (optional)</label>
                  <select
                    className="input-field w-full"
                    value={newStage.approverUserId}
                    onChange={(e) => setNewStage((prev) => ({ ...prev, approverUserId: e.target.value }))}
                  >
                    <option value="">Any user with role</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <div className="md:col-span-2 flex justify-end">
              <Button type="submit" variant="primary" isLoading={isCreatingStage}>Add Stage</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Approval Rules */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Approval Rules</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-gray-50 dark:bg-dark-800 rounded-lg">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold text-dark-900 dark:text-white">Product Changes</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Requires approval from Engineering Lead
                </p>
              </div>
              <Badge variant="success">Active</Badge>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <span className="w-2 h-2 bg-primary-500 rounded-full" />
                Engineering role
              </div>
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <span className="w-2 h-2 bg-primary-500 rounded-full" />
                Approver role
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-dark-800 rounded-lg">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold text-dark-900 dark:text-white">BOM Changes</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Requires approval from Operations Lead
                </p>
              </div>
              <Badge variant="success">Active</Badge>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <span className="w-2 h-2 bg-primary-500 rounded-full" />
                Operations role
              </div>
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <span className="w-2 h-2 bg-primary-500 rounded-full" />
                Approver role
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Roles */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>User Roles & Permissions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            {
              role: 'Admin',
              permissions: ['All access', 'System settings', 'User management'],
            },
            {
              role: 'Engineering',
              permissions: ['Create/Edit Products', 'Create ECOs', 'View Reports'],
            },
            {
              role: 'Approver',
              permissions: ['Approve ECOs', 'View Products', 'View BOMs'],
            },
            {
              role: 'Operations',
              permissions: ['View BOMs', 'Track ECO Status', 'View Reports'],
            },
          ].map((item) => (
            <div
              key={item.role}
              className="p-4 bg-gray-50 dark:bg-dark-800 rounded-lg"
            >
              <h4 className="font-semibold text-dark-900 dark:text-white mb-2">
                {item.role}
              </h4>
              <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                {item.permissions.map((perm) => (
                  <li key={perm} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
                    {perm}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle>System Health</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">API Connection</span>
            <Badge variant="success">Connected</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">Database</span>
            <Badge variant="success">Healthy</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">Last Sync</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">2 minutes ago</span>
          </div>
        </CardContent>
      </Card>
    </MainLayout>
  );
};
