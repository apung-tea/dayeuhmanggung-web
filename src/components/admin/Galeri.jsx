import React, { useState } from 'react';

const Galeri = ({ 
  galeriData, galeriLoading, galeriError, fileFoto, setFileFoto, uploading, onUpload, onDelete, onEditClick,
  showEditModal, setShowEditModal, editItem, editFileFoto, setEditFileFoto, editUploading, editPreviewFoto, setEditPreviewFoto, onEditSubmit
}) => {
  const [page, setPage] = useState(1);
  const pageSize = 12;
  const totalPages = Math.ceil(galeriData.length / pageSize);
  const pagedData = galeriData.slice((page - 1) * pageSize, page * pageSize);
  React.useEffect(() => { setPage(1); }, [galeriData]);
  return (
    <div className="bg-white rounded-lg shadow-md p-2 sm:p-6 max-w-full">
      <h2 className="text-xl font-semibold mb-4">Kelola Galeri</h2>
      <form className="mb-6 flex items-center gap-4" onSubmit={onUpload}>
        <input
          type="file"
          accept="image/*"
          onChange={e => setFileFoto(e.target.files[0])}
          className="border rounded px-2 py-1"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          disabled={uploading}
        >
          {uploading ? 'Mengupload...' : 'Upload Foto'}
        </button>
      </form>
      {galeriLoading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : galeriError ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">{galeriError}</div>
      ) : galeriData.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Tidak ada foto galeri.</p>
        </div>
      ) : (
        <>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {pagedData.map(item => (
            <div key={item.id} className="border rounded-xl border-green-200 shadow p-2 flex flex-col items-center bg-green-50">
              <div className="bg-green-100 h-32 w-full rounded-lg mb-2 flex items-center justify-center overflow-hidden">
                <img
                  src={`/images/${item.file_foto}`}
                  alt={item.file_foto}
                  className="object-cover w-full h-full"
                  onError={e => e.target.src='/images/default-galeri.jpg'}
                />
              </div>
              <span className="text-xs text-gray-500 mb-2">{item.created_at}</span>
              <div className="flex gap-2">
                <button
                  className="bg-yellow-500 text-white px-2 py-1 rounded text-xs hover:bg-yellow-600"
                  onClick={() => onEditClick(item)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                  onClick={() => onDelete(item.id)}
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
        {/* Pagination */}
        {galeriData.length > pageSize && (
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Sebelumnya
            </button>
            <span className="text-sm text-gray-600">Halaman {page} dari {totalPages}</span>
            <button
              className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Berikutnya
            </button>
          </div>
        )}
        </>
      )}

      {/* Modal Edit Galeri */}
      {showEditModal && editItem && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <form onSubmit={onEditSubmit} className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
            <button 
              type="button" 
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" 
              onClick={() => setShowEditModal(false)}
            >
              &times;
            </button>
            <h3 className="text-lg font-semibold mb-4">Edit Foto Galeri</h3>
            <div className="mb-3">
              <label className="block text-xs mb-1">Ganti Gambar</label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={e => {
                  setEditFileFoto(e.target.files[0]);
                  setEditPreviewFoto(e.target.files[0] ? URL.createObjectURL(e.target.files[0]) : (editItem.file_foto ? `/images/${editItem.file_foto}` : ''));
                }} 
                className="w-full border rounded px-2 py-1 text-sm" 
              />
            </div>
            {editPreviewFoto && (
              <img src={editPreviewFoto} alt="Preview" className="w-32 h-20 object-cover rounded mb-2" />
            )}
            <button 
              type="submit" 
              className="bg-blue-600 text-white px-4 py-2 rounded text-sm" 
              disabled={editUploading}
            >
              {editUploading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Galeri; 