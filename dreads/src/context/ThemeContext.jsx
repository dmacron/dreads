import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const themes = {
  pink: {
    id: 'pink',
    name: 'Pink Girly',
    bgClass: 'bg-gradient-to-b from-pink-200 via-purple-100 to-indigo-100',
    primaryText: 'text-pink-600',
    accentText: 'text-pink-500',
    borderClass: 'border-pink-200',
    activeNav: 'bg-white text-pink-500 shadow-lg scale-105 border-2 border-pink-200 ring-4 ring-pink-50',
    inactiveNav: 'bg-white/40 text-slate-600 hover:bg-white/70 border-2 border-transparent hover:scale-105',
    buttonClass: 'bg-pink-400 hover:bg-pink-500 text-white',
    cardBg: 'bg-white/60',
    modalBg: 'bg-white/95',
    font: 'font-pixel',
    iconColor: 'text-pink-500',
    divider: 'border-pink-100',
    dropdownItem: 'hover:bg-pink-50/50',
    historyItem: 'bg-pink-50 text-pink-600 hover:bg-pink-100',
    typeSelector: 'bg-white/40 text-slate-500 hover:bg-white/80'
  },
  minecraft: {
    id: 'minecraft',
    name: 'Minecraft Garden',
    bgClass: 'bg-[#47a1ff]', // Minecraft Sky color
    primaryText: 'text-white drop-shadow-[2px_2px_0_#373737]',
    accentText: 'text-white',
    borderClass: 'border-[#373737] border-4',
    activeNav: 'bg-[#8B8B8B] text-white shadow-[4px_4px_0_black] scale-105 border-4 border-white',
    inactiveNav: 'bg-[#4b4b4b] text-[#AAAAAA] hover:bg-[#5b5b5b] border-4 border-[#1e1e1e] hover:scale-105',
    buttonClass: 'bg-[#707070] hover:bg-[#8B8B8B] text-white border-b-4 border-r-4 border-black active:border-0 active:translate-y-[2px]',
    cardBg: 'bg-[#C6C6C6] border-4 border-t-white border-l-white border-b-[#555555] border-r-[#555555]',
    modalBg: 'bg-[#C6C6C6] border-8 border-t-white border-l-white border-b-[#555555] border-r-[#555555]',
    font: 'font-pixel',
    iconColor: 'text-[#4aa52e]',
    divider: 'border-[#373737]/40',
    dropdownItem: 'hover:bg-[#8B8B8B]',
    historyItem: 'bg-[#4b4b4b] text-white hover:bg-[#5b5b5b]',
    typeSelector: 'bg-[#4b4b4b] text-[#AAAAAA] hover:bg-[#5b5b5b]'
  },
  office: {
    id: 'office',
    name: 'Dark Office',
    bgClass: 'bg-[#0a0a0c]',
    primaryText: 'text-slate-200',
    accentText: 'text-emerald-400',
    borderClass: 'border-slate-800',
    activeNav: 'bg-slate-800/80 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)] border border-emerald-500/30 font-bold',
    inactiveNav: 'bg-transparent text-slate-500 hover:text-slate-200 hover:bg-slate-800/40 transition-all border border-transparent',
    buttonClass: 'bg-emerald-600 hover:bg-emerald-500 text-white rounded-md shadow-lg shadow-emerald-900/10',
    cardBg: 'bg-slate-900/60 border border-slate-800 shadow-2xl backdrop-blur-md',
    modalBg: 'bg-[#0f1115] border border-slate-800',
    font: 'font-sans',
    iconColor: 'text-emerald-500',
    divider: 'border-slate-800/50',
    dropdownItem: 'hover:bg-slate-800/60',
    historyItem: 'bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-white',
    typeSelector: 'bg-slate-900 text-slate-500 border border-slate-800'
  }
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem('dreads_theme') || 'pink';
  });

  useEffect(() => {
    localStorage.setItem('dreads_theme', currentTheme);
  }, [currentTheme]);

  const theme = themes[currentTheme];

  return (
    <ThemeContext.Provider value={{ currentTheme, setCurrentTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
