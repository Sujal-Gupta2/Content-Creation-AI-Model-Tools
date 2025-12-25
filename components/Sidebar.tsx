
import React from 'react';
import { ToolType } from '../types';

interface SidebarProps {
  activeTool: ToolType;
  setActiveTool: (tool: ToolType) => void;
  isDark: boolean;
  toggleTheme: () => void;
  isOpen?: boolean;
  hasApiKey?: boolean | null;
  requestKey?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeTool, 
  setActiveTool, 
  isDark, 
  toggleTheme, 
  isOpen, 
  hasApiKey, 
  requestKey 
}) => {
  const menuItems = [
    { id: ToolType.DASHBOARD, label: 'Dashboard', icon: '🏠' },
    { id: ToolType.ADVISOR, label: 'Strategy Advisor', icon: '💡' },
    { id: ToolType.BRAND_VOICE, label: 'Brand Voice', icon: '🎭' },
    { id: ToolType.BLOG_SEO, label: 'SEO/AEO Blogs', icon: '📝' },
    { id: ToolType.SOCIAL_POST, label: 'Static Posts', icon: '🖼️' },
    { id: ToolType.VIDEO_GEN, label: 'Video Studio', icon: '🎬' },
    { id: ToolType.CAROUSEL, label: 'Carousels', icon: '🎴' },
    { id: ToolType.INFOGRAPHIC, label: 'Infographics', icon: '📊' },
    { id: ToolType.BATCH_GEN, label: 'Batch Producer', icon: '📦' },
    { id: ToolType.ADS_COPY, label: 'Ads & Captions', icon: '📣' },
    { id: ToolType.RESEARCH, label: 'Research Lab', icon: '🔬' },
  ];

  return (
    <div className={`fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col z-50 transition-transform duration-300 transform md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="p-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-serif">
            OmniContent
          </h1>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mt-1 font-bold">Studio v3.0</p>
        </div>
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          {isDark ? '☀️' : '🌙'}
        </button>
      </div>
      
      <nav className="flex-1 overflow-y-auto px-4 space-y-1 py-4 custom-scrollbar">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTool(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all duration-200 group ${
              activeTool === item.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 translate-x-1' 
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400'
            }`}
          >
            <span className={`text-lg transition-transform group-hover:scale-110`}>{item.icon}</span>
            <span className="font-semibold text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 mt-auto border-t border-gray-100 dark:border-gray-800 space-y-3">
        {/* API Key Status Widget */}
        <div className="px-2 py-3 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Paid API Status</span>
            {hasApiKey ? (
              <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
            ) : (
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            )}
          </div>
          {hasApiKey ? (
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-gray-800 dark:text-gray-200">Verified Paid Key</span>
            </div>
          ) : (
            <button 
              onClick={requestKey}
              className="w-full text-left text-[10px] font-bold text-blue-600 hover:underline uppercase"
            >
              Setup Paid Key for Video →
            </button>
          )}
        </div>

        <div className="flex items-center space-x-3 px-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center font-bold text-xs text-white shadow-inner">
            JD
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold truncate">Premium Creator</p>
            <p className="text-[10px] text-gray-500 font-medium">Enterprise Tier</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
