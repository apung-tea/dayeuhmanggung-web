import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { bestOfService } from '../../services/api';

const BestOfDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await bestOfService.getById(id);
        setData(res.data);
      } catch (err) {
        setError('Data tidak ditemukan');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="text-center py-16">Loading...</div>;
  if (error || !data) return <div className="text-center py-16 text-red-500">{error || 'Data tidak ditemukan'}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
      <div className="relative w-full overflow-hidden" style={{height: '50vh'}}>
        <img
          src={data.gambar ? `/images/${data.gambar}` : '/images/default-bestof.jpg'}
          alt={data.judul}
          style={{ width: '100%', height: '50vh', objectFit: 'cover', objectPosition: 'center' }}
          onError={e => { e.target.src = '/images/default-bestof.jpg'; }}
        />
        <Link to="/" className="absolute top-3 sm:top-6 left-3 sm:left-6 bg-white/80 hover:bg-white text-green-700 font-semibold px-3 sm:px-4 py-2 rounded transition shadow-none border-none">&larr; Kembali</Link>
      </div>
      <div className="w-full max-w-2xl px-6 py-10 mx-auto bg-white/90 rounded-2xl shadow-lg -mt-16 relative z-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-green-900 mb-2 text-left leading-tight">{data.judul}</h1>
        {data.kategori && (
          <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full mb-4">{data.kategori}</span>
        )}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4">
          <div className="flex items-center gap-2 text-gray-700">
            <svg xmlns='http://www.w3.org/2000/svg' className='w-5 h-5 text-green-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M17.657 16.657L13.414 12.414a4 4 0 10-1.414 1.414l4.243 4.243a1 1 0 001.414-1.414z' /><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M15 11a4 4 0 11-8 0 4 4 0 018 0z' /></svg>
            <span>{data.lokasi || '-'}</span>
          </div>
          <span className="hidden sm:inline-block text-gray-400">|</span>
          <div className="flex items-center gap-2 text-gray-700">
            <svg xmlns='http://www.w3.org/2000/svg' className='w-5 h-5 text-purple-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 8v4l3 3' /></svg>
            <span>{data.jam_operasional || '-'}</span>
          </div>
        </div>
        <div className="mb-6">
          <span className="inline-block bg-green-600 text-white text-lg font-bold px-5 py-2 rounded-xl shadow">{data.biaya ? `Rp${Number(data.biaya).toLocaleString('id-ID')}` : '-'}</span>
        </div>
        <div className="text-base text-gray-700 mb-2 text-left max-w-2xl leading-relaxed">{data.deskripsi}</div>
      </div>
    </div>
  );
};

export default BestOfDetail; 