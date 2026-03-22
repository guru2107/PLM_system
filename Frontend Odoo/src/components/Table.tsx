import React from 'react';
import clsx from 'clsx';
import type { TableColumn } from '../types';
import { ChevronUp, ChevronDown } from 'lucide-react';

export interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  isLoading?: boolean;
  onRowClick?: (row: T) => void;
  sortBy?: keyof T;
  sortOrder?: 'asc' | 'desc';
  onSort?: (key: keyof T) => void;
}

export const Table = React.forwardRef<HTMLTableElement, TableProps<any>>(
  ({ columns, data, isLoading, onRowClick, sortBy, sortOrder, onSort }, ref) => {
    if (isLoading) {
      return (
        <div className="card p-6">
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-gray-200 dark:bg-dark-700 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      );
    }

    if (data.length === 0) {
      return (
        <div className="card p-12 text-center">
          <p className="text-gray-500 dark:text-dark-400">No data available</p>
        </div>
      );
    }

    return (
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table
            ref={ref}
            className="w-full border-collapse"
          >
            <thead>
              <tr className="bg-gray-50 dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700">
                {columns.map((column) => (
                  <th
                    key={String(column.key)}
                    onClick={() => column.sortable && onSort?.(column.key)}
                    className={clsx(
                      'px-6 py-3 text-left text-sm font-semibold text-dark-900 dark:text-gray-100',
                      column.sortable && 'cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-700'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {column.label}
                      {column.sortable && sortBy === column.key && (
                        sortOrder === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr
                  key={idx}
                  onClick={() => onRowClick?.(row)}
                  className={clsx(
                    'border-b border-gray-200 dark:border-dark-700 transition-colors',
                    onRowClick && 'cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-800'
                  )}
                >
                  {columns.map((column) => (
                    <td
                      key={String(column.key)}
                      className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100"
                    >
                      {column.render ? column.render(row[column.key], row) : String(row[column.key])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
);

Table.displayName = 'Table';
