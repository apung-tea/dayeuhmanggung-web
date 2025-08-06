import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { artikelService } from '../../services/api';

const ArticleDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await artikelService.getById(id);
        setData(res.data);
      } catch (err) {
        setError('Data tidak ditemukan');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) return <div className="text-center py-16">Loading...</div>;
  if (error || !data) return <div className="text-center py-16 text-red-500">{error || 'Data tidak ditemukan'}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
      <div className="relative w-full overflow-hidden" style={{height: '50vh'}}>
        <img
          src={data.gambar ? `/images/${data.gambar}` : '/images/default-article.jpg'}
          alt={data.judul}
          style={{ width: '100%', height: '50vh', objectFit: 'cover', objectPosition: 'center' }}
          onError={e => { e.target.src = '/images/default-article.jpg'; }}
        />
        <Link to="/" className="absolute top-3 sm:top-6 left-3 sm:left-6 bg-white/80 hover:bg-white text-green-700 font-semibold px-3 sm:px-4 py-2 rounded transition shadow-none border-none">&larr; Kembali</Link>
      </div>
      <div className="w-full max-w-2xl px-6 py-10 mx-auto bg-white/90 rounded-2xl shadow-lg -mt-16 relative z-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-green-900 mb-2 text-left leading-tight">{data.judul}</h1>
        <div className="flex flex-wrap gap-2 items-center text-gray-500 text-sm mb-2">
          <span>{formatDate(data.created_at)}</span>
          {data.penulis && <span>| Penulis: <span className="font-semibold text-gray-700">{data.penulis}</span></span>}
        </div>
        {data.kategori && (
          <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full mb-2">{data.kategori}</span>
        )}
        {data.tags && (
          <div className="mb-2 flex flex-wrap gap-2 items-center">
            {data.tags.split(',').map(tag => (
              <span key={tag} className="inline-block bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs">#{tag.trim()}</span>
            ))}
          </div>
        )}
        <div className="prose prose-lg max-w-none text-gray-800 text-left mb-4 leading-relaxed" style={{whiteSpace: 'pre-line'}}>{data.isi}</div>
      </div>
    </div>
  );
};

export default ArticleDetail; 