import { useState } from "react";
import { searchBooks } from "../services.js/bookservice";
import { saveBookToFirebase } from "../services.js/firebaseservice";
import { auth } from "../firebase/firebase";

const Searchbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

   const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    try {
      setLoading(true);
      const results = await searchBooks(searchTerm);
      setBooks(results);
    } catch (error) {
      console.error(error);
      setError("Failed to search books. Please try again."); // Show to user
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (book) => {
    const user = auth.currentUser;

    if (!user) {
      alert("Please log in to save books.");
      return;
    }

    try {
      await saveBookToFirebase(book);
      alert("Saved!");
    } catch (err) {
      console.error(err);
      setError("Failed to save the book. Please try again.");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

    return (
    <>
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search for a book..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyPress={handleKeyPress}
      />

      <button onClick={handleSearch} disabled={loading}>
        {loading ? "Searching..." : "Search"}
      </button>
    </div>
    <div className="search-results">
      {books.map((book) => (
          <div key={book.id} style={{ margin: "20px 0" }}>
            
            <h3>{book.volumeInfo.title}</h3>

            <p>
              {book.volumeInfo.authors
                ? book.volumeInfo.authors.join(", ")
                : "Unknown Author"}
            </p>

            {book.volumeInfo.imageLinks && (
              <img
                src={book.volumeInfo.imageLinks?.thumbnail}
                alt="book cover"
                onError={(e) => e.target.style.display = 'none'}
              />
            )}
            <button onClick={() => handleSave(book)}>
              Save Book
            </button>
          </div>
        ))}
    </div>
    {error && <p style={{color: 'red'}}>{error}</p>}
    {books.length === 0 && searchTerm && !loading && (
      <p>No books found for "{searchTerm}"</p>
    )}
    </>
  );
};

export default Searchbar;