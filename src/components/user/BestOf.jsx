import React, { useEffect, useState, useRef } from 'react';
import { bestOfService } from '../../services/api';
import './scrollbar-hide.css';
import { Link } from 'react-router-dom';

// Tambah hook untuk animasi intersection
function useInViewAnimation(count) {
  const refs = useRef([]);
  const [visible, setVisible] = useState(Array(count).fill(false));

  useEffect(() => {
    refs.current = refs.current.slice(0, count);
    setVisible(Array(count).fill(false));
    
    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idx = Number(entry.target.getAttribute('data-idx'));
          if (idx >= 0 && idx < count) {
            setVisible((v) => {
              const copy = [...v];
              if (entry.isIntersecting) {
                copy[idx] = true;
              } else {
                copy[idx] = false;
              }
              return copy;
            });
          }
        });
      },
      { threshold: 0.2, rootMargin: '50px' }
    );
    
    // Delay observation to prevent immediate triggers
    const timeoutId = setTimeout(() => {
      refs.current.forEach((ref) => {
        if (ref) observer.observe(ref);
      });
    }, 100);
    
    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [count]);

  return [refs, visible];
}

const BestOf = () => {
  const [bestOfData, setBestOfData] = useState([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const res = await bestOfService.getAll();
      // Jangan reverse/sort, biarkan urutan asli dari API
      setBestOfData(res.data || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  const dataLength = bestOfData.length;

  // Scroll ke awal saat mount/ketika data berubah
  useEffect(() => {
    if (!sliderRef.current || dataLength === 0) return;
    sliderRef.current.scrollTo({
      left: 0,
      behavior: 'auto',
    });
  }, [dataLength]);

  // Geser satu card per klik
  const getCardWidth = () => 340 + 32; // minWidth + gap
  const handleScroll = (dir) => {
    const slider = sliderRef.current;
    if (!slider) return;
    const cardWidth = getCardWidth();
    // Geser satu card
    slider.scrollBy({ left: dir * cardWidth, behavior: 'smooth' });
    // Setelah animasi selesai, cek dan lompat ke tengah jika perlu
    const checkAndJump = () => {
      if (!slider) return;
      // Jika scroll terlalu kiri
      if (slider.scrollLeft < cardWidth * 0.5) {
        slider.scrollTo({
          left: cardWidth * dataLength + slider.scrollLeft,
          behavior: 'auto',
        });
      }
      // Jika scroll terlalu kanan
      else if (slider.scrollLeft > cardWidth * (dataLength - 1 - 0.5)) {
        slider.scrollTo({
          left: cardWidth * dataLength,
          behavior: 'auto',
        });
      }
    };
    // Gunakan requestAnimationFrame untuk memastikan setelah animasi selesai
    setTimeout(() => {
      requestAnimationFrame(checkAndJump);
    }, 400);
  };

  // Fungsi geser baru
  const goTo = (dir) => {
    let next = currentIndex + dir;
    if (next < 0) next = 0;
    if (next > dataLength - 1) next = dataLength - 1;
    setCurrentIndex(next);
    const slider = sliderRef.current;
    if (!slider) return;
    const cardWidth = getCardWidth();
    slider.scrollTo({ left: cardWidth * (next), behavior: 'smooth' });
  };
  // Update currentIndex saat scroll manual
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;
    const onScroll = () => {
      const cardWidth = getCardWidth();
      const idx = Math.round(slider.scrollLeft / cardWidth);
      setCurrentIndex(idx);
    };
    slider.addEventListener('scroll', onScroll);
    return () => slider.removeEventListener('scroll', onScroll);
  }, [dataLength]);

  // Animasi intersection
  const [cardRefs, visible] = useInViewAnimation(dataLength);

  if (loading) return <div>Loading...</div>;
  if (bestOfData.length === 0) return <div>Data tidak tersedia</div>;

  return (
    <section className="w-full max-w-[1230px] mx-auto px-5 py-4 mb-1 md:mb-2">
      {/* HEADER */}
      <div className="flex flex-col items-start justify-center mb-2 px-1 md:px-0 text-left">
        
        <h2 className="text-3xl md:text-5xl font-raleway font-bold text-gray-900 leading-tight mb-2" style={{fontFamily: 'Playfair Display, serif'}}>
          Fasilitas Dayeuhmanggung 
        </h2>
        {/* Progress bar */}
        <div className="w-full mt-1 mb-2">
          <div className="relative w-full h-1 bg-gray-200 rounded">
            <div className="absolute top-0 left-0 h-1 bg-black rounded transition-all duration-300" style={{width: `${dataLength > 1 ? ((currentIndex+1)/dataLength)*100 : 100}%`}}></div>
          </div>
        </div>
        {/* Pagination row */}
        <div className="w-full flex items-center justify-between md:justify-end gap-3 mb-4">
          <div className="flex items-end gap-1">
            <span className="text-2xl leading-none roboto-font">{String(currentIndex+1).padStart(2,'0')}</span>
            <span className="text-xl leading-none roboto-font">/ {String(dataLength).padStart(2,'0')}</span>
          </div>
          <div className="flex items-center gap-6">
            <button className="text-xl" aria-label="Sebelumnya" onClick={() => goTo(-1)} disabled={currentIndex === 0}><svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg></button>
            <button className="text-2xl" aria-label="Selanjutnya" onClick={() => goTo(1)} disabled={currentIndex === dataLength-1}><svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg></button>
          </div>
        </div>
      </div>
      {/* Card BestOf dengan scroll horizontal, infinite */}
        <div ref={sliderRef} className="flex gap-3 md:gap-8 items-start overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory" style={{scrollbarWidth: 'none', touchAction: 'pan-x'}}>
          {bestOfData.map((item, idx) => (
            <Link
              key={idx + '-' + (item?.id || 'bestof')}
              to={`/bestof/${item?.id}`}
              ref={el => cardRefs.current[idx] = el}
              data-idx={idx}
              className={"relative flex-shrink-0 min-w-[90vw] max-w-[90vw] md:min-w-[330px] md:max-w-[330px] h-[420px] md:h-[420px] rounded-2xl overflow-hidden bg-white mb-5 snap-start shadow group cursor-pointer hover:brightness-95"}
              style={{ textDecoration: 'none' }}
            >
              <img
                src={item?.gambar ? `/images/${item.gambar}` : '/images/default-bestof.jpg'}
                alt={item?.judul}
                className="w-full h-full object-cover object-center rounded-2xl transition-transform duration-300 ease-out group-hover:scale-110"
                loading="lazy"
                style={{ opacity: 1, transform: 'none', transition: 'transform 0.3s' }}
              />
              {/* Label kategori */}
              <div className={`absolute top-4 left-4 z-20 transition-all duration-700 ease-in-out
                ${visible[idx] ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}`}
                style={{ transitionDelay: `${200 + idx * 80}ms` }}>
                <span className="absolute top-2 left-2 bg-emerald-500 text-white text-base md:text-lg font-bold px-2 md:px-5 py-2 rounded-md shadow font-raleway z-20">{item?.kategori || 'Fasilitas'}</span>
              </div>
              {/* Overlay bawah untuk judul, waktu, dan harga tiket */}
              <div className="absolute bottom-0 left-0 w-full z-20 p-0">
                <div className="w-full bg-gradient-to-t from-black/80 via-black/40 to-transparent px-4 md:px-6 pt-8 md:pt-10 pb-4 md:pb-5">
                  <h3 className={`text-lg md:text-2xl font-raleway font-bold text-white mb-2 drop-shadow-lg transition-all duration-700 ease-in-out
                    ${visible[idx] ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}`}
                    style={{ transitionDelay: `${320 + idx * 80}ms` }}
                    title={item?.judul}>{item?.judul}</h3>
                  {/* Info utama destinasi */}
                  <div className={`flex flex-col gap-1 mb-2 text-sm md:text-base text-gray-100 transition-all duration-700 ease-in-out
                    ${visible[idx] ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}`}
                    style={{ transitionDelay: `${400 + idx * 80}ms` }}>
                    {item?.jam_operasional && (
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-emerald-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /><circle cx="12" cy="12" r="10" /></svg>
                        <span>{item.jam_operasional}</span>
                      </div>
                    )}
                    {item?.biaya && (
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-emerald-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0V4m0 10v6" /></svg>
                        <span>Rp{item.biaya.toLocaleString('id-ID')}</span>
                      </div>
                    )}
                  </div>
                  {/* Deskripsi singkat */}
                </div>
              </div>
            </Link>
          ))}
        </div>
    </section>
  );
};

export default BestOf;