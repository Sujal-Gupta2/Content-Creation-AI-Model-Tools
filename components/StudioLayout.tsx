
import React from 'react';

interface StudioLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
  icon: string;
}

const StudioLayout: React.FC<StudioLayoutProps> = ({ title, description, children, icon }) => {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-200 flex items-center justify-center text-2xl">
            {icon}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            <p className="text-gray-500 text-sm">{description}</p>
          </div>
        </div>
      </header>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default StudioLayout;
