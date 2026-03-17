import { db, auth } from "../firebase/firebase";
import { collection, doc, getDocs, setDoc, deleteDoc, getDoc } from "firebase/firestore";

export const saveBookToFirebase = async (book, collectionName = 'savedBooks') => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User not logged in");
  }

  // For likedBooks and wantToRead, don't remove from other collections
  // Only remove duplicates when saving to savedBooks
  if (collectionName === 'savedBooks') {
    const collections = ['likedBooks', 'wantToRead'];
    const removePromises = collections
      .filter(col => col !== collectionName)
      .map(col => deleteDoc(doc(db, "users", user.uid, col, book.id)).catch(() => {}));
    await Promise.all(removePromises);
  }

  await setDoc(
    doc(db, "users", user.uid, collectionName, book.id),
    {
      title: book.volumeInfo.title,
      authors: book.volumeInfo.authors || [],
      thumbnail: book.volumeInfo.imageLinks?.thumbnail || "",
      comment: "",
    }
  );
};

export const updateBookComment = async (collectionName, bookId, comment) => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User not logged in");
  }

  await setDoc(
    doc(db, "users", user.uid, collectionName, bookId),
    { comment },
    { merge: true }
  );
};

export const moveBookToCollection = async (bookId, fromCollection, toCollection) => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User not logged in");
  }

  // Get the book data from the source collection
  const sourceDoc = await getDoc(doc(db, "users", user.uid, fromCollection, bookId));
  if (!sourceDoc.exists()) {
    throw new Error("Book not found in source collection");
  }

  const bookData = sourceDoc.data();

  // Remove from source collection
  await deleteDoc(doc(db, "users", user.uid, fromCollection, bookId));

  // Add to target collection
  await setDoc(doc(db, "users", user.uid, toCollection, bookId), bookData);
};

export const getBooksFromCollection = async (userId, collectionName) => {
  const querySnapshot = await getDocs(collection(db, "users", userId, collectionName));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const removeBookFromCollection = async (userId, collectionName, bookId) => {
  await deleteDoc(doc(db, "users", userId, collectionName, bookId));
};