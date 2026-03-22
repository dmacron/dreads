const apiKey = import.meta.env.VITE_BOOKS_API_KEY;

export const searchBooks = async (query) => {
  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${apiKey}`
  );

  if (!response.ok) {
    throw new Error("API failed");
  }

  const data = await response.json();
  return data.items || [];
};

export const getSuggestions = async (query) => {
  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=5&key=${apiKey}`
  );
  if (!response.ok) return [];
  const data = await response.json();
  return data.items || [];
};

export const getRecommendations = async (book) => {
  const info = book.volumeInfo || {};
  const categories = info.categories || [];
  const authors = info.authors || [];
  const title = info.title || "";
  
  // Array of queries to try, from most specific to most general
  const queries = [];
  
  if (categories.length > 0 && authors.length > 0) {
    queries.push(`subject:${encodeURIComponent(categories[0])}+inauthor:${encodeURIComponent(authors[0])}`);
  }
  if (categories.length > 0) {
    queries.push(`subject:${encodeURIComponent(categories[0])}`);
  }
  if (authors.length > 0) {
    queries.push(`inauthor:${encodeURIComponent(authors[0])}`);
  }
  if (title) {
    queries.push(`${encodeURIComponent(title)}`);
  }
  queries.push("fiction"); // Ultimate fallback

  for (const query of queries) {
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=12&key=${apiKey}`
      );
      
      if (!response.ok) continue;

      const data = await response.json();
      const items = (data.items || []).filter(item => item.id !== book.id);
      
      // If we found any relevant items, return them immediately
      if (items.length > 0) return items.slice(0, 10);
    } catch (err) {
      console.error("Query failed, trying next fallback...", err);
    }
  }

  return [];
};