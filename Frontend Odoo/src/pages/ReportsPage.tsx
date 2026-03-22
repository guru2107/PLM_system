import React, { useEffect, useMemo, useState } from 'react';
import { MainLayout } from '../layouts';
import { Card, CardContent, Table } from '../components';
import type { TableColumn } from '../types';
import { apiClient } from '../services';

interface ReportItem {
  id: string;
  ecoNumber: string;
  type: string;
  status: string;
  changes: number;
  date: string;
}

export const ReportsPage: React.FC = () => {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [dateRange, setDateRange] = useState('30');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    const fetchEcos = async () => {
      const response = await apiClient.get('/ecos');
      const rawEcos = Array.isArray(response.data) ? response.data : [];
      const mapped: ReportItem[] = rawEcos.map((item: any) => ({
        id: String(item.id),
        ecoNumber: `ECO-${String(item.id).padStart(4, '0')}`,
        type: item.eco_type === 'bom' ? 'BOM' : 'Product',
        status: item.status === 'applied' ? 'Done' : 'Pending',
        changes: item.version_update ? 1 : 0,
        date: item.created_at ? String(item.created_at).slice(0, 10) : new Date().toISOString().slice(0, 10),
      }));
      setReports(mapped);
    };

    fetchEcos();
  }, []);

  const filteredReports = useMemo(() => {
    const now = new Date();
    return reports.filter((row) => {
      if (statusFilter && row.status.toLowerCase() !== statusFilter) return false;
      if (typeFilter && row.type.toLowerCase() !== typeFilter) return false;
      if (dateRange !== 'all') {
        const days = parseInt(dateRange, 10);
        const rowDate = new Date(row.date);
        const diffMs = now.getTime() - rowDate.getTime();
        const diffDays = Math.floor(diffMs / 86400000);
        if (diffDays > days) return false;
      }
      return true;
    });
  }, [reports, dateRange, statusFilter, typeFilter]);

  const completedCount = filteredReports.filter((r) => r.status === 'Done').length;
  const inProgressCount = filteredReports.filter((r) => r.status !== 'Done').length;

  const columns: TableColumn<ReportItem>[] = [
    { key: 'ecoNumber', label: 'ECO Number', sortable: true },
    { key: 'type', label: 'Type' },
    { key: 'status', label: 'Status' },
    { key: 'changes', label: 'Changes' },
    { key: 'date', label: 'Date' },
  ];

  return (
    <MainLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-dark-900 dark:text-white mb-2">Reports</h1>
        <p className="text-gray-600 dark:text-gray-400">
          ECO history and change tracking
        </p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-dark-900 dark:text-gray-100 mb-2">
            Date Range
          </label>
          <select className="input-field w-full" value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="all">All time</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-dark-900 dark:text-gray-100 mb-2">
            Status
          </label>
          <select className="input-field w-full" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All</option>
            <option value="done">Done</option>
            <option value="pending">Pending</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-dark-900 dark:text-gray-100 mb-2">
            Type
          </label>
          <select className="input-field w-full" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="">All</option>
            <option value="product">Product</option>
            <option value="bom">BOM</option>
          </select>
        </div>
      </div>

      {/* Reports Table */}
      <Table columns={columns} data={filteredReports} />

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Total ECOs</p>
            <p className="text-3xl font-bold text-dark-900 dark:text-white">{filteredReports.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Completed</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">{completedCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">In Progress</p>
            <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{inProgressCount}</p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};
