import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase";
import {
  getBooksFromCollection,
  removeBookFromCollection,
  saveBookToFirebase,
  updateBookComment,
} from "../services.js/firebaseservice";

const Wanttoread = () => {
  const [wantToReadBooks, setWantToReadBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        navigate("/");
        return;
      }

      setLoading(true);
      setError("");

      try {
        const want = await getBooksFromCollection(user.uid, "wantToRead");
        setWantToReadBooks(want);
      } catch (err) {
        console.error(err);
        setError("Unable to load want to read books. Please try again.");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleRemove = async (bookId) => {
    try {
      await removeBookFromCollection(auth.currentUser.uid, "wantToRead", bookId);
      setWantToReadBooks((prev) => prev.filter((b) => b.id !== bookId));
    } catch (err) {
      console.error(err);
      setError("Could not remove the book. Try again.");
    }
  };

  const handleLike = async (book) => {
    try {
      await saveBookToFirebase(book, "likedBooks");
      // Don't remove from wantToRead - book stays in both
    } catch (err) {
      console.error(err);
      setError("Could not like the book. Try again.");
    }
  };

  const handleSave = async (book) => {
    try {
      await saveBookToFirebase(book, "savedBooks");
      // This will remove from wantToRead since saveBookToFirebase removes from other collections when saving to savedBooks
      setWantToReadBooks((prev) => prev.filter((b) => b.id !== book.id));
    } catch (err) {
      console.error(err);
      setError("Could not save the book. Try again.");
    }
  };

  const handleCommentChange = async (bookId, comment) => {
    try {
      await updateBookComment("wantToRead", bookId, comment);
      setWantToReadBooks((prev) =>
        prev.map((book) =>
          book.id === bookId ? { ...book, comment } : book
        )
      );
    } catch (err) {
      console.error(err);
      setError("Could not save comment. Try again.");
    }
  };

  if (loading) {
    return <p style={{ padding: 24 }}>Loading your want to read books…</p>;
  }

  return (
    <main style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
      <h1>📖 Want to Read</h1>
      {error && (
        <div style={{ color: "#b00", marginBottom: 20 }}>{error}</div>
      )}

      {wantToReadBooks.length === 0 ? (
        <p style={{ fontStyle: "italic", color: "#666" }}>
          No books in your want to read list yet. Search for books and click the 📖 Want to Read button!
        </p>
      ) : (
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          {wantToReadBooks.map((book) => (
            <div
              key={book.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: 10,
                padding: 12,
                background: "#fff",
                boxShadow: "0 2px 6px rgba(0,0,0,.06)",
              }}
            >
              {book.thumbnail && (
                <img
                  src={book.thumbnail}
                  alt={book.title}
                  style={{ width: "100%", height: 220, objectFit: "cover", borderRadius: 8 }}
                />
              )}
              <h3 style={{ margin: "12px 0 6px" }}>{book.title}</h3>
              <p style={{ margin: 0, color: "#444" }}>
                {book.authors?.length ? book.authors.join(", ") : "Unknown author"}
              </p>

              <textarea
                placeholder="Add a comment..."
                value={book.comment || ""}
                onChange={(e) => handleCommentChange(book.id, e.target.value)}
                style={{
                  width: "100%",
                  marginTop: 12,
                  padding: 8,
                  borderRadius: 6,
                  border: "1px solid #ccc",
                  fontSize: "12px",
                  resize: "vertical",
                  minHeight: 40,
                }}
              />

              <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button
                  onClick={() => handleLike(book)}
                  style={{
                    padding: "6px 10px",
                    borderRadius: 6,
                    border: "1px solid #ccc",
                    background: "#fff",
                    cursor: "pointer",
                    fontSize: "12px",
                  }}
                >
                  ❤️ Like
                </button>
                <button
                  onClick={() => handleSave(book)}
                  style={{
                    padding: "6px 10px",
                    borderRadius: 6,
                    border: "1px solid #ccc",
                    background: "#fff",
                    cursor: "pointer",
                    fontSize: "12px",
                  }}
                >
                  📚 Save
                </button>
                <button
                  onClick={() => handleRemove(book.id)}
                  style={{
                    padding: "6px 10px",
                    borderRadius: 6,
                    border: "1px solid red",
                    background: "#fff",
                    color: "red",
                    cursor: "pointer",
                    fontSize: "12px",
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default Wanttoread;
