import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fasilitasService } from '../../services/api';

const FasilitasDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fasilitasService.getById(id);
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
          src={data.gambar ? `/images/${data.gambar}` : '/images/default-article.jpg'}
          alt={data.nama}
          style={{ width: '100%', height: '50vh', objectFit: 'cover', objectPosition: 'center' }}
          onError={e => { e.target.src = '/images/default-article.jpg'; }}
        />
        <Link to="/" className="absolute top-3 sm:top-6 left-3 sm:left-6 bg-white/80 hover:bg-white text-green-700 font-semibold px-3 sm:px-4 py-2 rounded transition shadow-none border-none">&larr; Kembali</Link>
      </div>
      <div className="w-full max-w-2xl px-6 py-10 mx-auto bg-white/90 rounded-2xl shadow-lg -mt-16 relative z-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-green-900 mb-2 text-left leading-tight">{data.nama}</h1>
        <div className="mb-4">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${Number(data.status_aktif) === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {Number(data.status_aktif) === 1 ? 'Aktif' : 'Nonaktif'}
          </span>
        </div>
        <div className="text-base text-gray-700 mb-6 text-left max-w-2xl leading-relaxed">{data.deskripsi}</div>
        <div className="text-gray-500 text-sm text-left mb-2">Tanggal Buat: {data.create_at ? new Date(data.create_at).toLocaleDateString('id-ID') : '-'}</div>
      </div>
    </div>
  );
};

export default FasilitasDetail; 