import { db, auth } from "../firebase/firebase";
import { doc, setDoc } from "firebase/firestore";

export const saveBookToFirebase = async (book) => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User not logged in");
  }

  await setDoc(
    doc(db, "users", user.uid, "savedBooks", book.id),
    {
      title: book.volumeInfo.title,
      authors: book.volumeInfo.authors || [],
      thumbnail: book.volumeInfo.imageLinks?.thumbnail || "",
    }
  );
};