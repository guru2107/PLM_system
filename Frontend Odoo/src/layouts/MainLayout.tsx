import React from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

export interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-surface-50 dark:bg-dark-950 transition-colors duration-200 flex">
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 min-w-0 flex flex-col">
        <Navbar />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 lg:p-8 max-w-[1400px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
