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