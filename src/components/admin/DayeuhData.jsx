import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { dataDayeuhService } from '../../services/api';

const initialForm = { judul: '', deskripsi: '', kategori: '' };

const DayeuhData = () => {
  const [data, setData] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 10;
  // Tambah state untuk pencarian
  const [search, setSearch] = useState("");
  // State untuk filter kategori
  const [filterKategori, setFilterKategori] = useState("");

  // Daftar kategori yang tersedia
  const kategoriList = [
    'Fasilitas Umum',
    'Akses & Transportasi',
    'Tiket dan Harga',
    'Aktivitas Wisata',
    'Cuaca dan Musim',
    'Sejarah dan Budaya',
    'Keamanan dan Aturan',
    'Kuliner',
    'Penginapan',
    'Event atau Kegiatan Khusus',
    'Lainnya'
  ];

  // Filter data sesuai pencarian dan kategori
  const filteredData = data.filter(item => {
    const matchesSearch = item.judul.toLowerCase().includes(search.toLowerCase()) ||
                         item.deskripsi.toLowerCase().includes(search.toLowerCase()) ||
                         (item.kategori && item.kategori.toLowerCase().includes(search.toLowerCase()));
    const matchesKategori = !filterKategori || item.kategori === filterKategori;
    return matchesSearch && matchesKategori;
  });
  
  const totalPages = Math.max(1, Math.ceil((filteredData.length || 0) / pageSize));
  const pagedData = (filteredData || []).slice((page - 1) * pageSize, page * pageSize);
  React.useEffect(() => { setPage(1); }, [filteredData.length]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await dataDayeuhService.getAll();
      setData(Array.isArray(res) ? res : []);
    } catch (e) {
      setError('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = () => {
    setForm(initialForm);
    setEditMode(false);
    setEditId(null);
    setShowModal(true);
  };

  const handleEditClick = (item) => {
    setForm({ judul: item.judul, deskripsi: item.deskripsi, kategori: item.kategori || '' });
    setEditMode(true);
    setEditId(item.id);
    setShowModal(true);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (editMode && editId) {
        await dataDayeuhService.update(editId, form);
      } else {
        await dataDayeuhService.create(form);
      }
      setForm(initialForm);
      setEditMode(false);
      setEditId(null);
      setShowModal(false);
      fetchData();
    } catch (e) {
      setError('Gagal menyimpan data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm('Yakin hapus data ini?')) return;
    setLoading(true);
    setError('');
    try {
      await dataDayeuhService.delete(id);
      fetchData();
    } catch (e) {
      setError('Gagal menghapus data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-2">
        <h2 className="text-xl font-semibold text-gray-800">Kelola Data Chatbot</h2>
        <div className="flex gap-2 w-full md:w-auto justify-end">
          <div className="relative w-full max-w-[200px]">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </span>
            <input
              type="text"
              className="border border-gray-300 rounded-lg pl-9 pr-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-300"
              placeholder="Cari judul, deskripsi, atau kategori..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300"
            value={filterKategori}
            onChange={e => setFilterKategori(e.target.value)}
          >
            <option value="">Semua Kategori</option>
            {kategoriList.map(kategori => (
              <option key={kategori} value={kategori}>{kategori}</option>
            ))}
          </select>
          <button 
            onClick={handleOpenModal} 
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
            </svg>
            Tambah Data
          </button>
        </div>
      </div>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
        <div className="overflow-x-auto rounded-lg border border-gray-300 shadow-sm">
          <table className="w-full bg-white text-xs">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-300">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">Judul</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">Kategori</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">Deskripsi</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {pagedData && pagedData.length > 0 ? (
                pagedData.map((item, index) => (
                  <tr key={item.id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200 border-b border-gray-200">{item.id}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-200 border-b border-gray-200">{item.judul}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200 border-b border-gray-200">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {item.kategori || 'Tidak ada kategori'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate border-r border-gray-200 border-b border-gray-200">{item.deskripsi}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium border-b border-gray-200">
                      <div className="flex flex-col gap-2">
                        <button 
                          onClick={() => handleEditClick(item)} 
                          className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition-colors text-xs"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(item.id)} 
                          className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors text-xs"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-gray-500 border-b border-gray-200">
                    <div className="flex flex-col items-center">
                      <svg className="w-12 h-12 text-gray-300 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                      </svg>
                      <p>Tidak ada data</p>
                      <p className="text-sm text-gray-400">Klik "Tambah Data" untuk menambahkan data baru</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Sebelumnya
            </button>
            <span className="text-sm text-gray-600 font-medium">Halaman {page} dari {totalPages}</span>
            <button
              className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Berikutnya
            </button>
          </div>
        )}
        </>
      )}
      {/* Modal Tambah/Edit Data Dayeuh */}
      {showModal && ReactDOM.createPortal(
        <>
          {/* Blur background overlay */}
          <div className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-sm"></div>
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-green-200">
              {/* Header */}
              <div className="sticky top-0 bg-white px-6 py-4 border-b border-green-200 rounded-t-xl">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-green-800 font-raleway">
                    {editMode ? 'Edit Data Dayeuh' : 'Tambah Data Dayeuh'}
                  </h3>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                    onClick={() => setShowModal(false)}
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-green-700">Judul</label>
                  <input
                    type="text"
                    className="w-full border border-green-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300 bg-green-50"
                    value={form.judul}
                    onChange={e => setForm(f => ({ ...f, judul: e.target.value }))}
                    required
                    placeholder="Masukkan judul data"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-green-700">Kategori</label>
                  <select
                    className="w-full border border-green-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300 bg-green-50"
                    value={form.kategori}
                    onChange={e => setForm(f => ({ ...f, kategori: e.target.value }))}
                    required
                  >
                    <option value="">Pilih Kategori</option>
                    {kategoriList.map(kategori => (
                      <option key={kategori} value={kategori}>{kategori}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-green-700">Deskripsi</label>
                  <textarea
                    className="w-full border border-green-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300 bg-green-50 resize-none"
                    rows={6}
                    value={form.deskripsi}
                    onChange={e => setForm(f => ({ ...f, deskripsi: e.target.value }))}
                    required
                    placeholder="Deskripsikan data ini secara detail..."
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-green-200 rounded-b-xl">
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition-colors"
                    onClick={() => setShowModal(false)}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors"
                  >
                    {editMode ? 'Update' : 'Simpan'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </>,
        document.body
      )}
    </div>
  );
};

export default DayeuhData; 