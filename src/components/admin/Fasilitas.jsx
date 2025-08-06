import React, { useState } from 'react';
import ReactDOM from 'react-dom';

const Fasilitas = ({ fasilitasData, loading, onAdd, onEdit, onDelete }) => {
  // Tambahkan state untuk pagination
  const [page, setPage] = useState(1);
  const pageSize = 10;
  // Tambah state untuk pencarian
  const [search, setSearch] = useState("");
  // Filter data sesuai pencarian
  const filteredData = (fasilitasData || []).filter(item =>
    (item.nama && item.nama.toLowerCase().includes(search.toLowerCase())) ||
    (item.deskripsi && item.deskripsi.toLowerCase().includes(search.toLowerCase()))
  );
  const totalPages = Math.max(1, Math.ceil((filteredData.length || 0) / pageSize));
  const pagedData = (filteredData || []).slice((page - 1) * pageSize, page * pageSize);
  React.useEffect(() => { setPage(1); }, [filteredData.length]);

  // Reset ke halaman 1 jika data berubah
  React.useEffect(() => { setPage(1); }, [fasilitasData]);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ nama: '', deskripsi: '', gambar: null, status_aktif: 1 });
  const [preview, setPreview] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const handleOpenModal = () => {
    setForm({ nama: '', deskripsi: '', gambar: null, status_aktif: 1 });
    setPreview('');
    setEditMode(false);
    setEditId(null);
    setShowModal(true);
  };

  const handleEditClick = (item) => {
    setForm({ nama: item.nama, deskripsi: item.deskripsi, gambar: null, status_aktif: item.status_aktif });
    setPreview(item.gambar ? `/images/${item.gambar}` : '');
    setEditMode(true);
    setEditId(item.id);
    setShowModal(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setForm(f => ({ ...f, gambar: file }));
    setPreview(file ? URL.createObjectURL(file) : '');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editMode) {
      onEdit(editId, form, setShowModal);
    } else {
      onAdd(form, setShowModal);
    }
  };

  const handleDeleteClick = (id) => {
    if (window.confirm('Yakin ingin menghapus fasilitas ini?')) {
      onDelete(id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Kelola Destinasi</h2>
        <div className="flex gap-2 w-full md:w-auto justify-end">
          <div className="relative w-full max-w-[200px]">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </span>
            <input
              type="text"
              className="border border-gray-300 rounded-lg pl-9 pr-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-300"
              placeholder="Cari fasilitas..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button 
            onClick={handleOpenModal} 
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
            </svg>
            Tambah Fasilitas
          </button>
        </div>
      </div>
      
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
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">Nama</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">Deskripsi</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">Gambar</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">Tanggal Buat</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {pagedData && pagedData.length > 0 ? (
                pagedData.map((item, index) => (
                  <tr key={item.id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200 border-b border-gray-200">{item.id}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-200 border-b border-gray-200">{item.nama && item.nama.length > 30 ? item.nama.slice(0, 30) + '...' : item.nama}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate border-r border-gray-200 border-b border-gray-200">
                      {item.deskripsi && item.deskripsi.length > 'Tersedia warung dan kedai lokal dengan'.length
                        ? item.deskripsi.slice(0, 'Tersedia warung dan kedai lokal dengan'.length) + '...'
                        : item.deskripsi}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap border-r border-gray-200 border-b border-gray-200">
                      {item.gambar ? (
                        <img 
                          src={`/images/${item.gambar}`} 
                          alt={item.nama} 
                          className="w-16 h-12 object-cover rounded-md border" 
                          onError={e => e.target.src='/images/default-article.jpg'} 
                        />
                      ) : (
                        <span className="text-gray-400 text-xs">Tidak ada gambar</span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap border-r border-gray-200 border-b border-gray-200">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        Number(item.status_aktif) === 1 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {Number(item.status_aktif) === 1 ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200 border-b border-gray-200">
                      {item.create_at ? new Date(item.create_at).toLocaleDateString('id-ID') : '-'}
                    </td>
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
                  <td colSpan="7" className="px-4 py-8 text-center text-gray-500 border-b border-gray-200">
                    <div className="flex flex-col items-center">
                      <svg className="w-12 h-12 text-gray-300 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                      </svg>
                      <p>Tidak ada data fasilitas</p>
                      <p className="text-sm text-gray-400">Klik "Tambah Fasilitas" untuk menambahkan data baru</p>
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
      {/* Modal Tambah/Edit Fasilitas */}
      {showModal && ReactDOM.createPortal(
        <>
          {/* Blur background overlay */}
          <div className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-sm"></div>
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-green-200">
              {/* Header */}
              <div className="sticky top-0 bg-white px-6 py-4 border-b border-green-200 rounded-t-xl">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-green-800 font-raleway">
                    {editMode ? 'Edit Fasilitas' : 'Tambah Fasilitas Baru'}
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
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Form Section */}
                  <div className="space-y-4">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-green-700">Nama Fasilitas</label>
                      <input 
                        type="text" 
                        className="w-full border border-green-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300 bg-green-50" 
                        value={form.nama} 
                        onChange={e => setForm(f => ({ ...f, nama: e.target.value }))} 
                        required 
                        placeholder="Masukkan nama fasilitas"
                      />
                    </div>
                    
                    <div>
                      <label className="block mb-2 text-sm font-medium text-green-700">Deskripsi Fasilitas</label>
                      <textarea 
                        className="w-full border border-green-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300 bg-green-50 resize-none" 
                        rows={6} 
                        value={form.deskripsi} 
                        onChange={e => setForm(f => ({ ...f, deskripsi: e.target.value }))} 
                        required 
                        placeholder="Deskripsikan fasilitas ini secara detail..."
                      />
                    </div>
                    
                    <div>
                      <label className="block mb-2 text-sm font-medium text-green-700">Gambar Fasilitas</label>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="w-full border border-green-200 rounded-lg px-3 py-2 bg-green-50 file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-green-100 file:text-green-700 hover:file:bg-green-200" 
                        onChange={handleFileChange} 
                      />
                    </div>
                    
                    <div>
                      <label className="block mb-2 text-sm font-medium text-green-700">Status Fasilitas</label>
                      <select 
                        className="w-full border border-green-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300 bg-green-50" 
                        value={form.status_aktif} 
                        onChange={e => setForm(f => ({ ...f, status_aktif: parseInt(e.target.value, 10) }))}
                      >
                        <option value="1">Aktif</option>
                        <option value="0">Nonaktif</option>
                      </select>
                    </div>
                  </div>

                  {/* Preview Section */}
                  <div className="space-y-4">
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <h4 className="text-sm font-medium text-green-700 mb-3">Preview Gambar</h4>
                      <div className="aspect-video bg-green-100 rounded-lg border-2 border-green-200 flex items-center justify-center overflow-hidden">
                        {preview ? (
                          <img src={preview} alt="Preview" className="object-cover w-full h-full" />
                        ) : (
                          <div className="text-center text-green-400">
                            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                            </svg>
                            <p className="text-sm">Belum ada gambar</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Fasilitas Preview */}
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <h4 className="text-sm font-medium text-green-700 mb-3">Preview Fasilitas</h4>
                      <div className="bg-white rounded-lg p-3 border border-green-200">
                        <h5 className="font-semibold text-green-800 mb-2 line-clamp-2">
                          {form.nama || 'Nama Fasilitas'}
                        </h5>
                        <p className="text-sm text-gray-600 line-clamp-4">
                          {form.deskripsi || 'Deskripsi fasilitas akan muncul di sini...'}
                        </p>
                        <div className="mt-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            form.status_aktif === 1 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {form.status_aktif === 1 ? 'Aktif' : 'Nonaktif'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
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
        </>
      , document.body)}
    </div>
  );
};

export default Fasilitas; 