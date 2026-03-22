import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import clsx from 'clsx';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  showClose?: boolean;
}

export const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  ({ isOpen, onClose, title, description, children, className, showClose = true }, ref) => {
    useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'unset';
      }
      return () => {
        document.body.style.overflow = 'unset';
      };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
      <div 
        className="fixed inset-0 z-50 overflow-y-auto"
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black/50 transition-opacity animate-fade-in" />

        {/* Modal */}
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
          <div
            ref={ref}
            onClick={(e) => e.stopPropagation()}
            className={clsx(
              'card w-full max-w-lg transform transition-all animate-slide-in',
              className
            )}
          >
            {/* Header */}
            {(title || showClose) && (
              <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-dark-700">
                <div>
                  {title && (
                    <h3 className="text-lg font-bold text-dark-900 dark:text-white">
                      {title}
                    </h3>
                  )}
                  {description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {description}
                    </p>
                  )}
                </div>
                {showClose && (
                  <button
                    onClick={onClose}
                    className="ml-auto text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            )}

            {/* Content */}
            <div className="mt-4">
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

Modal.displayName = 'Modal';
