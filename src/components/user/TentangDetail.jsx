import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { tentangService } from '../../services/api';

const TentangDetail = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await tentangService.get();
        setData(res.data);
      } catch (err) {
        setError('Data tidak ditemukan');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-center py-16">Loading...</div>;
  if (error || !data) return <div className="text-center py-16 text-red-500">{error || 'Data tidak ditemukan'}</div>;

  // Gunakan data.gambar, bukan file_foto
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
      <div className="relative w-full overflow-hidden" style={{height: '50vh'}}>
        {data.gambar && (
          <img
            src={data.gambar.startsWith('http') ? data.gambar : `/images/${data.gambar}`}
            alt={data.judul || 'Tentang Dayeuhmanggung'}
            style={{ width: '100%', height: '50vh', objectFit: 'cover', objectPosition: 'center' }}
          />
        )}
        <Link to="/" className="absolute top-3 sm:top-6 left-3 sm:left-6 bg-white/80 hover:bg-white text-green-700 font-semibold px-3 sm:px-4 py-2 rounded transition shadow-none border-none">&larr; Kembali</Link>
      </div>
      <div className="w-full max-w-2xl px-6 py-10 mx-auto bg-white/90 rounded-2xl shadow-lg -mt-16 relative z-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-green-900 mb-2 text-left leading-tight">{data.judul || 'Tentang Dayeuhmanggung'}</h1>
        {data.deskripsi && <div className="prose prose-lg max-w-none text-gray-800 text-left mb-6 leading-relaxed" style={{whiteSpace: 'pre-line'}}>{data.deskripsi}</div>}
        {data.sejarah && (
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-1 text-green-700">Sejarah</h2>
            <div className="text-gray-700 text-base md:text-lg">{data.sejarah}</div>
          </div>
        )}
        {data.visi_misi && (
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-1 text-green-700">Visi & Misi</h2>
            <div className="text-gray-700 text-base md:text-lg">{data.visi_misi}</div>
          </div>
        )}
        {data.tujuan_web && (
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-1 text-green-700">Tujuan Website</h2>
            <div className="text-gray-700 text-base md:text-lg">{data.tujuan_web}</div>
          </div>
        )}
        {data.tim && (
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-1 text-green-700">Tim Pengelola</h2>
            <div className="text-gray-700 text-base md:text-lg">{data.tim}</div>
          </div>
        )}
        {data.kontak && (
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-1 text-green-700">Kontak</h2>
            <div className="text-gray-700 text-base md:text-lg">{data.kontak}</div>
          </div>
        )}
        {data.tautan && (
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-1 text-green-700">Tautan</h2>
            <a href={data.tautan} target="_blank" rel="noopener noreferrer" className="underline text-blue-700 hover:text-blue-900">{data.tautan}</a>
          </div>
        )}
        {/* Map Lokasi */}
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-1 text-green-700">Lokasi Dayeuhmanggung</h2>
          <div className="rounded-2xl overflow-hidden shadow-lg border border-green-300/40 bg-white/10 w-full max-w-md">
            <iframe
              title="Peta Dayeuhmanggung"
              src="https://www.google.com/maps?q=Dayeuhmanggung,+Cilawu,+Garut,+Jawa+Barat,+Indonesia&output=embed"
              width="100%"
              height="220"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TentangDetail; 