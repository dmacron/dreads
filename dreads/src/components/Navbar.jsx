import { NavLink } from "react-router-dom";
import { Search, Heart, Star, Sparkles, Palette } from "lucide-react";
import { useTheme, themes } from "../context/ThemeContext";

function Navbar() {
  const { theme, currentTheme, setCurrentTheme } = useTheme();

  return (
    <header className={`flex flex-row justify-between items-center mb-8 pb-4 border-b-2 ${theme.divider} transition-all`}>
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-4">
          <Sparkles className={`${theme.iconColor} w-6 h-6 animate-pulse`} />
          <h1 className={`text-4xl ${theme.font} ${theme.primaryText} tracking-widest drop-shadow-sm`}>d.reads</h1>
        </div>
        
        <div className="flex items-center gap-2 bg-white/20 p-1 rounded-2xl backdrop-blur-sm border border-white/30">
          {Object.values(themes).map((t) => (
            <button
              key={t.id}
              onClick={() => setCurrentTheme(t.id)}
              className={`w-8 h-8 rounded-xl transition-all flex items-center justify-center hover:scale-110 ${
                currentTheme === t.id ? 'ring-2 ring-white shadow-md scale-110' : 'opacity-60 hover:opacity-100'
              }`}
              style={{ backgroundColor: t.id === 'pink' ? '#fbcfe8' : t.id === 'minecraft' ? '#71aa34' : '#1e293b' }}
              title={t.name}
            >
              <Palette className="w-4 h-4 text-white" />
            </button>
          ))}
        </div>
      </div>

      <nav className="flex gap-4">
        <ul className="flex list-none p-0 m-0 gap-3">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-6 py-3 rounded-xl ${theme.font} text-xs transition-all flex items-center gap-2 ${
                  isActive 
                    ? theme.activeNav 
                    : theme.inactiveNav
                }`
              }
            >
              <Search className="w-4 h-4" />
              Search
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/liked"
              className={({ isActive }) =>
                `px-6 py-3 rounded-xl ${theme.font} text-xs transition-all flex items-center gap-2 ${
                  isActive 
                    ? theme.activeNav 
                    : theme.inactiveNav
                }`
              }
            >
              <Heart className="w-4 h-4" />
              Liked
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/want-to-read"
              className={({ isActive }) =>
                `px-6 py-3 rounded-xl ${theme.font} text-xs transition-all flex items-center gap-2 ${
                  isActive 
                    ? theme.activeNav 
                    : theme.inactiveNav
                }`
              }
            >
              <Star className="w-4 h-4" />
              Want to Read
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;
