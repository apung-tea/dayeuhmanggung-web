import React, { useEffect, useState, useRef } from 'react';
import { reviewService } from '../../services/api';

function getInitials(name) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

const getSlidesPerView = () => {
  if (window.innerWidth >= 1024) return 3;  
  if (window.innerWidth >= 768) return 2;
  return 1;
};

const Review = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const reviewsContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await reviewService.getAll();
        setReviews((res.data || []).filter(r => r.status === 'disetujui'));
      } catch {
        setReviews([]);
      }
      setLoading(false);
    };
    fetchReviews();
  }, []);

  // Cek scroll kiri/kanan
  useEffect(() => {
    const container = reviewsContainerRef.current;
    if (!container) return;
    const checkScroll = () => {
      setCanScrollLeft(container.scrollLeft > 1);
      setCanScrollRight(container.scrollLeft + container.offsetWidth < container.scrollWidth - 1);
    };
    checkScroll();
    container.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);
    return () => {
      container.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [reviews]);

  // Scroll amount
  const getScrollByAmount = () => {
    const container = reviewsContainerRef.current;
    if (container) {
      return Math.floor(container.offsetWidth * 0.9);
    }
    return 400;
  };

  const goLeft = () => {
    const container = reviewsContainerRef.current;
    if (!container) return;
    container.scrollBy({ left: -getScrollByAmount(), behavior: 'smooth' });
  };
  const goRight = () => {
    const container = reviewsContainerRef.current;
    if (!container) return;
    container.scrollBy({ left: getScrollByAmount(), behavior: 'smooth' });
  };

  // Untuk dot aktif, update current index berdasarkan scroll
  useEffect(() => {
    const container = reviewsContainerRef.current;
    if (!container) return;
    const handleScroll = () => {
      const idx = Math.round(container.scrollLeft / getScrollByAmount());
      setCurrent(idx);
    };
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // Reset scroll ke awal jika data berubah
  useEffect(() => {
    const container = reviewsContainerRef.current;
    if (container) container.scrollTo({ left: 0, behavior: 'auto' });
    setCurrent(0);
  }, [reviews.length]);

  return (
    <section className="py-10 bg-gradient-to-br from-gray-50 via-white to-gray-100 min-h-[70vh] relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-gray-200/30 to-black/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-gray-300/20 to-black/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-raleway font-bold text-gray-900 mb-4" style={{fontFamily: 'Playfair Display, serif'}}>
            Testimoni Pengunjung
          </h2>
         
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-700"></div>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-gray-500 font-raleway text-lg">Belum ada review yang disetujui.</p>
          </div>
        ) : (
          <div className="relative">
            {/* Tombol navigasi hanya muncul jika ada lebih dari 2 review */}
            {/* Container review horizontal scroll */}
            <div
              ref={reviewsContainerRef}
              className="flex gap-8 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
              style={{scrollbarWidth: 'none'}}
            >
              {reviews.map((review, index) => (
                <div
                  key={review.id}
                  className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 md:p-8 flex flex-col justify-between min-h-[220px] snap-start transition-all duration-500 hover:scale-[1.02] w-20vh md:w-auto"
                  style={{
                    minWidth: '100%',
                    maxWidth: '100%',
                    animationDelay: `${index * 200}ms`,
                    animation: 'fadeInUp 0.6s ease-out forwards'
                  }}
                >
                  {/* Komentar, scrollable jika panjang */}
                  <div className="text-gray-600 text-base md:text-lg font-raleway mb-6 max-h-32 overflow-y-auto pr-2">
                    {review.review}
                  </div>
                  {/* User info */}
                  <div className="flex items-center gap-4 mt-auto">
                    {/* Foto profil atau inisial */}
                    {review.foto ? (
                      <img src={review.foto} alt={review.nama} className="w-14 h-14 rounded-full object-cover border-2 border-gray-300 shadow" />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-700 to-black flex items-center justify-center text-xl font-bold text-white shadow">
                        {getInitials(review.nama)}
                      </div>
                    )}
                    <div className="flex flex-col flex-1">
                      <span className="font-raleway font-bold text-gray-900 text-lg leading-tight">{review.nama}</span>
                      <span className="text-gray-400 text-sm">Indonesia</span>
                      <div className="flex items-center gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star} className="text-lg">
                            {star <= review.rating ? (
                              <span className="text-yellow-500 drop-shadow-sm">★</span>
                            ) : (
                              <span className="text-gray-300">☆</span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Pagination & Scroll Button Bar */}
            {reviews.length > 1 && (
              <div className="flex justify-center items-center mt-12 gap-4">
                <button
                  onClick={goLeft}
                  className="p-2 rounded-full bg-white shadow hover:bg-gray-100 transition border border-gray-200"
                  style={{ minWidth: 36, minHeight: 36 }}
                >
                  <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div className="flex gap-3">
                  {[...Array(reviews.length).keys()].map((i) => (
                    <div
                      key={i}
                      className={`w-4 h-4 rounded-full transition-all duration-300 border border-gray-400 bg-gray-300}`}
                    />
                  ))}
                </div>
                <button
                  onClick={goRight}
                  className="p-2 rounded-full bg-white shadow hover:bg-gray-100 transition border border-gray-200"
                  style={{ minWidth: 36, minHeight: 36 }}
                >
                  <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default Review; 