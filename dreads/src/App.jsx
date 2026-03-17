import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Navbar from './components/Navbar.jsx'
import Searchbar from './components/Searchbar.jsx'

function App() {
  return(
    <>
      <Navbar />
      <Searchbar />
    </>
  )}
export default App
