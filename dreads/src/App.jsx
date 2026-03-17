import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Searchbar from "./components/Searchbar.jsx";
import Books from "./components/Books.jsx";
import Liked from "./components/Liked.jsx";
import Wanttoread from "./components/Wanttoread.jsx";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Searchbar />} />
        <Route path="/profile" element={<Books />} />
        <Route path="/liked" element={<Liked />} />
        <Route path="/want-to-read" element={<Wanttoread />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
