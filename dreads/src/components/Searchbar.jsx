import React, { useState, useEffect, useCallback, useRef } from "react";
import { Search, Sparkles, X, CheckCircle2, History, Clock, User, Book as BookIcon, Tag, ChevronDown, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { searchBooks, getRecommendations, getSuggestions } from "../services.js/bookservice";
import { saveBookToFirebase } from "../services.js/firebaseservice";
import { auth } from "../firebase/firebase";
import CircularGallery from "./CircularGallery";
import BookModal from "./BookModal";
import { useTheme } from "../context/ThemeContext";

const Searchbar = () => {
  const { theme, currentTheme } = useTheme();
  // --- States ---
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("intitle");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [recLoading, setRecLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', visible: false });
  
  // Search Experience States
  const [suggestions, setSuggestions] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showTypeSelector, setShowTypeSelector] = useState(false);
  
  // Refs
  const dropdownRef = useRef(null);
  const typeSelectorRef = useRef(null);

  const searchTypes = [
    { id: 'intitle', label: 'Title', icon: <BookIcon className="w-4 h-4" />, prefix: 'intitle:' },
    { id: 'inauthor', label: 'Author', icon: <User className="w-4 h-4" />, prefix: 'inauthor:' },
    { id: 'subject', label: 'Genre', icon: <Tag className="w-4 h-4" />, prefix: 'subject:' },
  ];

  // --- Helpers ---
  const showToast = (message) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast({ message: '', visible: false }), 3000);
  };

  const persistHistory = (query) => {
    const newHistory = [query, ...searchHistory.filter(h => h !== query)].slice(0, 5);
    setSearchHistory(newHistory);
    localStorage.setItem('dreads_search_history', JSON.stringify(newHistory));
  };

  const trackRecentlyViewed = (book) => {
    const newViewed = [book, ...recentlyViewed.filter(b => b.id !== book.id)].slice(0, 10);
    setRecentlyViewed(newViewed);
    localStorage.setItem('dreads_recently_viewed', JSON.stringify(newViewed));
  };

  // --- Effects ---
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('dreads_search_history') || '[]');
    const viewed = JSON.parse(localStorage.getItem('dreads_recently_viewed') || '[]');
    setSearchHistory(history);
    setRecentlyViewed(viewed);

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowDropdown(false);
      if (typeSelectorRef.current && !typeSelectorRef.current.contains(e.target)) setShowTypeSelector(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (searchTerm.trim().length > 2) {
        const typePrefix = searchTypes.find(t => t.id === searchType).prefix;
        const results = await getSuggestions(typePrefix + searchTerm);
        setSuggestions(results);
        setShowDropdown(true);
      } else {
        setSuggestions([]);
      }
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, searchType]);

  useEffect(() => {
    const fetchExplore = async () => {
      try {
        setLoading(true);
        const results = await searchBooks("subject:fiction");
        setBooks(results);
      } catch (err) {
        console.error("Explore fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchExplore();
  }, []);

  // --- Handlers ---
  const handleSearch = async (query = searchTerm, type = searchType) => {
    if (!query.trim()) return;
    setShowDropdown(false);
    setShowTypeSelector(false);

    try {
      setLoading(true);
      const prefix = searchTypes.find(t => t.id === type).prefix;
      const results = await searchBooks(prefix + query);
      setBooks(results);
      setRecommendations([]);
      persistHistory(query);
    } catch (error) {
      showToast("Magical search failed. 🌧️");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (book, category) => {
    if (category === 'view') {
      handleItemClick(book);
      return;
    }
    const user = auth.currentUser;
    if (!user) {
      showToast("Please log in first! 🔒");
      return;
    }

    try {
      const dbCollection = category === 'Liked' ? 'likedBooks' : 'wantToRead';
      await saveBookToFirebase(book, dbCollection);
      showToast(`Added to ${category}! ${currentTheme === 'pink' ? '🌸' : '✨'}`);
    } catch (err) {
      showToast("Failed to save book. 🍃");
    }
  };

  const handleRecommend = async (book) => {
    try {
      setRecLoading(true);
      const results = await getRecommendations(book);
      setRecommendations(results);
      showToast(results.length > 0 ? "Magical suggestions found! ✨" : "No similar books found. 📖");
    } catch (err) {
      showToast("Failed to fetch suggestions. 🌧️");
    } finally {
      setRecLoading(false);
    }
  };

  const handleItemClick = useCallback((book) => {
    setSelectedBook(book);
    setRecommendations([]);
    trackRecentlyViewed(book);
  }, [recentlyViewed]);

  const currentType = searchTypes.find(t => t.id === searchType);

  return (
    <div className={`h-full flex flex-col justify-start ${theme.font}`}>
      <AnimatePresence>
        {toast.visible && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: 20 }} 
            className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[2000] ${theme.modalBg} backdrop-blur-md px-6 py-3 rounded-full shadow-xl border-2 ${theme.borderClass} flex items-center gap-2 ${theme.primaryText} font-bold`}
          >
            <CheckCircle2 className={`w-5 h-5 ${theme.iconColor}`} /> {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col items-center flex-1 max-w-6xl mx-auto w-full">
        <div ref={dropdownRef} className="w-full max-w-2xl relative mb-12 mt-4 z-[100]">
          <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="relative group flex items-center">
            <div ref={typeSelectorRef} className="absolute left-2 z-20">
              <button
                type="button"
                onClick={() => setShowTypeSelector(!showTypeSelector)}
                className={`flex items-center gap-2 px-4 py-2 ${theme.typeSelector} rounded-xl text-[10px] uppercase tracking-widest transition-all border border-white/50 shadow-sm`}
              >
                {currentType.icon}
                <span className="hidden sm:inline">{currentType.label}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${showTypeSelector ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showTypeSelector && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`absolute top-full left-0 mt-2 ${theme.modalBg} rounded-2xl shadow-2xl border-2 ${theme.divider} p-2 min-w-[140px] z-50`}>
                    {searchTypes.map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => { setSearchType(type.id); setShowTypeSelector(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[9px] uppercase tracking-widest transition-all ${searchType === type.id ? `${theme.accentText} font-bold` : 'text-slate-500 hover:bg-slate-50'}`}
                      >
                        {type.icon} {type.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <input
              type="text"
              value={searchTerm}
              onFocus={() => searchTerm.length > 0 && setShowDropdown(true)}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Search by ${currentType.label.toLowerCase()}...`}
              className={`w-full pl-36 sm:pl-44 pr-16 py-4 rounded-3xl border-4 ${theme.borderClass} ${theme.cardBg} backdrop-blur-sm focus:outline-none focus:ring-4 focus:ring-white/20 transition-all text-lg shadow-xl ${theme.primaryText}`}
            />
            <button type="submit" className={`absolute right-3 p-3 ${theme.buttonClass} rounded-2xl active:scale-95 shadow-sm transition-all flex items-center justify-center`}>
              <Search className="w-6 h-6" />
            </button>
          </form>

          <AnimatePresence>
            {showDropdown && (searchTerm.length > 0 || searchHistory.length > 0) && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={`absolute top-full left-0 right-0 mt-3 ${theme.modalBg} backdrop-blur-xl rounded-3xl shadow-2xl border-4 ${theme.divider} py-4 z-10 font-bold`}>
                {searchHistory.length > 0 && (
                  <div className={`px-6 mb-4 border-b ${theme.divider} pb-4`}>
                    <h4 className={`flex items-center gap-2 text-[10px] uppercase text-slate-400 mb-3 tracking-widest`}><History className="w-3 h-3" /> Recent Searches</h4>
                    <div className="flex flex-wrap gap-2">
                      {searchHistory.map((h, i) => (
                        <button key={i} onClick={() => { setSearchTerm(h); handleSearch(h); }} className={`px-4 py-1.5 ${theme.historyItem} rounded-full text-xs transition-colors`}>{h}</button>
                      ))}
                    </div>
                  </div>
                )}
                <div className="px-2">
                   {suggestions.length > 0 ? (
                      suggestions.map((s) => (
                        <button key={s.id} onClick={() => { setSearchTerm(s.volumeInfo.title); handleSearch(s.volumeInfo.title); }} className={`w-full flex items-center gap-4 px-4 py-3 ${theme.dropdownItem} rounded-2xl transition-colors text-left group`}>
                          <BookOpen className={`w-4 h-4 text-slate-300 group-hover:${theme.iconColor}`} />
                          <span className={`text-sm font-medium ${theme.primaryText} truncate`}>{s.volumeInfo.title}</span>
                          {s.volumeInfo.authors && <span className="text-[10px] text-slate-400 ml-auto shrink-0">{s.volumeInfo.authors[0]}</span>}
                        </button>
                      ))
                   ) : searchTerm.length > 2 && (
                      <div className="text-center py-4 text-xs text-slate-400">Consulting the library...</div>
                   )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {loading ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="relative w-16 h-16">
              <div className={`absolute inset-0 border-4 ${theme.divider} rounded-full animate-ping`} />
              <div className={`absolute inset-2 border-4 ${theme.iconColor} rounded-full animate-spin border-t-transparent`} />
            </div>
          </div>
        ) : (
          <div className="w-full flex-1 flex flex-col justify-center min-h-0 overflow-visible">
            {books.length > 0 ? (
              <div className="flex-1 min-h-0">
                <CircularGallery items={books} onSave={handleAction} onBookClick={handleItemClick} />
              </div>
            ) : (
              <div className={`text-center py-20 ${theme.primaryText} font-medium text-sm`}>Try a search! {currentTheme === 'pink' ? '🪄' : '📚'}</div>
            )}

            {recentlyViewed.length > 0 && books.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`mt-8 px-4 py-6 ${theme.cardBg} backdrop-blur-md border-t-2 ${theme.divider} shrink-0`}>
                <h3 className={`text-slate-400 text-[10px] mb-4 flex items-center gap-2 uppercase tracking-widest`}><Clock className="w-3 h-3" /> Recently Viewed</h3>
                <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                  {recentlyViewed.map((v) => (
                    <button key={v.id} onClick={() => handleItemClick(v)} className="flex-none w-20 flex flex-col gap-2 group">
                      <div className={`w-full aspect-[2/3] ring-2 ring-white/50 rounded-lg overflow-hidden shadow-lg group-hover:ring-${theme.accentText} transition-all`}>
                        <img src={v.volumeInfo?.imageLinks?.thumbnail?.replace('http:', 'https:') || v.thumbnail} className="w-full h-full object-cover" />
                      </div>
                      <p className={`text-[7px] text-slate-500 truncate text-center uppercase`}>{v.volumeInfo?.title || v.title}</p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>

      <BookModal 
        book={selectedBook}
        isOpen={!!selectedBook}
        onClose={() => setSelectedBook(null)}
        onAction={handleAction}
        onRecommend={handleRecommend}
        recommendations={recommendations}
        recLoading={recLoading}
      />
    </div>
  );
};

export default Searchbar;