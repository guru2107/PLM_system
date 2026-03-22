import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Zap, BarChart3, ArrowRight, Plus, TrendingUp, Clock, CheckCircle2 } from 'lucide-react';
import { MainLayout } from '../layouts';
import { CardContent, CardDescription, Button, StatCard, SkeletonCard, Card, CardHeader, CardTitle } from '../components';
import { Badge } from '../components';

interface StatData {
  totalProducts: number;
  activeBOMs: number;
  pendingECOs: number;
}

interface RecentECO {
  id: string;
  number: string;
  type: string;
  status: 'new' | 'approval' | 'done';
  createdAt: string;
}

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<StatData | null>(null);
  const [recentECOs, setRecentECOs] = useState<RecentECO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch products count
        const productsResponse = await fetch('http://127.0.0.1:8000/products', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const products = productsResponse.ok ? await productsResponse.json() : [];
        
        // Fetch BOMs count
        const bomsResponse = await fetch('http://127.0.0.1:8000/boms', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const boms = bomsResponse.ok ? await bomsResponse.json() : [];
        
        // Fetch ECOs
        const ecosResponse = await fetch('http://127.0.0.1:8000/ecos', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const ecos = ecosResponse.ok ? await ecosResponse.json() : [];
        
        setStats({
          totalProducts: Array.isArray(products) ? products.length : 0,
          activeBOMs: Array.isArray(boms) ? boms.length : 0,
          pendingECOs: Array.isArray(ecos) ? ecos.filter((eco: any) => eco.status !== 'applied').length : 0,
        });
        
        // Map ECOs to format expected by dashboard
        const mappedECOs = Array.isArray(ecos) ? ecos.slice(0, 4).map((eco: any) => ({
          id: String(eco.id),
          number: `ECO-${String(eco.id).padStart(4, '0')}`,
          type: eco.eco_type || 'product',
          status: (eco.status === 'open' ? 'new' : eco.status === 'applied' ? 'done' : 'approval') as 'new' | 'approval' | 'done',
          createdAt: eco.created_at || new Date().toISOString(),
        })) : [];
        
        setRecentECOs(mappedECOs);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        setStats({
          totalProducts: 0,
          activeBOMs: 0,
          pendingECOs: 0,
        });
        setRecentECOs([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'new':
        return { variant: 'warning' as const, label: 'New', icon: Clock };
      case 'approval':
        return { variant: 'info' as const, label: 'In Review', icon: TrendingUp };
      case 'done':
        return { variant: 'success' as const, label: 'Completed', icon: CheckCircle2 };
      default:
        return { variant: 'gray' as const, label: status, icon: Clock };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <MainLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Page header */}
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-bold text-dark-900 dark:text-white mb-1">Dashboard</h1>
            <p className="text-sm text-dark-400">
              Overview of your PLM system activity and metrics
            </p>
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate('/products')}
          >
            <Plus size={18} />
            New Product
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {isLoading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            <>
              <StatCard
                title="Total Products"
                value={stats?.totalProducts ?? 0}
                description="Active products in system"
                icon={<Package size={22} />}
                trend={{ value: 12, isPositive: true }}
                accentColor="bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400"
              />
              <StatCard
                title="Active BOMs"
                value={stats?.activeBOMs ?? 0}
                description="Bills of Material"
                icon={<BarChart3 size={22} />}
                trend={{ value: 5, isPositive: true }}
                accentColor="bg-violet-50 text-violet-600 dark:bg-violet-900/20 dark:text-violet-400"
              />
              <StatCard
                title="Pending ECOs"
                value={stats?.pendingECOs ?? 0}
                description="Engineering Change Orders"
                icon={<Zap size={22} />}
                trend={{ value: 25, isPositive: false }}
                accentColor="bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400"
              />
            </>
          )}
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Recent ECO Activity - takes 2 cols */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div>
                  <CardTitle>Recent ECO Activity</CardTitle>
                  <CardDescription className="mt-1">Latest engineering change orders</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate('/ecos')}>
                  View All
                  <ArrowRight size={14} />
                </Button>
              </CardHeader>
              <CardContent className="space-y-2">
                {recentECOs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Zap size={32} className="text-dark-300 dark:text-dark-600 mb-3" />
                    <p className="text-sm text-dark-400">No recent ECOs</p>
                    <p className="text-xs text-dark-300 mt-1">ECOs will appear here once created</p>
                  </div>
                ) : (
                  recentECOs.map((eco) => {
                    const statusConfig = getStatusConfig(eco.status);
                    const StatusIcon = statusConfig.icon;

                    return (
                      <div
                        key={eco.id}
                        className="flex items-center justify-between p-4 bg-surface-50 dark:bg-dark-800 rounded-xl hover:bg-surface-100 dark:hover:bg-dark-700 transition-all duration-200 cursor-pointer group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-surface-100 dark:bg-dark-700 flex items-center justify-center text-dark-400 group-hover:text-dark-600 dark:group-hover:text-dark-300 transition-colors">
                            <StatusIcon size={18} />
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-dark-900 dark:text-white">
                              {eco.number}
                            </h4>
                            <p className="text-xs text-dark-400 mt-0.5">
                              {eco.type} change • {formatDate(eco.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={statusConfig.variant} dot>
                            {statusConfig.label}
                          </Badge>
                          <ArrowRight className="text-dark-300 dark:text-dark-500 group-hover:text-dark-500 dark:group-hover:text-dark-300 group-hover:translate-x-0.5 transition-all" size={16} />
                        </div>
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions - takes 1 col */}
          <div className="lg:col-span-1 space-y-5">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2.5">
                <button
                  onClick={() => navigate('/products')}
                  className="w-full flex items-center gap-3 p-3.5 bg-surface-50 dark:bg-dark-800 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/10 text-dark-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-200 group"
                >
                  <div className="w-9 h-9 rounded-lg bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 flex items-center justify-center">
                    <Package size={18} />
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-sm font-medium">Create Product</p>
                    <p className="text-xs text-dark-400">Add a new product</p>
                  </div>
                  <ArrowRight size={16} className="text-dark-300 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all" />
                </button>

                <button
                  onClick={() => navigate('/boms')}
                  className="w-full flex items-center gap-3 p-3.5 bg-surface-50 dark:bg-dark-800 rounded-xl hover:bg-violet-50 dark:hover:bg-violet-900/10 text-dark-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 transition-all duration-200 group"
                >
                  <div className="w-9 h-9 rounded-lg bg-violet-100 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                    <BarChart3 size={18} />
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-sm font-medium">Create BOM</p>
                    <p className="text-xs text-dark-400">New bill of material</p>
                  </div>
                  <ArrowRight size={16} className="text-dark-300 group-hover:text-violet-500 group-hover:translate-x-0.5 transition-all" />
                </button>

                <button
                  onClick={() => navigate('/ecos')}
                  className="w-full flex items-center gap-3 p-3.5 bg-surface-50 dark:bg-dark-800 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-900/10 text-dark-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-all duration-200 group"
                >
                  <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <Zap size={18} />
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-sm font-medium">New ECO</p>
                    <p className="text-xs text-dark-400">Start a change order</p>
                  </div>
                  <ArrowRight size={16} className="text-dark-300 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all" />
                </button>
              </CardContent>
            </Card>

            {/* System health mini card */}
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-dark-500">API Status</span>
                    <Badge variant="success" dot>Online</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-dark-500">Database</span>
                    <Badge variant="success" dot>Connected</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-dark-500">Last Sync</span>
                    <span className="text-xs text-dark-400">2 min ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
