import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase";
import { Heart, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  getBooksFromCollection,
  removeBookFromCollection,
  updateBookComment,
  saveBookToFirebase
} from "../services.js/firebaseservice";
import { getRecommendations } from "../services.js/bookservice";
import CircularGallery from "./CircularGallery";
import BookModal from "./BookModal";
import { useTheme } from "../context/ThemeContext";

const Liked = () => {
  const { theme, currentTheme } = useTheme();
  const [likedBooks, setLikedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [recLoading, setRecLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', visible: false });

  const navigate = useNavigate();

  const showToast = (message) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast({ message: '', visible: false }), 3000);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        navigate("/");
        return;
      }
      try {
        setLoading(true);
        const liked = await getBooksFromCollection(user.uid, "likedBooks");
        setLikedBooks(liked);
      } catch (err) {
        console.error("Load failed", err);
      } finally {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleAction = async (book, category) => {
    if (category === 'view') {
      setSelectedBook(book);
      setRecommendations([]);
      return;
    }
    try {
      const dbCollection = category === 'Liked' ? 'likedBooks' : 'wantToRead';
      await saveBookToFirebase(book, dbCollection);
      showToast(`Added to ${category}! ${currentTheme === 'pink' ? '🌸' : '✨'}`);
    } catch (err) {
      showToast("Operation failed.");
    }
  };

  const handleCommentChange = async (bookId, comment) => {
    try {
      await updateBookComment("likedBooks", bookId, comment);
      setLikedBooks(prev => prev.map(b => b.id === bookId ? { ...b, comment } : b));
    } catch (err) {
      console.error("Comment update failed", err);
    }
  };

  const handleRecommend = async (book) => {
    try {
      setRecLoading(true);
      const results = await getRecommendations(book);
      setRecommendations(results);
    } catch (err) {
      showToast("Failed to fetch suggestions.");
    } finally {
      setRecLoading(false);
    }
  };

  const handleRemove = async (bookId) => {
    try {
      await removeBookFromCollection(auth.currentUser.uid, "likedBooks", bookId);
      setLikedBooks((prev) => prev.filter((b) => b.id !== bookId));
      setSelectedBook(null);
      showToast(`Removed from Liked collection ${currentTheme === 'pink' ? '🍃' : '🗑️'}`);
    } catch (err) {
      showToast("Failed to remove book.");
    }
  };

  if (loading) {
    return (
      <div className="h-full flex justify-center items-center">
        <div className={`w-16 h-16 border-4 ${theme.iconColor} rounded-full animate-spin border-t-transparent`} />
      </div>
    );
  }

  return (
    <div className={`h-full flex flex-col pt-4 overflow-hidden ${theme.font}`}>
      <AnimatePresence>
        {toast.visible && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[2000] ${theme.modalBg} px-6 py-3 rounded-full shadow-xl border-2 ${theme.borderClass} flex items-center gap-2 ${theme.primaryText} font-bold`}>
            <CheckCircle2 className={`w-5 h-5 ${theme.iconColor}`} /> {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col justify-start">
        <h2 className={`text-3xl ${theme.primaryText} mb-2 px-4 flex items-center gap-3`}>
          <Heart className={`w-8 h-8 fill-current ${theme.iconColor}`} /> Liked Collection
        </h2>
        
        {likedBooks.length === 0 ? (
          <div className={`flex-1 flex flex-col items-center justify-center ${theme.primaryText} text-sm opacity-60 uppercase tracking-widest`}>No liked books yet. {currentTheme === 'pink' ? '✨' : '📚'}</div>
        ) : (
          <div className="flex-1 min-h-0">
            <CircularGallery 
              items={likedBooks}
              onSave={handleAction}
              onBookClick={(b) => { setSelectedBook(b); setRecommendations([]); }}
            />
          </div>
        )}
      </div>

      <BookModal 
        book={selectedBook}
        isOpen={!!selectedBook}
        onClose={() => setSelectedBook(null)}
        onAction={handleAction}
        onDelete={handleRemove}
        onCommentChange={handleCommentChange}
        onRecommend={handleRecommend}
        recommendations={recommendations}
        recLoading={recLoading}
      />
    </div>
  );
};

export default Liked;
