import { db, auth } from "../firebase/firebase";
import { collection, doc, getDocs, setDoc, deleteDoc } from "firebase/firestore";

export const saveBookToFirebase = async (book, collectionName = 'savedBooks') => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not logged in");

  const bookId = book.id;
  const info = book.volumeInfo || book; // Handle both direct API items and existing FB items

  // Normalize structure for consistent cross-app usage
  const normalizedData = {
    id: bookId,
    title: info.title,
    authors: info.authors || [],
    thumbnail: (info.imageLinks?.thumbnail || info.thumbnail || "").replace('http:', 'https:'),
    categories: info.categories || [],
    description: info.description || "",
    comment: book.comment || "",
  };

  // Compatibility wrapper for components expecting .volumeInfo
  const finalDoc = {
    ...normalizedData,
    volumeInfo: { ...normalizedData }
  };

  await setDoc(doc(db, "users", user.uid, collectionName, bookId), finalDoc);
};

export const getBooksFromCollection = async (userId, collectionName) => {
  const querySnapshot = await getDocs(collection(db, "users", userId, collectionName));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const removeBookFromCollection = async (userId, collectionName, bookId) => {
  await deleteDoc(doc(db, "users", userId, collectionName, bookId));
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