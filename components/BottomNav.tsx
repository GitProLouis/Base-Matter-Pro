import React from 'react';
import { Home, PlaySquare, Map, Users, TrendingUp, Settings } from 'lucide-react';
import { AppTab } from '../types';

interface BottomNavProps { activeTab: AppTab; setActiveTab: (tab: AppTab) => void; }

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: AppTab.HOME, icon: Home },
    { id: AppTab.CLASSES, icon: PlaySquare },
    { id: AppTab.RUN, icon: Map },
    { id: AppTab.PROGRESS, icon: TrendingUp },
    { id: AppTab.SETTINGS, icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-2xl border-t border-white/5 px-8 py-6 flex justify-between items-center z-50">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="relative p-2"
          >
            <Icon className={`w-6 h-6 transition-all duration-300 ${isActive ? 'text-[#ccff00] scale-110' : 'text-zinc-600'}`} />
            {isActive && (
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#ccff00] shadow-[0_0_8px_#ccff00]"></div>
            )}
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;