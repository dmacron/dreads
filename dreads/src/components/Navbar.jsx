import { NavLink } from "react-router-dom";
import { Search, Heart, Star, Sparkles } from "lucide-react";

function Navbar() {
  return (
    <header className="flex flex-row justify-between items-center mb-8 pb-4 border-b-2 border-pink-100">
      <div className="flex items-center gap-4">
        <Sparkles className="text-pink-500 w-6 h-6 animate-pulse" />
        <h1 className="text-4xl font-pixel text-pink-600 tracking-widest drop-shadow-sm">d.reads</h1>
      </div>

      <nav className="flex gap-4">
        <ul className="flex list-none p-0 m-0 gap-3">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-6 py-3 rounded-xl font-pixel text-xs transition-all flex items-center gap-2 ${
                  isActive 
                    ? 'bg-white text-pink-500 shadow-lg scale-105 border-2 border-pink-200 ring-4 ring-pink-50' 
                    : 'bg-white/40 text-slate-600 hover:bg-white/70 border-2 border-transparent hover:scale-105'
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
                `px-6 py-3 rounded-xl font-pixel text-xs transition-all flex items-center gap-2 ${
                  isActive 
                    ? 'bg-white text-pink-500 shadow-lg scale-105 border-2 border-pink-200 ring-4 ring-pink-50' 
                    : 'bg-white/40 text-slate-600 hover:bg-white/70 border-2 border-transparent hover:scale-105'
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
                `px-6 py-3 rounded-xl font-pixel text-xs transition-all flex items-center gap-2 ${
                  isActive 
                    ? 'bg-white text-pink-500 shadow-lg scale-105 border-2 border-pink-200 ring-4 ring-pink-50' 
                    : 'bg-white/40 text-slate-600 hover:bg-white/70 border-2 border-transparent hover:scale-105'
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
