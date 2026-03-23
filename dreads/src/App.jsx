import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Searchbar from "./components/Searchbar.jsx";
import Liked from "./components/Liked.jsx";
import Wanttoread from "./components/Wanttoread.jsx";
import { motion } from "motion/react";
import { useTheme } from "./context/ThemeContext";

const Cloud = ({ color = "white", opacity = 0.5 }) => (
  <svg width="104" height="64" viewBox="0 0 104 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 32H16V40H8V48H0V56H8V64H96V56H104V48H96V40H88V32H80V24H72V16H64V8H56V0H40V8H32V16H24V32Z" fill={color} fillOpacity={opacity}/>
  </svg>
);

const MinecraftSun = () => (
  <div className="absolute top-10 right-20 w-16 h-16 bg-[#FFFF00] shadow-[0_0_0_4px_#FFD700] pointer-events-none" />
);

const MinecraftGrass = () => (
  <div className="absolute bottom-0 left-0 right-0 h-24 flex flex-col pointer-events-none z-0">
    <div className="h-4 flex overflow-hidden">
      {[...Array(40)].map((_, i) => (
        <div key={i} className="flex-shrink-0 w-12 h-full bg-[#71aa34]" />
      ))}
    </div>
    <div className="flex-1 bg-[#866043] flex overflow-hidden">
       {[...Array(40)].map((_, i) => (
        <div key={i} className="flex-shrink-0 w-12 h-full border-r border-[#745236] opacity-50" />
      ))}
    </div>
  </div>
);

const OfficeGrid = () => (
  <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
       style={{ backgroundImage: 'linear-gradient(#4ade80 1px, transparent 1px), linear-gradient(90deg, #4ade80 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
);

function App() {
  const { theme, currentTheme } = useTheme();

  return (
    <div className={`min-h-screen h-screen overflow-hidden ${theme.bgClass} ${theme.font} transition-colors duration-500 relative`}>
      {/* Theme Specific Decorative Elements */}
      {currentTheme === 'pink' && (
        <>
          <motion.div animate={{ x: [0, 30, 0], y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }} className="absolute top-10 left-10 opacity-50 pointer-events-none transition-all"><Cloud /></motion.div>
          <motion.div animate={{ x: [0, -40, 0], y: [0, 15, 0] }} transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }} className="absolute top-24 right-20 opacity-40 pointer-events-none scale-150 transition-all"><Cloud /></motion.div>
        </>
      )}

      {currentTheme === 'minecraft' && (
        <>
          <MinecraftSun />
          <motion.div animate={{ x: [0, 50, 0] }} transition={{ repeat: Infinity, duration: 15, ease: "linear" }} className="absolute top-20 left-20 opacity-80 pointer-events-none"><Cloud color="#ffffff" opacity={0.9} /></motion.div>
          <motion.div animate={{ x: [0, -60, 0] }} transition={{ repeat: Infinity, duration: 20, ease: "linear" }} className="absolute top-40 right-40 opacity-60 pointer-events-none scale-125"><Cloud color="#ffffff" opacity={0.7} /></motion.div>
          <MinecraftGrass />
        </>
      )}

      {currentTheme === 'office' && (
        <>
          <OfficeGrid />
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
        </>
      )}

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
