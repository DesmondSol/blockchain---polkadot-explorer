
import React from 'react';
import { useTranslation } from 'react-i18next';
// Removed IconButton import as it's not used
// import { IconButton } from './IconButton'; 

export type ActiveTab = 'home' | 'chat' | 'profile' | 'badges'; // Added 'badges'

interface BottomNavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

interface NavItem {
  id: ActiveTab;
  translationKey: string; // Use translation key instead of hardcoded label
  icon: string;
}

const navItems: NavItem[] = [
  { id: 'home', translationKey: 'bottomNav.home', icon: 'fas fa-home' },
  { id: 'chat', translationKey: 'bottomNav.chat', icon: 'fas fa-comments' },
  { id: 'badges', translationKey: 'bottomNav.badges', icon: 'fas fa-id-badge' }, // New Badges Tab
  { id: 'profile', translationKey: 'bottomNav.profile', icon: 'fas fa-user-astronaut' },
];

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, onTabChange }) => {
  const { t } = useTranslation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 md:h-20 bg-gray-800 bg-opacity-90 backdrop-blur-lg shadow-top z-30 flex justify-around items-center">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onTabChange(item.id)}
          className={`flex flex-col items-center justify-center h-full px-3 md:px-4 transition-colors duration-200 ease-in-out focus:outline-none
            ${activeTab === item.id ? 'text-purple-400' : 'text-gray-400 hover:text-purple-300'}
          `}
          aria-current={activeTab === item.id ? 'page' : undefined}
          aria-label={t(item.translationKey)}
        >
          <i className={`${item.icon} text-xl md:text-2xl mb-0.5 md:mb-1`}></i>
          <span className="text-xs md:text-sm">{t(item.translationKey)}</span>
          {activeTab === item.id && (
             <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-purple-400 rounded-full"></span>
          )}
        </button>
      ))}
    </nav>
  );
};
