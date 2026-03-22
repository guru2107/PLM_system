import React from 'react';
import clsx from 'clsx';

export interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  accentColor?: string;
  className?: string;
}

export const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  ({ title, value, description, icon, trend, accentColor = 'bg-primary-50 text-primary-600', className }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          'card p-6 card-hover group',
          className
        )}
      >
        <div className="flex items-start justify-between mb-4">
          <div className={clsx(
            'w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110',
            accentColor
          )}>
            {icon}
          </div>
          {trend && (
            <div className={clsx(
              'flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold',
              trend.isPositive
                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'
                : 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
            )}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={!trend.isPositive ? 'rotate-180' : ''}>
                <path d="M6 2.5L9.5 7H2.5L6 2.5Z" fill="currentColor" />
              </svg>
              {Math.abs(trend.value)}%
            </div>
          )}
        </div>

        <p className="text-sm font-medium text-dark-400 mb-1">{title}</p>
        <p className="text-3xl font-bold text-dark-900 dark:text-white tracking-tight">{value}</p>
        {description && (
          <p className="text-xs text-dark-400 mt-2">{description}</p>
        )}

        {/* Mini sparkline decoration */}
        <div className="mt-4 flex items-end gap-0.5 h-6 opacity-40">
          {[40, 65, 50, 80, 60, 90, 70, 100, 85].map((h, i) => (
            <div
              key={i}
              className="flex-1 bg-primary-400 dark:bg-primary-500 rounded-full transition-all duration-500"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>
    );
  }
);

StatCard.displayName = 'StatCard';
