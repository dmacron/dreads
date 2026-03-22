import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, Star, Trash2, Sparkles } from 'lucide-react';

const ActionButton = ({ icon, label, onClick, variant = 'default' }) => {
  const styles = {
    default: 'bg-white text-slate-600 border-slate-100 hover:border-pink-200 hover:text-pink-500',
    rose: 'bg-rose-50 text-rose-500 hover:bg-rose-100 border-transparent'
  };

  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold border-2 transition-all active:scale-95 shadow-sm ${styles[variant]}`}
    >
      {icon} <span>{label}</span>
    </button>
  );
};

const BookModal = ({ book, isOpen, onClose, onAction, onDelete, onCommentChange, onRecommend, recommendations, recLoading }) => {
  if (!book) return null;

  const info = book.volumeInfo || {};
  const title = info.title || book.title;
  const authors = info.authors || book.authors || [];
  const thumbnail = (info.imageLinks?.thumbnail || book.thumbnail || '').replace('http:', 'https:');
  const description = info.description || book.description || "";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row border-4 border-pink-100">
            <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 text-slate-400 hover:text-pink-500"><X className="w-6 h-6" /></button>
            
            <div className="md:w-1/3 bg-slate-50 p-8 border-r border-slate-100 flex flex-col items-center shrink-0">
              <img src={thumbnail} className="w-full aspect-[2/3] object-cover rounded-xl shadow-2xl mb-8" />
              <div className="w-full flex flex-col gap-3">
                <ActionButton onClick={() => onAction(book, 'Liked')} icon={<Heart className="w-5 h-5" />} label="Like" />
                <ActionButton onClick={() => onAction(book, 'Want to Read')} icon={<Star className="w-5 h-5" />} label="Want to Read" />
                {onDelete && (
                   <ActionButton onClick={() => onDelete(book.id)} icon={<Trash2 className="w-5 h-5" />} label="Remove" variant="rose" />
                )}
              </div>
            </div>

            <div className="md:w-2/3 p-10 overflow-y-auto">
               <h2 className="text-3xl font-bold text-slate-800 mb-2 leading-tight">{title}</h2>
               <p className="text-lg text-pink-500 font-medium mb-6">By {authors.join(', ')}</p>
               
               {onCommentChange && (
                 <div className="mb-6">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 font-pixel">My Thoughts</h3>
                    <textarea
                      placeholder="Add a magical note..."
                      value={book.comment || ""}
                      onChange={(e) => onCommentChange(book.id, e.target.value)}
                      className="w-full p-4 rounded-xl bg-slate-50 border-2 border-slate-100 focus:border-pink-200 focus:outline-none text-slate-700 min-h-[100px] resize-none"
                    />
                 </div>
               )}

               <div className="mb-8">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 font-pixel">Synopsis</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">{description.substring(0, 800)}...</p>
               </div>
               
               {onRecommend && (
                 <>
                   <button 
                      onClick={() => onRecommend(book)} 
                      disabled={recLoading}
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-400 to-indigo-400 text-white font-pixel text-xs shadow-lg hover:shadow-pink-200 transition-all active:scale-95 disabled:opacity-50 mb-8"
                    >
                      {recLoading ? "Consulting the library..." : "Find Similar Magical Books ✨"}
                   </button>

                   {recommendations && recommendations.length > 0 && (
                      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-4 p-4 bg-slate-50 rounded-2xl border-2 border-pink-50">
                        <h3 className="font-pixel text-pink-500 text-[10px] mb-4 flex items-center gap-2 uppercase tracking-widest"><Sparkles className="w-3 h-3" /> Similar Books Found</h3>
                        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                          {recommendations.map((rec) => (
                            <div key={rec.id} onClick={(e) => { e.stopPropagation(); onAction(rec, 'view'); }} className="flex-none w-28 cursor-pointer group">
                              <img src={rec.volumeInfo?.imageLinks?.thumbnail?.replace('http:', 'https:')} className="w-full h-36 object-cover rounded-xl shadow-md group-hover:scale-105 transition-transform" />
                              <p className="text-[8px] text-slate-700 mt-2 font-bold truncate px-1">{rec.volumeInfo?.title}</p>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                   )}
                 </>
               )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BookModal;
