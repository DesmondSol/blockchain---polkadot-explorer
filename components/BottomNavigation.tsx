
import React from 'react';
import { IconButton } from './IconButton';

export type ActiveTab = 'home' | 'chat' | 'profile';

interface BottomNavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

interface NavItem {
  id: ActiveTab;
  label: string;
  icon: string;
}

const navItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: 'fas fa-home' },
  { id: 'chat', label: 'Chat', icon: 'fas fa-comments' }, // Using fa-comments for chat
  { id: 'profile', label: 'Profile', icon: 'fas fa-user-astronaut' }, // Using a fun user icon
];

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, onTabChange }) => {
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
          aria-label={item.label}
        >
          <i className={`${item.icon} text-xl md:text-2xl mb-0.5 md:mb-1`}></i>
          <span className="text-xs md:text-sm">{item.label}</span>
          {activeTab === item.id && (
             <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-purple-400 rounded-full"></span>
          )}
        </button>
      ))}
    </nav>
  );
};

// Add a custom shadow style for the top of the nav bar if needed
// e.g., in index.html or a global CSS file:
// .shadow-top { box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06); }
// Tailwind doesn't have a specific utility for shadow on one side only easily.
// For simplicity, using a standard shadow which will appear mostly on top due to positioning.
// A more precise shadow can be done with pseudo-elements or a custom box-shadow value if critical.
