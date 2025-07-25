import React, { useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { galeriService } from '../../services/api';
import GaleriHeader from './GaleriHeader';

const getLayout = () => {
  if (window.innerWidth >= 768) {
    // Desktop: 3 kolom x 2 baris
    return { windowSize: 6, slideStep: 2, gridClass: 'grid-cols-3 grid-rows-2' };
  } else {
    // Mobile: 2 kolom x 2 baris
    return { windowSize: 4, slideStep: 4, gridClass: 'grid-cols-2 grid-rows-2' };
  }
};

const Galeri = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [galeriData, setGaleriData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0); // index window
  const [layout, setLayout] = useState(getLayout());

  const categories = ['Semua', 'Perkebunan', 'Panen', 'Pengolahan', 'Wisata', 'Fasilitas'];

  useEffect(() => {
    const fetchGaleri = async () => {
      try {
        const res = await galeriService.getAll();
        setGaleriData(res.data || []);
        setError(null);
      } catch (error) {
        setError(error.message);
        setGaleriData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchGaleri();
  }, []);

  // Update layout saat resize
  useEffect(() => {
    const handleResize = () => {
      setLayout(getLayout());
      setCurrentIndex(0); // reset ke awal saat layout berubah
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredData = selectedCategory === 'Semua' 
    ? galeriData 
    : galeriData.filter(item => item.kategori === selectedCategory);

  const { windowSize, slideStep, gridClass } = layout;
  const totalWindow = Math.max(1, Math.ceil(filteredData.length / slideStep));
  const maxIndex = Math.max(0, filteredData.length - windowSize);

  // Data yang ditampilkan di window sekarang
  const visibleData = filteredData.slice(currentIndex, currentIndex + windowSize);

  // Handler tombol
  const handlePrev = () => {
    setCurrentIndex(idx => Math.max(0, idx - slideStep));
  };
  const handleNext = () => {
    setCurrentIndex(idx => Math.min(maxIndex, idx + slideStep));
  };

  // Progress bar dan pagination
  const currentPage = Math.floor(currentIndex / slideStep) + 1;
  const totalPage = Math.max(1, Math.ceil((filteredData.length - windowSize) / slideStep) + 1);

  if (loading) {
    return (
      <section className="w-full max-w-5xl mx-auto px-4 py-16">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full max-w-5xl mx-auto px-4 py-16">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700 font-raleway">Error loading data: {error}</p>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Header dengan progress dan pagination custom */}
      <GaleriHeader 
        title="Galeri Dayeuhmanggung" 
        dataLength={totalPage} 
        currentIndex={currentPage - 1}
        onPrev={handlePrev}
        onNext={handleNext}
        disablePrev={currentIndex === 0}
        disableNext={currentIndex >= maxIndex || filteredData.length <= windowSize}
      />
      <section className="w-full max-w-5xl mx-auto px-4 py-0">
        {filteredData.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 font-raleway">Tidak ada foto galeri.</p>
          </div>
        ) : (
          <div className={`grid ${gridClass} gap-2`}>
            {visibleData.map((item) => (
              <div
                key={item.id}
                className="relative rounded-xl overflow-hidden shadow-lg group cursor-pointer transition-transform duration-300 hover:scale-105 bg-white"
                onClick={() => {
                  setSelectedImage(`/images/${item.file_foto}`);
                  setShowModal(true);
                }}
              >
                <img
                  src={`/images/${item.file_foto}`}
                  alt={item.file_foto}
                  className="w-full h-48 sm:h-72 object-cover object-center transition-transform duration-300 group-hover:scale-110 rounded-none sm:rounded-xl"
                  onError={e => { e.target.src = '/images/default-galeri.jpg'; }}
                />
              </div>
            ))}
          </div>
        )}
      </section>
      {/* Modal Gambar Fullscreen */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
        >
          <button
            className="absolute top-4 right-4 text-white text-3xl font-bold bg-black/60 rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/80 transition"
            onClick={e => { e.stopPropagation(); setShowModal(false); }}
            aria-label="Tutup"
          >
            &times;
          </button>
          <img
            src={selectedImage}
            alt="Galeri Full"
            className="max-w-full max-h-[90vh] object-contain rounded-none sm:rounded-xl shadow-lg"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};

export default Galeri;
