import React from 'react';
import clsx from 'clsx';
import { cva, type VariantProps } from 'class-variance-authority';

const badgeVariants = cva('inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide', {
  variants: {
    variant: {
      primary: 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400',
      success: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
      warning: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
      danger: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
      info: 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400',
      gray: 'bg-surface-100 dark:bg-dark-800 text-dark-500 dark:text-dark-400',
      orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
    },
  },
  defaultVariants: {
    variant: 'gray',
  },
});

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, dot, children, ...props }, ref) => (
    <div ref={ref} className={clsx(badgeVariants({ variant }), className)} {...props}>
      {dot && (
        <span className={clsx(
          'w-1.5 h-1.5 rounded-full',
          variant === 'success' && 'bg-emerald-500',
          variant === 'warning' && 'bg-amber-500',
          variant === 'danger' && 'bg-red-500',
          variant === 'primary' && 'bg-primary-500',
          variant === 'info' && 'bg-violet-500',
          variant === 'orange' && 'bg-orange-500',
          (!variant || variant === 'gray') && 'bg-dark-400',
        )} />
      )}
      {children}
    </div>
  )
);

Badge.displayName = 'Badge';
