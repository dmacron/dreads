import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Searchbar from "./components/Searchbar.jsx";
import Liked from "./components/Liked.jsx";
import Wanttoread from "./components/Wanttoread.jsx";
import { motion } from "motion/react";

const Cloud = () => (
  <svg width="104" height="64" viewBox="0 0 104 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 32H16V40H8V48H0V56H8V64H96V56H104V48H96V40H88V32H80V24H72V16H64V8H56V0H40V8H32V16H24V32Z" fill="white"/>
  </svg>
);

function App() {
  return (
    <div className="min-h-screen h-screen overflow-hidden bg-gradient-to-b from-pink-200 via-purple-100 to-indigo-100 font-sans text-slate-800 relative">
      {/* Animated Pixel Clouds */}
      <motion.div animate={{ x: [0, 30, 0], y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }} className="absolute top-10 left-10 opacity-50 pointer-events-none"><Cloud /></motion.div>
      <motion.div animate={{ x: [0, -40, 0], y: [0, 15, 0] }} transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }} className="absolute top-24 right-20 opacity-40 pointer-events-none scale-150"><Cloud /></motion.div>

      <div className="h-full flex flex-col pt-6 px-10 relative z-10 w-full max-w-7xl mx-auto">
        <BrowserRouter>
          <Navbar />
          <main className="flex-1 overflow-hidden">
            <Routes>
              <Route path="/" element={<Searchbar />} />
              <Route path="/liked" element={<Liked />} />
              <Route path="/want-to-read" element={<Wanttoread />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
