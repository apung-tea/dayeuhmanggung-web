import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaTiktok } from 'react-icons/fa';

const Footer = () => (
  <footer className="bg-black text-white w-full pt-10 pb-4 mt-8">
    {/* DESKTOP: 4 kolom */}
    <div className="max-w-7xl mx-auto px-4 hidden md:grid md:grid-cols-4 gap-8">
      {/* Brand */}
      <div className="flex flex-col items-start gap-2 mb-2">
        <span className="text-2xl font-bold tracking-wide">Wisata Dayeuhmanggung</span>

      </div>
      {/* Our Websites */}
      <div>
        <h3 className="font-bold mb-3 text-lg">Our Websites</h3>
        <ul className="space-y-2">
          <li><a href="#" className="hover:underline">Digital Asset</a></li>
          <li><a href="#" className="hover:underline">Yacht</a></li>
          <li><a href="#" className="hover:underline">Cruise</a></li>
        </ul>
      </div>
      {/* Informations */}
      <div>
        <h3 className="font-bold mb-3 text-lg">Informations</h3>
        <ul className="space-y-2">
          <li><a href="#" className="hover:underline">About Us</a></li>
          <li><a href="#" className="hover:underline">Privacy Policy</a></li>
          <li><a href="#" className="hover:underline">Terms & Conditions</a></li>
          <li><a href="#" className="hover:underline">Cookie Policy</a></li>
          <li><a href="#" className="hover:underline">Contact Us</a></li>
        </ul>
      </div>
      {/* Social Media */}
      <div>
        <h3 className="font-bold mb-3 text-lg">Social Media</h3>
        <ul className="space-y-3">
          <li className="flex items-center gap-3"><FaFacebookF className="bg-white text-black rounded-full p-1 w-7 h-7" /> <a href="#" className="hover:underline">Facebook</a></li>
          <li className="flex items-center gap-3"><FaTwitter className="bg-white text-black rounded-full p-1 w-7 h-7" /> <a href="#" className="hover:underline">Twitter</a></li>
          <li className="flex items-center gap-3"><FaInstagram className="bg-white text-black rounded-full p-1 w-7 h-7" /> <a href="#" className="hover:underline">Instagram</a></li>
          <li className="flex items-center gap-3"><FaYoutube className="bg-white text-black rounded-full p-1 w-7 h-7" /> <a href="#" className="hover:underline">Youtube</a></li>
          <li className="flex items-center gap-3"><FaTiktok className="bg-white text-black rounded-full p-1 w-7 h-7" /> <a href="#" className="hover:underline">Tiktok</a></li>
        </ul>
      </div>
    </div>
    {/* MOBILE: 2 kolom */}
    <div className="max-w-7xl mx-auto px-4 flex flex-col gap-8 md:hidden">
      {/* Brand */}
      <div className="flex flex-col items-start gap-2 mb-2">
        <span className="text-2xl font-bold tracking-wide">Wisata Dayeuhmanggung</span>
        <span className="text-sm text-gray-400">Wonderful Indonesia</span>
      </div>
      {/* 2 kolom utama */}
      <div className="flex flex-row gap-8 w-full">
        {/* Our Websites kiri */}
        <div className="w-1/2">
          <h3 className="font-bold mb-3 text-lg">Our Websites</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:underline">Digital Asset</a></li>
            <li><a href="#" className="hover:underline">Yacht</a></li>
            <li><a href="#" className="hover:underline">Cruise</a></li>
          </ul>
        </div>
        {/* Info + Sosmed kanan (stack vertikal) */}
        <div className="w-1/2 flex flex-col gap-8">
          <div>
            <h3 className="font-bold mb-3 text-lg">Informations</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:underline">About Us</a></li>
              <li><a href="#" className="hover:underline">Privacy Policy</a></li>
              <li><a href="#" className="hover:underline">Terms & Conditions</a></li>
              <li><a href="#" className="hover:underline">Cookie Policy</a></li>
              <li><a href="#" className="hover:underline">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-3 text-lg">Social Media</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3"><FaFacebookF className="bg-white text-black rounded-full p-1 w-7 h-7" /> <a href="#" className="hover:underline">Facebook</a></li>
              <li className="flex items-center gap-3"><FaTwitter className="bg-white text-black rounded-full p-1 w-7 h-7" /> <a href="#" className="hover:underline">Twitter</a></li>
              <li className="flex items-center gap-3"><FaInstagram className="bg-white text-black rounded-full p-1 w-7 h-7" /> <a href="#" className="hover:underline">Instagram</a></li>
              <li className="flex items-center gap-3"><FaYoutube className="bg-white text-black rounded-full p-1 w-7 h-7" /> <a href="#" className="hover:underline">Youtube</a></li>
              <li className="flex items-center gap-3"><FaTiktok className="bg-white text-black rounded-full p-1 w-7 h-7" /> <a href="#" className="hover:underline">Tiktok</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div className="border-t border-gray-800 mt-8 pt-4 text-center text-gray-300 text-sm">
      Copyright &copy;{new Date().getFullYear()} Wisata Dayeuhmanggung. All rights reserved.
    </div>
  </footer>
);

export default Footer; 