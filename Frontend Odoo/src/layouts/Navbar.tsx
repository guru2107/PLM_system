import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Moon, Sun, LogOut, User, Bell, Search } from 'lucide-react';
import { useAuth, useTheme } from '../hooks';
import apiClient from '../services/api';

interface NotificationItem {
  id: string;
  title: string;
  subtitle: string;
}

export const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, switchTheme } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  const [pendingApprovals, setPendingApprovals] = useState(0);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;
      setIsLoadingNotifications(true);
      try {
        const response = await apiClient.get('/ecos');
        const rows = Array.isArray(response.data) ? response.data : [];

        const pending = rows.filter((eco: any) => eco.status === 'open').length;
        setPendingApprovals(pending);

        const recent = rows
          .slice()
          .reverse()
          .slice(0, 5)
          .map((eco: any) => ({
            id: String(eco.id),
            title: eco.title || `ECO-${String(eco.id).padStart(4, '0')}`,
            subtitle: `${eco.eco_type === 'bom' ? 'BOM' : 'Product'} · ${eco.status === 'applied' ? 'Approved' : 'Pending approval'}`,
          }));

        setNotifications(recent);
      } catch {
        setPendingApprovals(0);
        setNotifications([]);
      } finally {
        setIsLoadingNotifications(false);
      }
    };

    fetchNotifications();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="h-16 bg-white dark:bg-dark-900 border-b border-surface-200 dark:border-dark-700 z-30 transition-all duration-300">
      <div className="h-full px-6 flex items-center justify-between gap-6">
        {/* Left side - Page greeting */}
        <div className="flex-shrink-0">
          <h1 className="text-lg font-semibold text-dark-900 dark:text-white hidden sm:block">
            Welcome back, <span className="text-primary-600 dark:text-primary-400">{user?.name}</span>
          </h1>
        </div>

        {/* Center - Search bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400" />
            <input
              type="text"
              placeholder="Search products, BOMs, ECOs..."
              className="w-full pl-10 pr-4 py-2.5 bg-surface-100 dark:bg-dark-800 border-0 rounded-xl text-sm text-dark-900 dark:text-gray-100 placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all duration-200"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
              }}
              className="relative p-2.5 hover:bg-surface-100 dark:hover:bg-dark-800 rounded-xl transition-all duration-200"
              title="Notifications"
            >
              <Bell size={20} className="text-dark-500 dark:text-dark-400" />
              {pendingApprovals > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-accent-red text-white text-[10px] leading-[18px] text-center rounded-full">
                  {pendingApprovals > 9 ? '9+' : pendingApprovals}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-dark-800 border border-surface-200 dark:border-dark-700 rounded-2xl shadow-lg-soft overflow-hidden animate-slide-in z-50">
                <div className="px-4 py-3 border-b border-surface-200 dark:border-dark-700 flex items-center justify-between">
                  <p className="text-sm font-semibold text-dark-900 dark:text-white">Notifications</p>
                  <span className="text-xs text-dark-400">{pendingApprovals} pending</span>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {isLoadingNotifications ? (
                    <div className="px-4 py-4 text-sm text-dark-400">Loading notifications...</div>
                  ) : notifications.length === 0 ? (
                    <div className="px-4 py-4 text-sm text-dark-400">No notifications yet.</div>
                  ) : (
                    notifications.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          navigate('/ecos');
                          setShowNotifications(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-surface-100 dark:hover:bg-dark-700 transition-colors"
                      >
                        <p className="text-sm font-medium text-dark-900 dark:text-white">{item.title}</p>
                        <p className="text-xs text-dark-400 mt-0.5">{item.subtitle}</p>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Theme toggle */}
          <button
            onClick={switchTheme}
            className="p-2.5 hover:bg-surface-100 dark:hover:bg-dark-800 rounded-xl transition-all duration-200"
            title="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun size={20} className="text-accent-yellow" />
            ) : (
              <Moon size={20} className="text-dark-500" />
            )}
          </button>

          {/* Divider */}
          <div className="h-8 w-px bg-surface-200 dark:bg-dark-700 mx-1" />

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2.5 p-1.5 pr-3 hover:bg-surface-100 dark:hover:bg-dark-800 rounded-xl transition-all duration-200"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-bold shadow-xs">
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-dark-900 dark:text-white leading-tight">
                  {user?.name}
                </p>
                <p className="text-[11px] text-dark-400 capitalize leading-tight">
                  {user?.role}
                </p>
              </div>
            </button>

            {/* Dropdown menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-dark-800 border border-surface-200 dark:border-dark-700 rounded-2xl shadow-lg-soft overflow-hidden animate-slide-in z-50">
                <div className="px-4 py-3 border-b border-surface-200 dark:border-dark-700">
                  <p className="text-sm font-semibold text-dark-900 dark:text-white">
                    {user?.name}
                  </p>
                  <p className="text-xs text-dark-400 mt-0.5">
                    {user?.email}
                  </p>
                </div>

                <div className="p-1.5">
                  <button
                    onClick={() => {
                      navigate('/profile');
                      setShowUserMenu(false);
                    }}
                    className="w-full px-3 py-2 text-sm text-dark-700 dark:text-gray-200 hover:bg-surface-100 dark:hover:bg-dark-700 flex items-center gap-2.5 rounded-xl transition-all duration-200"
                  >
                    <User size={16} />
                    Profile
                  </button>

                  <button
                    onClick={() => {
                      handleLogout();
                      setShowUserMenu(false);
                    }}
                    className="w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2.5 rounded-xl transition-all duration-200"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Close menus when clicking outside */}
      {(showUserMenu || showNotifications) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowUserMenu(false);
            setShowNotifications(false);
          }}
        />
      )}
    </nav>
  );
};
