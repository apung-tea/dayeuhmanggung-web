import React, { useState } from 'react';

const Tentang = ({ 
  tentangData, 
  tentangEdit, 
  setTentangEdit, 
  tentangLoading, 
  tentangMsg, 
  tentangFile, 
  setTentangFile, 
  tentangPreview, 
  setTentangPreview, 
  onSave, 
  reloadData, // tambahkan prop ini dari Admin.jsx agar bisa reload data
  setNotifTentang // tambahkan prop ini dari Admin.jsx untuk notifikasi
}) => {
  const [editMode, setEditMode] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  const [localMsg, setLocalMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalLoading(true);
    setLocalMsg('');
    try {
      const res = await onSave(e, true); // onSave harus return response dari backend
      if (res && res.success) {
        setEditMode(false);
        setNotifTentang && setNotifTentang('Data tentang berhasil disimpan!');
        reloadData && reloadData();
        setTimeout(() => setNotifTentang && setNotifTentang(''), 2500);
      } else {
        setLocalMsg(res && res.error ? res.error : 'Gagal menyimpan data!');
      }
    } catch (err) {
      setLocalMsg('Gagal menyimpan data!');
    }
    setLocalLoading(false);
  };

  if (!editMode) {
    return (
      <div className="bg-white rounded-lg shadow-md p-2 sm:p-6 max-w-full">
        <h2 className="text-xl font-semibold mb-4 text-green-800">Kelola Halaman Tentang</h2>
        <div className="mb-4">
          <span className="block text-xs font-semibold text-green-700 mb-1">Judul</span>
          <div className="text-lg font-bold text-green-900 mb-2">{tentangData.judul}</div>
        </div>
        <div className="mb-4">
          <span className="block text-xs font-semibold text-green-700 mb-1">Deskripsi</span>
          <div className="text-gray-800 mb-2 whitespace-pre-line">{tentangData.deskripsi}</div>
        </div>
        {tentangData.sejarah && <div className="mb-4"><span className="block text-xs font-semibold text-green-700 mb-1">Sejarah</span><div className="text-gray-800 mb-2 whitespace-pre-line">{tentangData.sejarah}</div></div>}
        {tentangData.visi_misi && <div className="mb-4"><span className="block text-xs font-semibold text-green-700 mb-1">Visi & Misi</span><div className="text-gray-800 mb-2 whitespace-pre-line">{tentangData.visi_misi}</div></div>}
        {tentangData.tujuan_web && <div className="mb-4"><span className="block text-xs font-semibold text-green-700 mb-1">Tujuan Website</span><div className="text-gray-800 mb-2 whitespace-pre-line">{tentangData.tujuan_web}</div></div>}
        {tentangData.tim && <div className="mb-4"><span className="block text-xs font-semibold text-green-700 mb-1">Tim Pengelola</span><div className="text-gray-800 mb-2 whitespace-pre-line">{tentangData.tim}</div></div>}
        {tentangData.kontak && <div className="mb-4"><span className="block text-xs font-semibold text-green-700 mb-1">Kontak</span><div className="text-gray-800 mb-2">{tentangData.kontak}</div></div>}
        {tentangData.tautan && <div className="mb-4"><span className="block text-xs font-semibold text-green-700 mb-1">Tautan</span><div className="text-blue-700 underline">{tentangData.tautan}</div></div>}
        {tentangData.gambar && <div className="mb-4"><span className="block text-xs font-semibold text-green-700 mb-1">Gambar</span><img src={`/images/${tentangData.gambar}`} alt="Tentang" className="max-w-full max-h-72 object-contain rounded-xl shadow border border-green-100" /></div>}
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-semibold shadow" onClick={() => { setEditMode(true); setTentangEdit({ ...tentangData }); }}>Edit</button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-2 sm:p-6 max-w-full">
      <h2 className="text-xl font-semibold mb-4 text-green-800">Edit Halaman Tentang</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-semibold text-green-700 mb-2">Judul</label>
          <input
            className="w-full p-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 bg-green-50"
            type="text"
            value={tentangEdit.judul || ''}
            onChange={e => setTentangEdit({ ...tentangEdit, judul: e.target.value })}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold text-green-700 mb-2">Deskripsi</label>
          <textarea
            className="w-full p-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 bg-green-50"
            rows="3"
            value={tentangEdit.deskripsi || ''}
            onChange={e => setTentangEdit({ ...tentangEdit, deskripsi: e.target.value })}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold text-green-700 mb-2">Sejarah</label>
          <textarea
            className="w-full p-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 bg-green-50"
            rows="3"
            value={tentangEdit.sejarah || ''}
            onChange={e => setTentangEdit({ ...tentangEdit, sejarah: e.target.value })}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold text-green-700 mb-2">Visi & Misi</label>
          <textarea
            className="w-full p-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 bg-green-50"
            rows="3"
            value={tentangEdit.visi_misi || ''}
            onChange={e => setTentangEdit({ ...tentangEdit, visi_misi: e.target.value })}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold text-green-700 mb-2">Tujuan Website</label>
          <textarea
            className="w-full p-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 bg-green-50"
            rows="2"
            value={tentangEdit.tujuan_web || ''}
            onChange={e => setTentangEdit({ ...tentangEdit, tujuan_web: e.target.value })}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold text-green-700 mb-2">Tim Pengelola</label>
          <textarea
            className="w-full p-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 bg-green-50"
            rows="2"
            value={tentangEdit.tim || ''}
            onChange={e => setTentangEdit({ ...tentangEdit, tim: e.target.value })}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold text-green-700 mb-2">Kontak</label>
          <input
            className="w-full p-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 bg-green-50"
            type="text"
            value={tentangEdit.kontak || ''}
            onChange={e => setTentangEdit({ ...tentangEdit, kontak: e.target.value })}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold text-green-700 mb-2">Tautan</label>
          <input
            className="w-full p-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 bg-green-50"
            type="text"
            value={tentangEdit.tautan || ''}
            onChange={e => setTentangEdit({ ...tentangEdit, tautan: e.target.value })}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold text-green-700 mb-2">Gambar</label>
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <input
              type="file"
              accept="image/*"
              className="w-auto border border-green-200 rounded-lg px-3 py-2 bg-green-50"
              onChange={e => {
                setTentangFile(e.target.files[0]);
                setTentangPreview(URL.createObjectURL(e.target.files[0]));
              }}
            />
            <div className="flex-1 w-full flex justify-center items-center min-h-[180px]">
              {tentangPreview && (
                <img src={tentangPreview} alt="Preview" className="max-w-full max-h-72 object-contain rounded-xl shadow border border-green-100" />
              )}
              {!tentangPreview && tentangData.gambar && (
                <img src={`/images/${tentangData.gambar}`} alt="Tentang" className="max-w-full max-h-72 object-contain rounded-xl shadow border border-green-100" />
              )}
            </div>
          </div>
        </div>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-semibold shadow"
          disabled={localLoading}
        >
          {localLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
        <button type="button" className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 font-semibold shadow mr-2" onClick={() => setEditMode(false)}>Batal</button>
        {localMsg && <div className="mt-2 text-sm text-red-600">{localMsg}</div>}
      </form>
    </div>
  );
};

export default Tentang; 