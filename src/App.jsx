import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Navbar from './components/user/Navbar'
import Hero from './components/user/Hero'
import BestOf from './components/user/BestOf'
import Tentang from './components/user/Tentang'
import Galeri from './components/user/Galeri'
import Review from './components/user/Review'
import ReviewForm from './components/user/ReviewForm'
import ArticleSection from './components/user/Artikel'
import Chatbot from './components/user/Chatbot'
import Admin from './components/admin/Admin'
import Login from './components/admin/Login'
import BestOfDetail from './components/user/BestOfDetail'
import Footer from './components/user/Footer';
import ArticleDetail from './components/user/ArticleDetail';
import TentangDetail from './components/user/TentangDetail';
import FasilitasDetail from './components/user/FasilitasDetail';

const Layout = () => {
  return (
    <>
      <Navbar />
      <main>
        <div id="beranda"><Hero /></div>
        <div id="destinasi"><BestOf /></div>
        <div id="tentang"><Tentang/></div>
        <div id="galeri"><Galeri/></div>
        <div id="artikel"><ArticleSection/></div>
        <div id="ulasan"><Review/></div>
        <ReviewForm/>
        <Chatbot />
      </main>
      <div id="footer"><Footer /></div>
    </>
  )
}


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/bestof/:id" element={<BestOfDetail />} />
        <Route path="/artikel/:id" element={<ArticleDetail />} />
        <Route path="/tentang-dayeuhmanggung" element={<TentangDetail />} />
        <Route path="/fasilitas/:id" element={<FasilitasDetail />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
