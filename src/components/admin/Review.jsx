import React, { useState } from 'react';

const Review = ({ 
  reviewData, 
  loading, 
  notif, 
  notifType, 
  filterStatus, 
  setFilterStatus, 
  loadingAction, 
  onSetujui, 
  onTolak, 
  onDelete, 
  onDetailClick,
  showDetailModal,
  detailReview,
  onCloseDetail
}) => {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  // Tambah state untuk pencarian
  const [search, setSearch] = useState("");
  // Filter data sesuai pencarian dan status
  const filteredReviewData = (filterStatus === 'all' ? reviewData : reviewData.filter(r => r.status === filterStatus))
    .filter(item =>
      (item.nama && item.nama.toLowerCase().includes(search.toLowerCase())) ||
      (item.email && item.email.toLowerCase().includes(search.toLowerCase())) ||
      (item.review && item.review.toLowerCase().includes(search.toLowerCase()))
    );
  const totalPages = Math.max(1, Math.ceil(filteredReviewData.length / pageSize));
  const pagedData = filteredReviewData.slice((page - 1) * pageSize, page * pageSize);
  React.useEffect(() => { setPage(1); }, [filteredReviewData.length]);

  // Reset ke halaman 1 jika filter berubah atau data berubah
  React.useEffect(() => { setPage(1); }, [filterStatus, reviewData]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-2">
        <h2 className="text-xl font-semibold text-gray-800">Kelola Customer Review</h2>
        <div className="flex gap-2 w-full md:w-auto justify-end">
          <div className="relative w-full max-w-[200px]">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </span>
            <input
              type="text"
              className="border border-gray-300 rounded-lg pl-9 pr-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-300"
              placeholder="Cari review..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {notif && (
            <div className={`mb-4 p-3 rounded ${notifType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {notif}
            </div>
          )}
          <div className="mb-6 flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700">Filter Status:</label>
            <select 
              value={filterStatus} 
              onChange={e => setFilterStatus(e.target.value)} 
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
            >
              <option value="all">Semua Status</option>
              <option value="pending">Pending</option>
              <option value="disetujui">Disetujui</option>
              <option value="ditolak">Ditolak</option>
            </select>
          </div>
          <div className="w-full overflow-x-auto rounded-lg border border-gray-300 shadow-sm">
            <table className="min-w-[500px] w-full bg-white">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-300">
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">ID</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">Nama</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">Email</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">Rating</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">Review</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">Tanggal</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">Status</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {pagedData.length > 0 ? (
                  pagedData.map((review, index) => (
                    <tr key={review.id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200 border-b border-gray-200">{review.id}</td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-200 border-b border-gray-200">{review.nama}</td>
                      <td className="px-3 py-3 text-sm text-gray-500 max-w-[110px] truncate border-r border-gray-200 border-b border-gray-200" title={review.email}>{review.email}</td>
                      <td className="px-3 py-3 whitespace-nowrap border-r border-gray-200 border-b border-gray-200">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star} className="text-sm">
                            {star <= review.rating ? '⭐' : '☆'}
                          </span>
                        ))}
                      </td>
                      <td className="px-3 py-3 text-sm text-gray-500 max-w-[90px] truncate border-r border-gray-200 border-b border-gray-200" title={review.review}>
                        {review.review.length > 20 ? (
                          <>
                            {review.review.slice(0, 20)}... 
                            <button 
                              className="text-blue-600 underline ml-1 text-xs" 
                              onClick={() => onDetailClick(review)}
                            >
                              Detail
                            </button>
                          </>
                        ) : review.review}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200 border-b border-gray-200">
                        {review.created_at ? new Date(review.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap border-r border-gray-200 border-b border-gray-200">
                        <span className={`px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 ${
                          review.status === 'disetujui'
                            ? 'bg-green-100 text-green-800'
                            : review.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {review.status === 'disetujui' && '✔️'}
                          {review.status === 'pending' && '⏳'}
                          {review.status === 'ditolak' && '❌'}
                          {review.status}
                        </span>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm font-medium border-b border-gray-200">
                        <div className="flex flex-wrap gap-1">
                          {review.status === 'pending' && (
                            <>
                              <button 
                                className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600 transition-colors disabled:opacity-50" 
                                onClick={() => onSetujui(review.id)} 
                                disabled={loadingAction === review.id}
                              >
                                {loadingAction === review.id ? <span className="animate-spin inline-block mr-1">🔄</span> : null}Setujui
                              </button>
                              <button 
                                className="bg-yellow-500 text-white px-2 py-1 rounded text-xs hover:bg-yellow-600 transition-colors disabled:opacity-50" 
                                onClick={() => onTolak(review.id)} 
                                disabled={loadingAction === review.id}
                              >
                                {loadingAction === review.id ? <span className="animate-spin inline-block mr-1">🔄</span> : null}Tolak
                              </button>
                            </>
                          )}
                          <button 
                            className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 transition-colors disabled:opacity-50" 
                            onClick={() => onDelete(review.id)} 
                            disabled={loadingAction === review.id}
                          >
                            {loadingAction === review.id ? <span className="animate-spin inline-block mr-1">🔄</span> : null}Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-4 py-8 text-center text-gray-500 border-b border-gray-200">
                      <div className="flex flex-col items-center">
                        <svg className="w-12 h-12 text-gray-300 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                        </svg>
                        <p>Tidak ada data review</p>
                        <p className="text-sm text-gray-400">Belum ada review customer yang masuk</p>
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

      {/* Modal Detail Review */}
      {showDetailModal && detailReview && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button 
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" 
              onClick={onCloseDetail}
            >
              ✖️
            </button>
            <h3 className="text-lg font-semibold mb-2">Detail Review</h3>
            <div className="mb-2"><b>Nama:</b> {detailReview.nama}</div>
            <div className="mb-2"><b>Email:</b> {detailReview.email}</div>
            <div className="mb-2">
              <b>Rating:</b> 
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className="text-lg">
                  {star <= detailReview.rating ? '⭐' : '☆'}
                </span>
              ))}
            </div>
            <div className="mb-2">
              <b>Tanggal:</b> {detailReview.created_at ? new Date(detailReview.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
            </div>
            <div className="mb-2"><b>Status:</b> {detailReview.status}</div>
            <div className="mb-2"><b>Review:</b><br />{detailReview.review}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Review; 