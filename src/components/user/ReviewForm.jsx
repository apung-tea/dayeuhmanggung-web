import React, { useState } from 'react';
import { reviewService } from '../../services/api';

const ReviewForm = () => {
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    rating: 5,
    review: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nama || !formData.review) {
      setMessage('Nama dan review harus diisi!');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      await reviewService.create(formData);
      setMessage('Review berhasil dikirim! Terima kasih atas feedback Anda.');
      setFormData({
        nama: '',
        email: '',
        rating: 5,
        review: ''
      });
    } catch (error) {
      console.error('Error submitting review:', error);
      setMessage('Gagal mengirim review. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-raleway font-bold text-gray-900 mb-4" style={{fontFamily: 'Playfair Display, serif'}}>
            Tambah Ulasan
          </h2>
          
        </div>

        <div className="bg-gray-50 rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama *
                </label>
                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Masukkan nama Anda"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Masukkan email Anda"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating *
              </label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                    className="text-2xl cursor-pointer transition-colors"
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setFormData(prev => ({ ...prev, rating: star }));
                      }
                    }}
                  >
                    {star <= formData.rating ? '⭐' : '☆'}
                  </span>
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {formData.rating} dari 5
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Review *
              </label>
              <textarea
                name="review"
                value={formData.review}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Bagikan pengalaman Anda di Perkebunan Dayeuhmanggung..."
                required
              ></textarea>
            </div>

            {message && (
              <div className={`p-4 rounded-lg ${
                message.includes('berhasil') 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {message}
              </div>
            )}

            <div className="text-center">
              <button
                type="submit"
                disabled={loading}
                className="bg-green-700 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-800 transition-colors disabled:opacity-10 disabled:cursor-not-allowed"
              >
                {loading ? 'Mengirim...' : 'Kirim Review'}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Review Anda akan ditampilkan setelah disetujui oleh admin.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ReviewForm; 