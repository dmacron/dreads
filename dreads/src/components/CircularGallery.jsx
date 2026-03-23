import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Heart, Star, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../context/ThemeContext';

const CircularGallery = ({ items, onSave, onBookClick }) => {
  const { theme, currentTheme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
  }, [items]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        setCurrentIndex((prev) => (prev + 1) % items.length);
      } else if (e.key === 'ArrowLeft') {
        setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [items.length]);

  const next = () => setCurrentIndex((prev) => (prev + 1) % items.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);

  if (!items || items.length === 0) return null;

  const lastScroll = useRef(0);

  const normalizeBook = (book) => {
    const info = book.volumeInfo || {};
    return {
      id: book.id,
      title: info.title || book.title || 'Unknown Title',
      authors: info.authors || book.authors || ['Unknown Author'],
      thumbnail: (info.imageLinks?.thumbnail || book.thumbnail || '').replace('http:', 'https:') || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800',
      description: info.description || book.description || ''
    };
  };

  return (
    <div 
      className={`relative w-full h-[55vh] flex items-center justify-center overflow-visible ${theme.font}`}
      onWheel={(e) => {
        const now = Date.now();
        if (now - lastScroll.current < 400) return;
        if (Math.abs(e.deltaY) > 20) {
          if (e.deltaY > 0) next(); else prev();
          lastScroll.current = now;
        }
      }}
    >
      <button 
        onClick={prev} 
        className={`absolute left-[-15px] sm:left-2 z-40 p-3 ${theme.modalBg} backdrop-blur-md rounded-full shadow-lg ${theme.iconColor} hover:scale-105 transition-all border ${theme.divider}`}
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      <div className="relative w-full max-w-4xl h-full flex items-center justify-center mt-4" style={{ perspective: '1200px' }}>
        <AnimatePresence>
          {items.map((rawBook, index) => {
            const book = normalizeBook(rawBook);
            let offset = index - currentIndex;
            if (offset > items.length / 2) offset -= items.length;
            if (offset < -items.length / 2) offset += items.length;

            const isVisible = Math.abs(offset) <= 3;
            if (!isVisible) return null;

            const isActive = offset === 0;
            const x = offset * 200; 
            const z = -Math.abs(offset) * 140; 
            const rotateY = offset * -18; 
            const scale = isActive ? 1 : 1 - Math.abs(offset) * 0.15;
            const opacity = isActive ? 1 : 1 - Math.abs(offset) * 0.3;
            const zIndex = 20 - Math.abs(offset);

            return (
              <motion.div
                key={book.id || index}
                initial={false}
                animate={{ x, z, rotateY, scale, opacity, zIndex }}
                whileHover={isActive ? { 
                  scale: scale * 1.05, 
                  y: -10,
                  boxShadow: currentTheme === 'pink' ? "0 0 25px rgba(244, 114, 182, 0.4)" : "0 0 25px rgba(0, 0, 0, 0.2)",
                  transition: { type: "spring", stiffness: 400, damping: 10 }
                } : {}}
                whileTap={{ scale: scale * 0.95, rotateZ: isActive ? -1 : 0 }}
                transition={{ type: "spring", stiffness: 220, damping: 25 }}
                className={`absolute w-60 sm:w-64 h-full ${isActive ? 'cursor-default' : 'cursor-pointer'} rounded-[2rem]`}
                onClick={() => { if (!isActive) setCurrentIndex(index); }}
              >
                <div className={`w-full h-full ${theme.modalBg} backdrop-blur-md rounded-[2rem] p-5 shadow-xl border-2 flex flex-col transition-all duration-300 ${isActive ? `${theme.borderClass} shadow-lg` : 'border-white/50 shadow-black/5'}`}>
                  <div 
                    className={`relative w-full h-[68%] rounded-2xl overflow-hidden shadow-inner bg-slate-50/50 mb-4 cursor-pointer group flex items-center justify-center`}
                    onClick={() => isActive && onBookClick(rawBook)}
                  >
                    <img 
                      src={book.thumbnail} 
                      alt={book.title} 
                      className="w-full h-full object-contain p-2 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    {isActive && (
                      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                        <span className={`bg-white/90 ${theme.accentText} px-4 py-2 rounded-full font-bold text-[8px] tracking-widest uppercase`}>
                           View Details
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 flex flex-col text-center overflow-hidden">
                    <h3 className={`font-bold ${theme.primaryText} truncate mb-1 text-xs`}>{book.title}</h3>
                    <p className="text-[9px] text-slate-500 truncate mb-3 font-medium uppercase tracking-wider">{book.authors.join(', ')}</p>
                    
                    <div className="mt-auto flex items-center justify-center gap-2 mb-1">
                      <button 
                        onClick={(e) => { e.stopPropagation(); onSave(rawBook, 'Liked'); }}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl ${theme.cardBg} ${theme.primaryText} hover:${theme.accentText} transition-all border ${theme.divider}`}
                        title="Like"
                      >
                        <Heart className="w-3.5 h-3.5" />
                        <span className="text-[8px] font-bold uppercase tracking-tighter">Like</span>
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); onSave(rawBook, 'Want to Read'); }}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl ${theme.cardBg} ${theme.primaryText} hover:text-amber-500 transition-all border ${theme.divider}`}
                        title="Want to Read"
                      >
                        <Star className="w-3.5 h-3.5" />
                        <span className="text-[8px] font-bold uppercase tracking-tighter">Want</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <button 
        onClick={next} 
        className={`absolute right-[-15px] sm:right-2 z-40 p-3 ${theme.modalBg} backdrop-blur-md rounded-full shadow-lg ${theme.iconColor} hover:scale-105 transition-all border ${theme.divider}`}
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
};

export default CircularGallery;
