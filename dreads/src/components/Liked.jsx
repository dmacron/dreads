import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase";
import {
  getBooksFromCollection,
  removeBookFromCollection,
  updateBookComment,
} from "../services.js/firebaseservice";

const Liked = () => {
  const [likedBooks, setLikedBooks] = useState([]);
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
        const liked = await getBooksFromCollection(user.uid, "likedBooks");
        setLikedBooks(liked);
      } catch (err) {
        console.error(err);
        setError("Unable to load liked books. Please try again.");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleRemove = async (bookId) => {
    try {
      await removeBookFromCollection(auth.currentUser.uid, "likedBooks", bookId);
      setLikedBooks((prev) => prev.filter((b) => b.id !== bookId));
    } catch (err) {
      console.error(err);
      setError("Could not remove the book. Try again.");
    }
  };

  const handleCommentChange = async (bookId, comment) => {
    try {
      await updateBookComment("likedBooks", bookId, comment);
      setLikedBooks((prev) =>
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
    return <p style={{ padding: 24 }}>Loading your liked books…</p>;
  }

  return (
    <main style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
      <h1>❤️ Liked Books</h1>
      {error && (
        <div style={{ color: "#b00", marginBottom: 20 }}>{error}</div>
      )}

      {likedBooks.length === 0 ? (
        <p style={{ fontStyle: "italic", color: "#666" }}>
          No liked books yet. Search for books and click the ❤️ Like button!
        </p>
      ) : (
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          {likedBooks.map((book) => (
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

              <button
                onClick={() => handleRemove(book.id)}
                style={{
                  marginTop: 12,
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: "1px solid red",
                  background: "#fff",
                  color: "red",
                  cursor: "pointer",
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default Liked;
