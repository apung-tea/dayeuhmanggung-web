import React from 'react';

const GaleriHeader = ({ title = 'Galeri Dayeuhmanggung', dataLength = 5, currentIndex = 0, onPrev, onNext, disablePrev, disableNext }) => {
  return (
    <section className="w-full max-w-5xl mx-auto px-5 pt-7 pb-0 mb-1 md:mb-2">
      {/* HEADER */}
      <div className="flex flex-col items-start justify-center mb-2 px-1 md:px-0 text-left">
        <h2 className="text-3xl md:text-5xl font-raleway font-bold text-gray-900 leading-tight mb-2" style={{fontFamily: 'Playfair Display, serif'}}>
          {title}
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
            <button className="text-xl" aria-label="Sebelumnya" onClick={onPrev} disabled={disablePrev}><svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg></button>
            <button className="text-2xl" aria-label="Selanjutnya" onClick={onNext} disabled={disableNext}><svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg></button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GaleriHeader; 