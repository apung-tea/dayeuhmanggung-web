import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { profileAdminService } from '../../services/api';

export default function Profile() {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState('');
  const fileInputRef = useRef();

  useEffect(() => {
    setLoading(true);
    profileAdminService.get()
      .then(json => {
        if (json.success !== false) {
          setAdminData(json.data || json);
          setForm(json.data || json);
        } else {
          setError(json.message || 'Gagal mengambil data admin');
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Gagal mengambil data admin');
        setLoading(false);
      });
  }, []);

  const handleEdit = () => {
    setForm(adminData);
    setEditMode(true);
    setSuccessMsg('');
  };

  const handleCancel = () => {
    setEditMode(false);
    setSuccessMsg('');
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setError(null);
    let data = form;
    let isFormData = false;
    // Jika ada file, gunakan FormData
    if (form.foto && form.foto instanceof File) {
      isFormData = true;
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== undefined && value !== null) formData.append(key, value);
      });
      data = formData;
    }
    profileAdminService.update(data, isFormData)
      .then(json => {
        if (json.success !== false) {
          setSuccessMsg('Profil berhasil diperbarui!');
          setEditMode(false);
          // Refresh data
          setLoading(true);
          profileAdminService.get()
            .then(json2 => {
              if (json2.success !== false) setAdminData(json2.data || json2);
              setLoading(false);
            });
        } else {
          setError(json.message || 'Gagal memperbarui profil');
        }
        setSaving(false);
      })
      .catch(() => {
        setError('Gagal memperbarui profil');
        setSaving(false);
      });
  };

  // Upload foto profile
  const handleAvatarClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };
  const handleFileChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setUploadMsg('');
    const formData = new FormData();
    formData.append('foto', file);
    profileAdminService.update(formData, true)
      .then(json => {
        if (json.success !== false) {
          setUploadMsg('Foto profil berhasil diupload!');
          // Refresh data
          setLoading(true);
          profileAdminService.get()
            .then(json2 => {
              if (json2.success !== false) setAdminData(json2.data || json2);
              setLoading(false);
            });
        } else {
          setUploadMsg(json.message || 'Gagal upload foto profil');
        }
        setUploading(false);
      })
      .catch(() => {
        setUploadMsg('Gagal upload foto profil');
        setUploading(false);
      });
  };

  const handleLogout = () => {
    if (window.confirm('Apakah Anda yakin ingin logout?')) {
      localStorage.removeItem('isLoggedIn');
      navigate('/login');
    }
  };

  if (loading) return <div className="p-6">Memuat...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!adminData) return null;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Profil Saya</h2>
      {/* Tombol Logout fixed di pojok kanan bawah */}
      <button
        onClick={handleLogout}
        className="fixed bottom-6 right-6 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg z-50"
        style={{minWidth:'120px'}}
      >
        Logout
      </button>
      {successMsg && <div className="mb-4 text-green-600 font-semibold">{successMsg}</div>}
      {uploadMsg && <div className="mb-4 text-green-600 font-semibold">{uploadMsg}</div>}
      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow flex items-center gap-6 p-6 mb-6">
        <div className="relative">
          <img
            src={adminData.foto || 'https://randomuser.me/api/portraits/men/32.jpg'}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover border-4 border-white shadow cursor-pointer"
            onClick={handleAvatarClick}
            title="Klik untuk ganti foto profil"
          />
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <span className="absolute bottom-2 right-2 bg-green-100 p-1 rounded-full border border-white cursor-pointer" onClick={handleAvatarClick} title="Ganti foto profil">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M12 5v14m7-7H5" stroke="#047857" strokeWidth="2" strokeLinecap="round"/></svg>
          </span>
          {uploading && <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-full"><span className="text-green-700 font-bold">Mengupload...</span></div>}
        </div>
        <div>
          <div className="text-lg font-semibold text-emerald-900">{adminData.nama}</div>
          <div className="text-sm text-gray-500">{adminData.kota}{adminData.negara ? `, ${adminData.negara}` : ''}</div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-semibold text-emerald-900">Informasi Pribadi</h3>
          {!editMode ? (
            <button onClick={handleEdit} className="flex items-center gap-1 bg-orange-500 hover:bg-orange-600 text-white px-4 py-1.5 rounded transition text-sm font-medium shadow">
              Ubah
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M16.862 5.487a2.06 2.06 0 0 1 2.916 2.914l-9.2 9.2-3.09.343a.5.5 0 0 1-.553-.553l.343-3.09 9.2-9.2Z" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
          ) : null}
        </div>
        {!editMode ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-gray-500">Nama Depan</div>
              <div className="font-medium text-gray-900">{adminData.nama?.split(' ')[0]}</div>
            </div>
            <div>
              <div className="text-gray-500">Nama Belakang</div>
              <div className="font-medium text-gray-900">{adminData.nama?.split(' ').slice(1).join(' ')}</div>
            </div>
            <div>
              <div className="text-gray-500">Tanggal Lahir</div>
              <div className="font-medium text-gray-900">{adminData.tanggal_lahir ? new Date(adminData.tanggal_lahir).toLocaleDateString('id-ID') : '-'}</div>
            </div>
            <div>
              <div className="text-gray-500">Email</div>
              <div className="font-medium text-gray-900">{adminData.email}</div>
            </div>
            <div>
              <div className="text-gray-500">No. Telepon</div>
              <div className="font-medium text-gray-900">{adminData.no_telp}</div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-gray-500">Nama Lengkap</div>
              <input name="nama" value={form.nama || ''} onChange={handleChange} className="w-full border rounded px-2 py-1" required />
            </div>
            <div>
              <div className="text-gray-500">Tanggal Lahir</div>
              <input name="tanggal_lahir" type="date" value={form.tanggal_lahir || ''} onChange={handleChange} className="w-full border rounded px-2 py-1" />
            </div>
            <div>
              <div className="text-gray-500">Email</div>
              <input name="email" type="email" value={form.email || ''} onChange={handleChange} className="w-full border rounded px-2 py-1" required />
            </div>
            <div>
              <div className="text-gray-500">No. Telepon</div>
              <input name="no_telp" value={form.no_telp || ''} onChange={handleChange} className="w-full border rounded px-2 py-1" />
            </div>
            <div className="col-span-full flex gap-2 mt-4">
              <button type="submit" disabled={saving} className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded font-medium shadow">{saving ? 'Menyimpan...' : 'Simpan'}</button>
              <button type="button" onClick={handleCancel} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-1.5 rounded font-medium shadow">Batal</button>
            </div>
          </form>
        )}
      </div>

      {/* Address */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-semibold text-emerald-900">Alamat</h3>
        </div>
        {!editMode ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-gray-500">Negara</div>
              <div className="font-medium text-gray-900">{adminData.negara}</div>
            </div>
            <div>
              <div className="text-gray-500">Kota</div>
              <div className="font-medium text-gray-900">{adminData.kota}</div>
            </div>
            <div>
              <div className="text-gray-500">Kode Pos</div>
              <div className="font-medium text-gray-900">{adminData.kode_pos}</div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-gray-500">Negara</div>
              <input name="negara" value={form.negara || ''} onChange={handleChange} className="w-full border rounded px-2 py-1" />
            </div>
            <div>
              <div className="text-gray-500">Kota</div>
              <input name="kota" value={form.kota || ''} onChange={handleChange} className="w-full border rounded px-2 py-1" />
            </div>
            <div>
              <div className="text-gray-500">Kode Pos</div>
              <input name="kode_pos" value={form.kode_pos || ''} onChange={handleChange} className="w-full border rounded px-2 py-1" />
            </div>
          </form>
        )}
      </div>
    </div>
  );
} 