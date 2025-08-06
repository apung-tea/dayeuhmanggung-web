import React, { useEffect, useState, useRef } from 'react';
import { artikelService } from '../../services/api';
import { Link } from 'react-router-dom';

// Hook animasi intersection
function useInViewAnimation(count) {
  const refs = useRef([]);
  const [visible, setVisible] = useState(Array(count).fill(false));

  useEffect(() => {
    refs.current = refs.current.slice(0, count);
    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idx = Number(entry.target.getAttribute('data-idx'));
          if (entry.isIntersecting) {
            setVisible((v) => {
              const copy = [...v];
              copy[idx] = true;
              return copy;
            });
          } else {  
            setVisible((v) => {
              const copy = [...v];
              copy[idx] = false;
              return copy;
            });
          }
        });
      },
      { threshold: 0.2 }
    );
    refs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });
    return () => observer.disconnect();
  }, [count]);

  return [refs, visible];
}

const ArticleSection = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await artikelService.getAll();
        setArticles(res.data || []);
      } catch (error) {
        console.error('Error fetching articles:', error);
        // Fallback data jika API error
        setArticles([
          {
            id: 1,
            judul: 'Sejarah Perkebunan Dayeuhmanggung',
            konten: 'Perkebunan Dayeuhmanggung dimulai pada tahun 1985...',
            gambar: '/images/default-article.jpg',
            created_at: '2023-04-06',
            updated_at: '2023-04-06'
          },
          {
            id: 2,
            judul: 'Cara Merawat Tanaman Kopi',
            konten: 'Merawat tanaman kopi memerlukan perhatian khusus...',
            gambar: '/images/default-article.jpg',
            created_at: '2023-04-07',
            updated_at: '2023-04-07'
          },
          {
            id: 3,
            judul: 'Keunggulan Kopi Dayeuhmanggung',
            konten: 'Kopi dari perkebunan Dayeuhmanggung memiliki cita rasa yang unik...',
            gambar: '/images/default-article.jpg',
            created_at: '2023-04-08',
            updated_at: '2023-04-08'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;
    const checkScroll = () => {
      setCanScrollLeft(slider.scrollLeft > 1);
      setCanScrollRight(slider.scrollLeft + slider.offsetWidth < slider.scrollWidth - 1);
    };
    checkScroll();
    slider.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);
    return () => {
      slider.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [articles]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getScrollByAmount = () => {
    const slider = sliderRef.current;
    if (slider) {
      return Math.floor(slider.offsetWidth * 0.8);
    }
    return 372;
  };
  const handleScroll = (dir) => {
    const slider = sliderRef.current;
    if (!slider) return;
    slider.scrollBy({ left: dir * getScrollByAmount(), behavior: 'smooth' });
  };

  // Animasi intersection
  const [cardRefs, visible] = useInViewAnimation(articles.length);

  if (loading) {
    return (
      <section className="w-full max-w-[1000px] mx-auto px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-raleway font-bold">
              <span className="text-navy-900">Artikel</span>{' '}
              <span className="text-gray-400">Dayeuhmanggung</span>
            </h2>
          </div>
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full max-w-[1200px] mx-auto px-4">
      <div className="max-w-7xl mx-auto">
        {/* Judul elegan simpel */}
        <div className="flex flex-col items-center text-center my-3 relative">
          <h1 className="text-4xl md:text-5xl font-extrabold font-raleway text-navy-900 tracking-tight my-5" style={{fontFamily: 'Playfair Display, serif'}}>
            Artikel Dayeuhmanggung
          </h1>
         
          {/* Garis dekoratif simpel */}
          
        </div>
        <div className="flex justify-between items-center mb-0">
          {/* Hapus tombol Lainnya */}
        </div>
        <div className="relative">
          {/* Tombol kiri */}
          <button
            onClick={() => handleScroll(-1)}
            disabled={!canScrollLeft}
            className={`absolute left-1 sm:left-5 top-1/2 -translate-y-1/2 z-20 bg-white shadow-lg rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center transition hover:bg-blue-100 active:scale-95 border border-gray-200 ${!canScrollLeft ? 'opacity-40 cursor-not-allowed' : ''}`}
            aria-label="Scroll kiri"
            style={{marginLeft: undefined, ...(window.innerWidth >= 640 ? {marginLeft: '-28px'} : {})}}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="#1e293b" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
          </button>
          {/* Tombol kanan */}
          <button
            onClick={() => handleScroll(1)}
            disabled={!canScrollRight}
            className={`absolute right-1 sm:right-5 top-1/2 -translate-y-1/2 z-20 bg-white shadow-lg rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center transition hover:bg-blue-100 active:scale-95 border border-gray-200 ${!canScrollRight ? 'opacity-40 cursor-not-allowed' : ''}`}
            aria-label="Scroll kanan"
            style={{marginRight: undefined, ...(window.innerWidth >= 640 ? {marginRight: '-28px'} : {})}}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="#1e293b" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
          </button>
          {/* Slider */}
          <div ref={sliderRef} className="flex gap-8 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory" style={{scrollbarWidth: 'none'}}>
            {articles.map((article, idx) => (
              <Link
                to={`/artikel/${article.id}`}
                key={article.id}
                ref={el => cardRefs.current[idx] = el}
                data-idx={idx}
                className="min-w-[90vw] max-w-[90vw] md:min-w-[340px] md:max-w-[340px] bg-white rounded-xl shadow-sm overflow-hidden flex flex-col justify-between snap-start relative cursor-pointer hover:brightness-95 transition"
                style={{ textDecoration: 'none' }}
              >
                <div className="relative h-48 md:h-72">
                  <img
                    src={article.gambar ? `/images/${article.gambar}` : '/images/default-article.jpg'}
                    alt={article.judul}
                    className="w-full h-full object-cover rounded-t-xl"
                    onError={(e) => {
                      e.target.src = '/images/default-article.jpg';
                    }}
                  />
                  {/* Overlay gelap */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent rounded-t-xl"></div>
                  {/* Label kategori */}
                  {article.kategori && (
                    <span className={`absolute top-4 left-4 bg-emerald-500 text-white text-base md:text-lg font-bold px-4 md:px-5 py-2 rounded-md shadow font-raleway z-20 transition-all duration-700 ease-in-out
                      ${visible[idx] ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}`}
                      style={{ transitionDelay: `${200 + idx * 80}ms` }}>
                      {article.kategori}
                    </span>
                  )}
                  {/* Icon gambar */}
                  <span className="absolute top-4 right-4 bg-white/90 rounded-full p-2 shadow">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#1e293b" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 19.5l4.886-4.886a2.25 2.25 0 013.182 0l2.068 2.068m0 0l3.182-3.182a2.25 2.25 0 013.182 0l2.886 2.886M15 10.5a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg>
                  </span>
                  {/* Judul dan tanggal di atas gambar */}
                  <div className="absolute bottom-0 left-0 w-full p-5 text-white z-10">
                    <h3 className={`text-2xl font-raleway font-semibold mb-2 leading-snug line-clamp-2 transition-all duration-700 ease-in-out
                      ${visible[idx] ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}`}
                      style={{ transitionDelay: `${320 + idx * 80}ms` }}>
                      {article.judul}
                    </h3>
                    {/* Tanggal event */}
                    <div className={`flex items-center gap-2 text-base mb-1 transition-all duration-700 ease-in-out
                      ${visible[idx] ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}`}
                      style={{ transitionDelay: `${400 + idx * 80}ms` }}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="white" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3.75 7.5h16.5M4.5 21h15a2.25 2.25 0 002.25-2.25V7.5a2.25 2.25 0 00-2.25-2.25h-15A2.25 2.25 0 002.25 7.5v11.25A2.25 2.25 0 004.5 21z" /></svg>
                      <span>
                        {article.tanggal_mulai && article.tanggal_selesai
                          ? `${formatDate(article.tanggal_mulai)} - ${formatDate(article.tanggal_selesai)}`
                          : formatDate(article.created_at)}
                      </span>
                    </div>
                    {/* Lokasi */}
                    {article.lokasi && (
                      <div className={`flex items-center gap-2 text-base transition-all duration-700 ease-in-out
                        ${visible[idx] ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}`}
                        style={{ transitionDelay: `${480 + idx * 80}ms` }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="white" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.5-7.5 10.5-7.5 10.5S4.5 18 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                        <span>{article.lokasi}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArticleSection;
  