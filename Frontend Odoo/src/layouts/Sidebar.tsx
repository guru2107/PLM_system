import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import {
  LayoutDashboard,
  Package,
  BarChart3,
  FileText,
  Settings,
  Zap,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../hooks';

const NAVIGATION = [
  { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { id: 'products', label: 'Products', href: '/products', icon: Package },
  { id: 'boms', label: 'BOMs', href: '/boms', icon: BarChart3 },
  { id: 'ecos', label: 'ECOs', href: '/ecos', icon: Zap },
  { id: 'reports', label: 'Reports', href: '/reports', icon: FileText },
];

const ADMIN_NAVIGATION = [
  { id: 'settings', label: 'Settings', href: '/settings', icon: Settings, adminOnly: true },
];

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const menuItems = [
    ...NAVIGATION,
    ...(user?.role === 'admin' ? ADMIN_NAVIGATION : []),
  ];

  return (
    <>
      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed top-0 left-0 z-40 h-full bg-white dark:bg-dark-900 shadow-sidebar transition-all duration-300 ease-out flex flex-col',
          isCollapsed ? 'w-[72px]' : 'w-[240px]'
        )}
      >
        {/* Logo area */}
        <div className={clsx(
          'h-16 flex items-center px-4 border-b border-surface-200 dark:border-dark-700',
          isCollapsed ? 'justify-center' : 'gap-3'
        )}>
          <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-soft">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          {!isCollapsed && (
            <span className="font-bold text-lg text-dark-900 dark:text-white tracking-tight">
              PLM
            </span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;

            return (
              <Link
                key={item.id}
                to={item.href}
                className={clsx(
                  'group flex items-center gap-3 rounded-xl transition-all duration-200 relative',
                  isCollapsed ? 'w-12 h-12 justify-center mx-auto' : 'px-3 py-2.5',
                  isActive
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                    : 'text-dark-500 dark:text-dark-400 hover:bg-surface-100 dark:hover:bg-dark-800 hover:text-dark-900 dark:hover:text-white'
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon size={20} className="flex-shrink-0" strokeWidth={isActive ? 2.5 : 2} />
                {!isCollapsed && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}

                {/* Active indicator dot */}
                {isActive && isCollapsed && (
                  <span className="absolute -right-0.5 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary-500 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Collapse toggle */}
        <div className="px-3 py-2">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-dark-400 hover:bg-surface-100 dark:hover:bg-dark-800 hover:text-dark-600 transition-all duration-200"
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            {!isCollapsed && <span className="text-xs font-medium">Collapse</span>}
          </button>
        </div>

        {/* User profile footer */}
        <div className="p-3 border-t border-surface-200 dark:border-dark-700">
          <div className={clsx(
            'flex items-center gap-3 p-2.5 rounded-xl bg-surface-50 dark:bg-dark-800',
            isCollapsed && 'justify-center p-2'
          )}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-xs">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <p className="text-xs font-semibold text-dark-900 dark:text-white truncate">
                  {user?.name}
                </p>
                <p className="text-[11px] text-dark-400 truncate capitalize">
                  {user?.role}
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Spacer to push content right */}
      <div className={clsx(
        'transition-all duration-300 flex-shrink-0',
        isCollapsed ? 'w-[72px]' : 'w-[240px]'
      )} />
    </>
  );
};
