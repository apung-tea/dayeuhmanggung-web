import React, { useState } from 'react';
import ReactDOM from 'react-dom';

const BestOf = ({ 
  bestOfData, 
  loading, 
  onAdd, 
  onEdit, 
  onDelete, 
  showModal, 
  setShowModal,
  editItem,
  formData,
  setFormData,
  fileGambar,
  setFileGambar,
  previewGambar,
  setPreviewGambar,
  onSave
}) => {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  // Tambah state untuk pencarian
  const [search, setSearch] = useState("");
  // Filter data sesuai pencarian
  const filteredData = bestOfData.filter(item =>
    (item.judul && item.judul.toLowerCase().includes(search.toLowerCase())) ||
    (item.kategori && item.kategori.toLowerCase().includes(search.toLowerCase())) ||
    (item.lokasi && item.lokasi.toLowerCase().includes(search.toLowerCase())) ||
    (item.deskripsi && item.deskripsi.toLowerCase().includes(search.toLowerCase()))
  );
  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const pagedData = filteredData.slice((page - 1) * pageSize, page * pageSize);
  React.useEffect(() => { setPage(1); }, [filteredData.length]);
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-2">
        <h2 className="text-xl font-semibold text-gray-800">Kelola Fasilitas</h2>
        <div className="flex gap-2 w-full md:w-auto justify-end">
          <div className="relative w-full max-w-[200px]">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </span>
            <input
              type="text"
              className="border border-gray-300 rounded-lg pl-9 pr-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-300"
              placeholder="Cari destinasi..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button 
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2" 
            onClick={onAdd}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
            </svg>
            Tambah Destinasi Baru
          </button>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div>
          <div className="w-full overflow-x-auto rounded-lg border border-gray-300 shadow-sm">
            <table className="w-full table-fixed bg-white text-xs">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-300">
                  <th className="px-3 py-3 text-left font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200 w-10">ID</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200 w-32">Judul</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">Kategori</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200 w-28">Lokasi</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200 w-32 hidden md:table-cell">Deskripsi</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200 w-28">Jam Operasional</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">Biaya</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">Gambar</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-700 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {pagedData.length > 0 ? (
                  pagedData.map((item, index) => (
                    <tr key={item.id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <td className="px-3 py-3 whitespace-nowrap border-r border-gray-200 border-b border-gray-200 w-10">{item.id}</td>
                      <td className="px-3 py-3 whitespace-nowrap font-medium border-r border-gray-200 border-b border-gray-200 w-32 truncate">{item.judul}</td>
                      <td className="px-3 py-3 whitespace-nowrap border-r border-gray-200 border-b border-gray-200">{item.kategori}</td>
                      <td className="px-3 py-3 whitespace-nowrap border-r border-gray-200 border-b border-gray-200 w-28 truncate">{item.lokasi}</td>
                      <td className="px-3 py-3 text-gray- border-r border-gray-200 border-b border-gray-200 hidden md:table-cell">{item.deskripsi}</td>
                      <td className="px-3 py-3 whitespace-nowrap border-r border-gray-200 border-b border-gray-200 w-28 truncate">{item.jam_operasional}</td>
                      <td className="px-3 py-3 whitespace-nowrap border-r border-gray-200 border-b border-gray-200">{Number(item.biaya).toLocaleString('id-ID')}</td>
                      <td className="px-3 py-3 whitespace-nowrap border-r border-gray-200 border-b border-gray-200">
                        {item.gambar ? (
                          <img 
                            src={`/images/${item.gambar}`} 
                            alt={item.judul} 
                            className="w-16 h-12 object-cover rounded-md border" 
                            onError={e => e.target.src='/images/default-bestof.jpg'} 
                          />
                        ) : (
                          <span className="text-gray-400 text-xs">Tidak ada gambar</span>
                        )}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap font-medium border-b border-gray-200">
                        <div className="flex flex-col gap-2">
                          <button 
                            className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition-colors text-xs" 
                            onClick={() => onEdit(item)}
                          >
                            Edit
                          </button>
                          <button 
                            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors text-xs" 
                            onClick={() => onDelete(item.id)}
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="px-2 py-8 text-center text-gray-500 border-b border-gray-200">
                      <div className="flex flex-col items-center">
                        <svg className="w-12 h-12 text-gray-300 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                        <p>Tidak ada data destinasi</p>
                        <p className="text-sm text-gray-400">Klik "Tambah Best Of Baru" untuk menambahkan destinasi</p>
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
        </div>
      )}

      {/* Modal Tambah/Edit Best Of */}
      {showModal && ReactDOM.createPortal(
        <>
          {/* Blur background overlay */}
          <div className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-sm"></div>
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <form
              className="relative z-10 bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-green-200"
              onSubmit={onSave}
            >
              {/* Header */}
              <div className="sticky top-0 bg-white px-6 py-4 border-b border-green-200 rounded-t-xl">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-green-800 font-raleway">
                    {editItem ? 'Edit Destinasi' : 'Tambah Destinasi Baru'}
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
                      <label className="block mb-2 text-sm font-medium text-green-700">Judul Destinasi</label>
                      <input
                        className="w-full border border-green-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300 bg-green-50"
                        placeholder="Masukkan judul destinasi"
                        value={formData.judul}
                        onChange={e => setFormData({ ...formData, judul: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-green-700">Kategori</label>
                      <input
                        className="w-full border border-green-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300 bg-green-50"
                        placeholder="Masukkan kategori destinasi"
                        value={formData.kategori}
                        onChange={e => setFormData({ ...formData, kategori: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-green-700">Lokasi</label>
                      <input
                        className="w-full border border-green-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300 bg-green-50"
                        placeholder="Masukkan lokasi destinasi"
                        value={formData.lokasi}
                        onChange={e => setFormData({ ...formData, lokasi: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-green-700">Deskripsi</label>
                      <textarea
                        className="w-full border border-green-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300 bg-green-50 resize-none"
                        placeholder="Deskripsikan destinasi ini"
                        value={formData.deskripsi}
                        onChange={e => setFormData({ ...formData, deskripsi: e.target.value })}
                        required
                        rows={4}
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-green-700">Jam Operasional</label>
                      <input
                        className="w-full border border-green-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300 bg-green-50"
                        placeholder="Contoh: 08.00 - 17.00"
                        value={formData.jam_operasional}
                        onChange={e => setFormData({ ...formData, jam_operasional: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-green-700">Biaya</label>
                      <input
                        className="w-full border border-green-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300 bg-green-50"
                        placeholder="Masukkan biaya"
                        type="number"
                        value={formData.biaya}
                        onChange={e => setFormData({ ...formData, biaya: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-green-700">Gambar Destinasi</label>
                      <input
                        type="file"
                        accept="image/*"
                        className="w-full border border-green-200 rounded-lg px-3 py-2 bg-green-50 file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-green-100 file:text-green-700 hover:file:bg-green-200"
                        onChange={e => {
                          if (e.target.files && e.target.files[0]) {
                            setFileGambar(e.target.files[0]);
                            setPreviewGambar(URL.createObjectURL(e.target.files[0]));
                          }
                        }}
                      />
                    </div>
                  </div>

                  {/* Preview Section */}
                  <div className="space-y-4">
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <h4 className="text-sm font-medium text-green-700 mb-3">Preview Gambar</h4>
                      <div className="aspect-video bg-green-100 rounded-lg border-2 border-green-200 flex items-center justify-center overflow-hidden">
                        {previewGambar ? (
                          <img src={previewGambar} alt="Preview" className="object-cover w-full h-full" />
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
                    {editItem ? 'Update' : 'Simpan'}
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

export default BestOf; 