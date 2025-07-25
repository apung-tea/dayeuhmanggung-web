import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { 
  bestOfService, 
  tentangService, 
  reviewService, 
  artikelService, 
  dashboardService,
  galeriService,
  fasilitasService,
  profileAdminService,
} from '../../services/api';

// Import komponen terpisah
import Dashboard from './Dashboard';
import BestOf from './BestOf';
import Tentang from './Tentang';
import Galeri from './Galeri';
import Review from './Review';
import Artikel from './Artikel';
import Fasilitas from './Fasilitas';
import DayeuhData from './DayeuhData';
import Profile from './Profile';

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeMenu, setActiveMenu] = useState(() => localStorage.getItem('activeMenu') || 'dashboard');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ totalArtikel: 0, totalReview: 0, totalFoto: 0 });
  const [bestOfData, setBestOfData] = useState([]);
  const [tentangData, setTentangData] = useState({ deskripsi: '' });
  const [reviewData, setReviewData] = useState([]);
  const [artikelData, setArtikelData] = useState([]);
  const [showBestOfModal, setShowBestOfModal] = useState(false);
  const [editBestOf, setEditBestOf] = useState(null);
  const [formBestOf, setFormBestOf] = useState({
    judul: '',
    kategori: '',
    lokasi: '',
    deskripsi: '',
    jam_operasional: '',
    biaya: '',
    gambar: '',
  });
  const [fileGambar, setFileGambar] = useState(null);
  const [previewGambar, setPreviewGambar] = useState('');
  const [galeriData, setGaleriData] = useState([]);
  const [galeriLoading, setGaleriLoading] = useState(false);
  const [galeriError, setGaleriError] = useState(null);
  const [fileFoto, setFileFoto] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showEditGaleriModal, setShowEditGaleriModal] = useState(false);
  const [editGaleriItem, setEditGaleriItem] = useState(null);
  const [editFileFoto, setEditFileFoto] = useState(null);
  const [editUploading, setEditUploading] = useState(false);
  const [editPreviewFoto, setEditPreviewFoto] = useState('');
  const [tentangEdit, setTentangEdit] = useState({ deskripsi: '' });
  const [tentangLoading, setTentangLoading] = useState(false);
  const [tentangMsg, setTentangMsg] = useState('');
  const [tentangFile, setTentangFile] = useState(null);
  const [tentangPreview, setTentangPreview] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailReview, setDetailReview] = useState(null);
  const [notif, setNotif] = useState('');
  const [notifType, setNotifType] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loadingAction, setLoadingAction] = useState(null);
  const [showArtikelModal, setShowArtikelModal] = useState(false);
  const [editArtikel, setEditArtikel] = useState(null);
  const [formArtikel, setFormArtikel] = useState({ judul: '', konten: '', gambar: '', penulis: '', kategori: '', tags: '' });
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [fasilitasData, setFasilitasData] = useState([]);
  const [fasilitasLoading, setFasilitasLoading] = useState(false);
  const [showNotifModal, setShowNotifModal] = useState(false);
  const [pendingReviewCount, setPendingReviewCount] = useState(() => {
    // Ambil dari localStorage jika ada
    const saved = localStorage.getItem('pendingReviewCount');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [accountForm, setAccountForm] = useState({ username: '', email: '', password: '', old_password: '' });
  const [accountLoading, setAccountLoading] = useState(false);
  const [accountMsg, setAccountMsg] = useState('');
  const [notifArtikel, setNotifArtikel] = useState('');
  const [notifArtikelType, setNotifArtikelType] = useState('');
  const [notifFasilitas, setNotifFasilitas] = useState('');
  const [notifFasilitasType, setNotifFasilitasType] = useState('');
  const [notifDestinasi, setNotifDestinasi] = useState('');
  const [notifDestinasiType, setNotifDestinasiType] = useState('');
  const [notifGaleri, setNotifGaleri] = useState('');
  const [notifTentang, setNotifTentang] = useState('');
  const [notifReview, setNotifReview] = useState('');
  const [notifProfile, setNotifProfile] = useState('');

  // Ambil data admin untuk modal pengaturan
  const fetchAccountData = () => {
    profileAdminService.get()
      .then(json => {
        if (json.success !== false) {
          setAccountForm({ username: json.data?.username || json.username || '', email: json.data?.email || json.email || '', password: '', old_password: '' });
        }
      });
  };

  const handleAccountOpen = () => {
    fetchAccountData();
    setAccountMsg('');
    setShowAccountModal(true);
  };
  const handleAccountClose = () => {
    setShowAccountModal(false);
    setAccountForm({ username: '', email: '', password: '', old_password: '' });
    setAccountMsg('');
  };
  const handleAccountChange = e => {
    const { name, value } = e.target;
    setAccountForm(f => ({ ...f, [name]: value }));
  };
  const handleAccountSubmit = e => {
    e.preventDefault();
    setAccountLoading(true);
    setAccountMsg('');
    let data = accountForm;
    let isFormData = false;
    // Jika ada file, gunakan FormData
    if (accountForm.foto && accountForm.foto instanceof File) {
      isFormData = true;
      const formData = new FormData();
      Object.entries(accountForm).forEach(([key, value]) => {
        if (value !== undefined && value !== null) formData.append(key, value);
      });
      data = formData;
    }
    profileAdminService.update(data, isFormData)
      .then(json => {
        if (json.success !== false) {
          setAccountMsg('Berhasil memperbarui akun!');
          setAccountForm(f => ({ ...f, password: '', old_password: '' }));
          setNotifProfile('Profil berhasil diperbarui!');
          setTimeout(() => setNotifProfile(''), 2500);
        } else {
          setAccountMsg(json.message || 'Gagal memperbarui akun');
        }
        setAccountLoading(false);
      })
      .catch(() => {
        setAccountMsg('Gagal memperbarui akun');
        setAccountLoading(false);
      });
  };

  useEffect(() => {
    const loginStatus = localStorage.getItem('isLoggedIn');
    if (loginStatus !== 'true') {
      navigate('/login');
    } else {
      setIsLoggedIn(true);
      loadData();
    }
  }, [navigate]);

  // Polling review setiap 5 detik agar notifikasi responsif
  useEffect(() => {
    let interval;
    if (isLoggedIn) {
      interval = setInterval(async () => {
        try {
          const reviews = await reviewService.getAll();
          setReviewData(reviews.data || []);
        } catch {}
      }, 5000);
    }
    return () => interval && clearInterval(interval);
  }, [isLoggedIn]);

  // Update pendingReviewCount setiap kali reviewData berubah
  useEffect(() => {
    const count = reviewData.filter(r => r.status === 'pending').length;
    setPendingReviewCount(count);
    localStorage.setItem('pendingReviewCount', count);
  }, [reviewData]);

  const loadData = async () => {
    setLoading(true);
    try {
      switch (activeMenu) {
        case 'dashboard':
          const dashboardStats = await dashboardService.getStats();
          setStats(dashboardStats.data || dashboardStats);
          break;
        case 'bestof':
          const bestOf = await bestOfService.getAll();
          setBestOfData(bestOf.data || []);
          break;
        case 'tentang':
          const tentang = await tentangService.get();
          setTentangData(tentang.data || tentang);
          break;
        case 'review':
          const reviews = await reviewService.getAll();
          setReviewData(reviews.data || []);
          break;
        case 'artikel':
          const articles = await artikelService.getAll();
          setArtikelData(articles.data || []);
          break;
      }
    } catch (error) {
      alert('Terjadi error saat memuat data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadGaleri = async () => {
    setGaleriLoading(true);
    try {
      const data = await galeriService.getAll();
      setGaleriData(data.data || []);
      setGaleriError(null);
    } catch (err) {
      setGaleriError('Gagal memuat data galeri');
      setGaleriData([]);
    }
    setGaleriLoading(false);
  };

  const loadFasilitas = async () => {
    setFasilitasLoading(true);
    try {
      const data = await fasilitasService.getAll();
      setFasilitasData(Array.isArray(data.data) ? data.data : (data.data || []));
    } catch (err) {
      setFasilitasData([]);
    }
    setFasilitasLoading(false);
  };

  useEffect(() => {
    if (isLoggedIn) {
      loadData();
      if (activeMenu === 'galeri') loadGaleri();
      if (activeMenu === 'fasilitas') loadFasilitas();
    }
  }, [activeMenu, isLoggedIn]);

  useEffect(() => {
    if (activeMenu === 'tentang') {
      setTentangEdit({ deskripsi: tentangData.deskripsi || '' });
      setTentangMsg('');
    }
  }, [activeMenu, tentangData]);

  useEffect(() => {
    localStorage.setItem('activeMenu', activeMenu);
  }, [activeMenu]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/');
  };

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8v-10h-8v10zm0-18v6h8V3h-8z"/></svg>
      ) },
    { id: 'bestof', name: 'Fasilitas', icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
      ) },
    { id: 'fasilitas', name: 'Destinasi', icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 8h8v8H8z"/></svg>
      ) },
    { id: 'tentang', name: 'Tentang', icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
      ) },
    { id: 'galeri', name: 'Galeri', icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
      ) },
    { id: 'review', name: 'Ulasan', icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
      ) },
    { id: 'artikel', name: 'Artikel', icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/></svg>
      ) },
    { id: 'data_dayeuh', name: 'Chatbot', icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
      )
       },
    { id: 'profile', name: 'Profile', icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-7 8-7s8 3 8 7"/></svg>
      ) },
  ];

  // Best Of handlers
  const openAddBestOf = () => {
    setEditBestOf(null);
    setFormBestOf({ judul: '', kategori: '', lokasi: '', deskripsi: '', jam_operasional: '', biaya: '', gambar: '' });
    setFileGambar(null);
    setPreviewGambar('');
    setShowBestOfModal(true);
  };

  const openEditBestOf = (item) => {
    setEditBestOf(item);
    setFormBestOf({
      judul: item.judul || '',
      kategori: item.kategori || '',
      lokasi: item.lokasi || '',
      deskripsi: item.deskripsi || '',
      jam_operasional: item.jam_operasional || '',
      biaya: item.biaya || '',
      gambar: item.gambar || '',
    });
    setPreviewGambar(item.gambar ? `/images/${item.gambar}` : '');
    setFileGambar(null);
    setShowBestOfModal(true);
  };

  const handleDeleteBestOf = async (id) => {
    if (!window.confirm('Yakin ingin menghapus?')) return;
    setLoading(true);
    try {
      await bestOfService.delete(id);
      loadData();
      setNotifDestinasi('Destinasi berhasil dihapus!');
      setNotifDestinasiType('success');
      setTimeout(() => setNotifDestinasi(''), 2500);
    } catch (err) {
      alert('Gagal menghapus data');
    }
    setLoading(false);
  };

  const handleSaveBestOf = async (e) => {
    e.preventDefault();
    let formData = null;
    let isEdit = !!editBestOf;
    try {
      setLoading(true);
      if (fileGambar) {
        formData = new FormData();
        formData.append('judul', formBestOf.judul);
        formData.append('kategori', formBestOf.kategori);
        formData.append('lokasi', formBestOf.lokasi);
        formData.append('deskripsi', formBestOf.deskripsi);
        formData.append('jam_operasional', formBestOf.jam_operasional);
        formData.append('biaya', formBestOf.biaya);
        formData.append('gambar', fileGambar);
      }
      if (isEdit) {
        if (formData) {
          await bestOfService.update(editBestOf.id, formData, true);
        } else {
          await bestOfService.update(editBestOf.id, {
            judul: formBestOf.judul,
            kategori: formBestOf.kategori,
            lokasi: formBestOf.lokasi,
            deskripsi: formBestOf.deskripsi,
            jam_operasional: formBestOf.jam_operasional,
            biaya: formBestOf.biaya,
            gambar: formBestOf.gambar
          });
        }
        setNotifDestinasi('Destinasi berhasil diupdate!');
        setNotifDestinasiType('success');
      } else {
        if (formData) {
          await bestOfService.create(formData, true);
        } else {
          await bestOfService.create({
            judul: formBestOf.judul,
            kategori: formBestOf.kategori,
            lokasi: formBestOf.lokasi,
            deskripsi: formBestOf.deskripsi,
            jam_operasional: formBestOf.jam_operasional,
            biaya: formBestOf.biaya,
            gambar: formBestOf.gambar
          });
        }
        setNotifDestinasi('Destinasi berhasil ditambahkan!');
        setNotifDestinasiType('success');
      }
      setShowBestOfModal(false);
      setEditBestOf(null);
      setFormBestOf({ judul: '', kategori: '', lokasi: '', deskripsi: '', jam_operasional: '', biaya: '', gambar: '' });
      setFileGambar(null);
      setPreviewGambar('');
      loadData();
      setTimeout(() => setNotifDestinasi(''), 2500);
    } catch (err) {
      alert('Gagal menyimpan data!');
    }
    setLoading(false);
  };

  // Galeri handlers
  const handleUploadGaleri = async (e) => {
    e.preventDefault();
    if (!fileFoto) return alert('Pilih file gambar terlebih dahulu!');
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file_foto', fileFoto);
      await galeriService.create(formData, true);
      setFileFoto(null);
      loadGaleri();
      setNotifGaleri('Foto galeri berhasil ditambahkan!');
      setTimeout(() => setNotifGaleri(''), 2500);
    } catch (err) {
      alert('Gagal upload foto!');
    }
    setUploading(false);
  };

  const handleDeleteGaleri = async (id) => {
    if (!window.confirm('Yakin ingin menghapus foto ini?')) return;
    setGaleriLoading(true);
    try {
      await galeriService.delete(id);
      loadGaleri();
      setNotifGaleri('Foto galeri berhasil dihapus!');
      setTimeout(() => setNotifGaleri(''), 2500);
    } catch (err) {
      alert('Gagal menghapus foto!');
    }
    setGaleriLoading(false);
  };

  const handleEditGaleriClick = (item) => {
    setEditGaleriItem(item);
    setEditFileFoto(null);
    setEditPreviewFoto(item.file_foto ? `/images/${item.file_foto}` : '');
    setShowEditGaleriModal(true);
  };

  const handleEditGaleriSubmit = async (e) => {
    e.preventDefault();
    if (!editGaleriItem) return;
    setEditUploading(true);
    try {
      let formData = null;
      if (editFileFoto) {
        formData = new FormData();
        formData.append('file_foto', editFileFoto);
        await galeriService.update(editGaleriItem.id, formData, true);
      }
      setShowEditGaleriModal(false);
      setEditGaleriItem(null);
      setEditFileFoto(null);
      setEditPreviewFoto('');
      loadGaleri();
      setNotifGaleri('Foto galeri berhasil diupdate!');
      setTimeout(() => setNotifGaleri(''), 2500);
    } catch (err) {
      alert('Gagal update foto!');
    }
    setEditUploading(false);
  };

  // Tentang handlers
  const handleSimpanTentang = async (e) => {
    e.preventDefault();
    setTentangLoading(true);
    setTentangMsg('');
    try {
      let gambarFileName = tentangEdit.gambar;
      let resUpdate;
      if (tentangFile) {
        // Upload gambar saja
        const formData = new FormData();
        formData.append('gambar', tentangFile);
        const resUpload = await tentangService.upload(formData);
        if (resUpload && resUpload.success) {
          gambarFileName = resUpload.gambar;
        } else {
          setTentangMsg('Gagal upload gambar!');
          setTentangLoading(false);
          return { success: false, error: 'Gagal upload gambar' };
        }
      }
      // Simpan data lengkap
      resUpdate = await tentangService.update({
        ...tentangEdit,
        gambar: gambarFileName
      });
      
      if (resUpdate.success) {
        setTentangMsg('Berhasil disimpan!');
        loadData(); // Reload data
        setNotifTentang('Data tentang berhasil disimpan!');
        setTimeout(() => setNotifTentang(''), 2500);
        // Kosongkan file input setelah berhasil
        setTentangFile(null);
        setTentangPreview('');
      } else {
        setTentangMsg(resUpdate.error || 'Gagal menyimpan data!');
      }
      setTentangLoading(false);
      return resUpdate; // Return response ke komponen Tentang
    } catch (err) {
      setTentangMsg('Gagal menyimpan data!');
      setTentangLoading(false);
      return { success: false, error: 'Terjadi kesalahan koneksi' };
    }
  };

  // Review handlers
  const openDetailModal = (review) => {
    setDetailReview(review);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setDetailReview(null);
  };

  const handleSetujuiReview = async (id) => {
    setLoadingAction(id);
    try {
      await reviewService.update(id, { status: 'disetujui' });
      setNotif('Review berhasil disetujui!');
      setNotifType('success');
      loadData();
      setNotifReview('Review berhasil disetujui!');
      setTimeout(() => setNotifReview(''), 2500);
    } catch {
      setNotif('Gagal konfirmasi review!');
      setNotifType('error');
    }
    setLoadingAction(null);
  };

  const handleTolakReview = async (id) => {
    setLoadingAction(id);
    try {
      await reviewService.update(id, { status: 'ditolak' });
      setNotif('Review berhasil ditolak!');
      setNotifType('success');
      loadData();
      setNotifReview('Review berhasil ditolak!');
      setTimeout(() => setNotifReview(''), 2500);
    } catch {
      setNotif('Gagal menolak review!');
      setNotifType('error');
    }
    setLoadingAction(null);
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm('Yakin ingin menghapus review ini?')) return;
    setLoadingAction(id);
    try {
      await reviewService.delete(id);
      setNotif('Review berhasil dihapus!');
      setNotifType('success');
      loadData();
      setNotifReview('Review berhasil dihapus!');
      setTimeout(() => setNotifReview(''), 2500);
    } catch {
      setNotif('Gagal menghapus review!');
      setNotifType('error');
    }
    setLoadingAction(null);
  };

  // Artikel handlers
  const openAddArtikel = () => {
    setEditArtikel(null);
    setFormArtikel({ judul: '', konten: '', gambar: '', penulis: '', kategori: '', tags: '' });
    setFileGambar(null);
    setPreviewGambar('');
    setShowArtikelModal(true);
  };

  const openEditArtikel = (item) => {
    setEditArtikel(item);
    setFormArtikel({
      judul: item.judul,
      konten: item.konten || item.isi,
      gambar: item.gambar,
      penulis: item.penulis || '',
      kategori: item.kategori || '',
      tags: item.tags || ''
    });
    setFileGambar(null);
    setPreviewGambar(item.gambar ? (item.gambar.startsWith('http') ? item.gambar : `/${item.gambar}`) : '');
    setShowArtikelModal(true);
  };

  const handleSaveArtikel = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let isFormData = false;
      let data;
      if (fileGambar) {
        isFormData = true;
        data = new FormData();
        data.append('judul', formArtikel.judul);
        data.append('isi', formArtikel.konten);
        data.append('gambar', fileGambar);
        data.append('penulis', formArtikel.penulis);
        data.append('kategori', formArtikel.kategori);
        data.append('tags', formArtikel.tags);
      } else {
        data = {
          judul: formArtikel.judul,
          isi: formArtikel.konten,
          gambar: formArtikel.gambar,
          penulis: formArtikel.penulis,
          kategori: formArtikel.kategori,
          tags: formArtikel.tags
        };
      }
      if (editArtikel) {
        await artikelService.update(editArtikel.id, data, isFormData);
        setNotifArtikel('Artikel berhasil diupdate!');
        setNotifArtikelType('success');
      } else {
        await artikelService.create(data, isFormData);
        setNotifArtikel('Artikel berhasil ditambahkan!');
        setNotifArtikelType('success');
      }
      setShowArtikelModal(false);
      setEditArtikel(null);
      setFormArtikel({ judul: '', konten: '', gambar: '', penulis: '', kategori: '', tags: '' });
      setFileGambar(null);
      setPreviewGambar('');
      loadData();
      setTimeout(() => setNotifArtikel(''), 2500);
    } catch (err) {
      alert('Gagal menyimpan artikel!');
    }
    setLoading(false);
  };

  const handleDeleteArtikel = async (id) => {
    if (!window.confirm('Yakin ingin menghapus artikel ini?')) return;
    setLoading(true);
    try {
      await artikelService.delete(id);
      loadData();
      setNotifArtikel('Artikel berhasil dihapus!');
      setNotifArtikelType('success');
      setTimeout(() => setNotifArtikel(''), 2500);
    } catch (err) {
      alert('Gagal menghapus artikel!');
    }
    setLoading(false);
  };

  const handleAddFasilitas = async (form, closeModal) => {
    try {
      let formData = new FormData();
      formData.append('nama', form.nama);
      formData.append('deskripsi', form.deskripsi);
      formData.append('status_aktif', form.status_aktif);
      if (form.gambar) formData.append('gambar', form.gambar);
      await fasilitasService.create(formData, true);
      loadFasilitas();
      if (closeModal) closeModal(false);
      setNotifFasilitas('Fasilitas berhasil ditambahkan!');
      setNotifFasilitasType('success');
      setTimeout(() => setNotifFasilitas(''), 2500);
    } catch (err) {
      alert('Gagal menambah fasilitas!');
    }
  };

  const handleEditFasilitas = async (id, form, closeModal) => {
    try {
      let formData = new FormData();
      formData.append('nama', form.nama);
      formData.append('deskripsi', form.deskripsi);
      formData.append('status_aktif', form.status_aktif);
      if (form.gambar) formData.append('gambar', form.gambar);
      await fasilitasService.update(id, formData, true);
      loadFasilitas();
      if (closeModal) closeModal(false);
      setNotifFasilitas('Fasilitas berhasil diupdate!');
      setNotifFasilitasType('success');
      setTimeout(() => setNotifFasilitas(''), 2500);
    } catch (err) {
      alert('Gagal mengedit fasilitas!');
    }
  };

  const handleDeleteFasilitas = async (id) => {
    try {
      await fasilitasService.delete(id);
      loadFasilitas();
      setNotifFasilitas('Fasilitas berhasil dihapus!');
      setNotifFasilitasType('success');
      setTimeout(() => setNotifFasilitas(''), 2500);
    } catch (err) {
      alert('Gagal menghapus fasilitas!');
    }
  };

  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard':
        return <Dashboard stats={stats} loading={loading} />;
      case 'profile':
        return <Profile />;

      case 'bestof':
        return (
          <BestOf
            bestOfData={bestOfData}
            loading={loading}
            onAdd={openAddBestOf}
            onEdit={openEditBestOf}
            onDelete={handleDeleteBestOf}
            showModal={showBestOfModal}
            setShowModal={setShowBestOfModal}
            editItem={editBestOf}
            formData={formBestOf}
            setFormData={setFormBestOf}
            fileGambar={fileGambar}
            setFileGambar={setFileGambar}
            previewGambar={previewGambar}
            setPreviewGambar={setPreviewGambar}
            onSave={handleSaveBestOf}
          />
        );

      case 'tentang':
        return (
          <Tentang
            tentangData={tentangData}
            tentangEdit={tentangEdit}
            setTentangEdit={setTentangEdit}
            tentangLoading={tentangLoading}
            tentangMsg={tentangMsg}
            tentangFile={tentangFile}
            setTentangFile={setTentangFile}
            tentangPreview={tentangPreview}
            setTentangPreview={setTentangPreview}
            onSave={handleSimpanTentang}
            reloadData={loadData}
            setNotifTentang={setNotifTentang}
          />
        );

      case 'galeri':
        return (
          <Galeri
            galeriData={galeriData}
            galeriLoading={galeriLoading}
            galeriError={galeriError}
            fileFoto={fileFoto}
            setFileFoto={setFileFoto}
            uploading={uploading}
            onUpload={handleUploadGaleri}
            onDelete={handleDeleteGaleri}
            onEditClick={handleEditGaleriClick}
            showEditModal={showEditGaleriModal}
            setShowEditModal={setShowEditGaleriModal}
            editItem={editGaleriItem}
            editFileFoto={editFileFoto}
            setEditFileFoto={setEditFileFoto}
            editUploading={editUploading}
            editPreviewFoto={editPreviewFoto}
            setEditPreviewFoto={setEditPreviewFoto}
            onEditSubmit={handleEditGaleriSubmit}
          />
        );

      case 'review':
        return (
          <Review
            reviewData={reviewData}
            loading={loading}
            notif={notif}
            notifType={notifType}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            loadingAction={loadingAction}
            onSetujui={handleSetujuiReview}
            onTolak={handleTolakReview}
            onDelete={handleDeleteReview}
            onDetailClick={openDetailModal}
            showDetailModal={showDetailModal}
            detailReview={detailReview}
            onCloseDetail={closeDetailModal}
          />
        );

      case 'artikel':
        return (
          <>
            <Artikel
              artikelData={artikelData}
              loading={loading}
              onAdd={openAddArtikel}
              onEdit={openEditArtikel}
              onDelete={handleDeleteArtikel}
            />
                        {/* Modal Tambah/Edit Artikel */}
            {showArtikelModal && ReactDOM.createPortal(
              <>
                {/* Blur background overlay */}
                <div className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-sm"></div>
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                  <form onSubmit={handleSaveArtikel} className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-green-200">
                    {/* Header */}
                    <div className="sticky top-0 bg-white px-6 py-4 border-b border-green-200 rounded-t-xl">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold text-green-800 font-raleway">
                          {editArtikel ? 'Edit Artikel' : 'Tambah Artikel Baru'}
                        </h3>
                        <button
                          type="button"
                          className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                          onClick={() => { setShowArtikelModal(false); setFileGambar(null); setPreviewGambar(''); }}
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
                            <label className="block mb-2 text-sm font-medium text-green-700">Judul Artikel</label>
                            <input 
                              type="text" 
                              className="w-full border border-green-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300 bg-green-50" 
                              value={formArtikel.judul} 
                              onChange={e => setFormArtikel(f => ({ ...f, judul: e.target.value }))} 
                              required 
                              placeholder="Masukkan judul artikel"
                            />
                          </div>
                          <div>
                            <label className="block mb-2 text-sm font-medium text-green-700">Penulis</label>
                            <input
                              type="text"
                              className="w-full border border-green-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300 bg-green-50"
                              value={formArtikel.penulis}
                              onChange={e => setFormArtikel(f => ({ ...f, penulis: e.target.value }))}
                              placeholder="Nama penulis"
                            />
                          </div>
                          <div>
                            <label className="block mb-2 text-sm font-medium text-green-700">Kategori</label>
                            <input
                              type="text"
                              className="w-full border border-green-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300 bg-green-50"
                              value={formArtikel.kategori}
                              onChange={e => setFormArtikel(f => ({ ...f, kategori: e.target.value }))}
                              placeholder="Kategori artikel (misal: Wisata, Tips, dll)"
                            />
                          </div>
                          <div>
                            <label className="block mb-2 text-sm font-medium text-green-700">Tags</label>
                            <input
                              type="text"
                              className="w-full border border-green-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300 bg-green-50"
                              value={formArtikel.tags}
                              onChange={e => setFormArtikel(f => ({ ...f, tags: e.target.value }))}
                              placeholder="Pisahkan dengan koma, contoh: alam,gunung,liburan"
                            />
                          </div>
                          
                          <div>
                            <label className="block mb-2 text-sm font-medium text-green-700">Konten Artikel</label>
                            <textarea 
                              className="w-full border border-green-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300 bg-green-50 resize-none" 
                              rows={8} 
                              value={formArtikel.konten} 
                              onChange={e => setFormArtikel(f => ({ ...f, konten: e.target.value }))} 
                              required 
                              placeholder="Tulis konten artikel di sini..."
                            />
                          </div>
                          
                          <div>
                            <label className="block mb-2 text-sm font-medium text-green-700">Gambar Artikel</label>
                            <input 
                              type="file" 
                              accept="image/*" 
                              className="w-full border border-green-200 rounded-lg px-3 py-2 bg-green-50 file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-green-100 file:text-green-700 hover:file:bg-green-200" 
                              onChange={e => {
                                const file = e.target.files[0];
                                setFileGambar(file);
                                setPreviewGambar(file ? URL.createObjectURL(file) : '');
                              }} 
                            />
                            
                            {/* URL Input sebagai alternatif */}
                            <div className="mt-3">
                              <label className="block mb-2 text-sm font-medium text-green-700">Atau masukkan URL gambar</label>
                              <input 
                                type="text" 
                                className="w-full border border-green-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300 bg-green-50" 
                                placeholder="https://example.com/image.jpg" 
                                value={formArtikel.gambar} 
                                onChange={e => setFormArtikel(f => ({ ...f, gambar: e.target.value }))} 
                                disabled={!!fileGambar} 
                              />
                            </div>
                          </div>
                        </div>

                        {/* Preview Section */}
                        <div className="space-y-4">
                          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                            <h4 className="text-sm font-medium text-green-700 mb-3">Preview Gambar</h4>
                            <div className="aspect-video bg-green-100 rounded-lg border-2 border-green-200 flex items-center justify-center overflow-hidden">
                              {previewGambar ? (
                                <img src={previewGambar} alt="Preview" className="object-cover w-full h-full" />
                              ) : formArtikel.gambar ? (
                                <img src={formArtikel.gambar} alt="Preview" className="object-cover w-full h-full" onError={e => e.target.style.display = 'none'} />
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

                          {/* Article Preview */}
                          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                            <h4 className="text-sm font-medium text-green-700 mb-3">Preview Artikel</h4>
                            <div className="bg-white rounded-lg p-3 border border-green-200">
                              <h5 className="font-semibold text-green-800 mb-2 line-clamp-2">
                                {formArtikel.judul || 'Judul Artikel'}
                              </h5>
                              <p className="text-sm text-gray-600 line-clamp-4">
                                {formArtikel.konten || 'Konten artikel akan muncul di sini...'}
                              </p>
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
                          onClick={() => { setShowArtikelModal(false); setFileGambar(null); setPreviewGambar(''); }}
                        >
                          Batal
                        </button>
                        <button 
                          type="submit" 
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors"
                        >
                          {editArtikel ? 'Update' : 'Simpan'}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </>
            , document.body)}
          </>
        );

      case 'fasilitas':
        return <Fasilitas fasilitasData={fasilitasData} loading={fasilitasLoading} onAdd={handleAddFasilitas} onEdit={handleEditFasilitas} onDelete={handleDeleteFasilitas} />;

      case 'data_dayeuh':
        return <DayeuhData />;

      default:
        return null;
    }
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-green-50 to-green-200 flex flex-col md:flex-row" style={{backgroundImage: 'url(/images/bg-tentang2.jpg)', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center'}}>
      {/* Sidebar */}
      <aside className={`fixed md:static top-0 left-0 h-full z-30 bg-gradient-to-b from-green-700 via-green-600 to-green-400 bg-opacity-90 shadow-lg flex flex-col min-h-screen border-r transition-transform duration-300 md:w-64 w-64 md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`} style={{ position: 'fixed', top: 0, left: 0, height: '100vh' }}>
        {/* Logo & Close Button */}
        <div className="flex items-center gap-2 px-8 py-6 justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-green-200 rounded-full p-2 shadow">
              {/* Icon daun */}
              <svg className="w-8 h-8 text-green-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2C7 2 2 7 2 12c0 5 5 10 10 10s10-5 10-10c0-5-5-10-10-10zm0 18c-4.41 0-8-3.59-8-8 0-1.85.63-3.55 1.69-4.9C7.1 8.36 9.42 10 12 10s4.9-1.64 6.31-2.9A7.963 7.963 0 0120 12c0 4.41-3.59 8-8 8z"/></svg>
            </div>
            <span className="text-xl font-bold text-green-900 font-raleway tracking-wide">Admin Alam</span>
          </div>
          <button className="md:hidden p-2" onClick={()=>setSidebarOpen(false)}>
            <svg className="w-6 h-6 text-green-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        {/* Menu */}
        <nav className="flex-1 mt-4 overflow-y-auto">
          <ul>
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => { setActiveMenu(item.id); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-8 py-3 text-left transition-colors rounded-l-full font-raleway tracking-wide ${activeMenu === item.id ? 'bg-green-200 text-green-900 font-bold shadow' : 'text-green-100 hover:bg-green-600 hover:text-white'}`}
                >
                  <span className="text-green-300 group-hover:text-green-100">{item.icon}</span>
                  <span>{item.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      {/* Overlay mobile */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/30 z-30 md:hidden" onClick={()=>setSidebarOpen(false)}></div>}
      {/* Header di luar konten utama, benar-benar fixed */}
      <header className="bg-gradient-to-r from-green-700 via-green-500 to-green-300 flex items-center justify-between px-4 sm:px-8 py-4 border-b shadow-md fixed top-0 left-0 right-0 z-40" style={{height:'4.5rem'}}>
          <div className="flex items-center gap-2">
            <button className="md:hidden p-2 mr-2" onClick={()=>setSidebarOpen(true)}>
              <svg className="w-7 h-7 text-green-100" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
            </button>
            <h1 className="text-lg sm:text-2xl font-bold text-white font-raleway tracking-wide drop-shadow">{menuItems.find(m => m.id === activeMenu)?.name || 'Admin Panel'}</h1>
          </div>
          <div className="flex items-center gap-4">
            {/* Setting icon */}
            <button className="bg-green-100 p-2 rounded-full" onClick={handleAccountOpen}>
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33h.09A1.65 1.65 0 008.91 3H9a2 2 0 014 0v.09a1.65 1.65 0 001 1.51h.09a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82v.09a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
            </button>
            {/* Notification icon with badge */}
            <div className="relative">
              <button className="bg-green-100 p-2 rounded-full relative" onClick={() => setShowNotifModal(true)}>
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 7.165 6 9.388 6 12v2.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                {pendingReviewCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 font-bold animate-pulse">{pendingReviewCount}</span>
                )}
              </button>
            </div>
          </div>
        </header>
        {/* Modal Notifikasi Review Pending */}
        {showNotifModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
              <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={() => setShowNotifModal(false)}>
                ✖️
              </button>
              <h3 className="text-lg font-semibold mb-4">Review Menunggu Validasi</h3>
              {pendingReviewCount === 0 ? (
                <div className="text-gray-500">Tidak ada review yang perlu divalidasi.</div>
              ) : (
                <ul className="divide-y divide-gray-200 max-h-60 overflow-y-auto">
                  {reviewData.filter(r => r.status === 'pending').map((review) => (
                    <li key={review.id} className="py-2 flex flex-col gap-1">
                      <span className="font-semibold">{review.nama}</span>
                      <span className="text-sm text-gray-600">{review.email}</span>
                      <span className="text-xs text-gray-400">{review.created_at ? new Date(review.created_at).toLocaleString('id-ID') : '-'}</span>
                      <span className="text-sm">"{review.review.slice(0, 40)}{review.review.length > 40 ? '...' : ''}"</span>
                      <button className="text-blue-600 underline text-xs self-start mt-1" onClick={() => { setActiveMenu('review'); setShowNotifModal(false); }}>
                        Lihat Detail
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      {/* Modal Edit Akun */}
      {showAccountModal && ReactDOM.createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={handleAccountClose}>✖️</button>
            <h3 className="text-lg font-semibold mb-4">Edit Akun Admin</h3>
            <form onSubmit={handleAccountSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Username</label>
                <input name="username" value={accountForm.username} onChange={handleAccountChange} className="w-full border rounded px-3 py-2" required />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
                <input name="email" type="email" value={accountForm.email} onChange={handleAccountChange} className="w-full border rounded px-3 py-2" required />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Password Lama</label>
                <input name="old_password" type="password" value={accountForm.old_password} onChange={handleAccountChange} className="w-full border rounded px-3 py-2" placeholder="Masukkan password lama" />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Password Baru</label>
                <input name="password" type="password" value={accountForm.password} onChange={handleAccountChange} className="w-full border rounded px-3 py-2" placeholder="Kosongkan jika tidak ingin mengubah" />
              </div>
              {accountMsg && <div className={accountMsg.includes('Berhasil') ? 'text-green-600' : 'text-red-600'}>{accountMsg}</div>}
              <div className="flex gap-2 justify-end mt-4">
                <button type="button" onClick={handleAccountClose} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded">Batal</button>
                <button type="submit" disabled={accountLoading} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">{accountLoading ? 'Menyimpan...' : 'Simpan'}</button>
              </div>
            </form>
          </div>
        </div>, document.body
      )}
      {/* Main Content wrapper, padding-left untuk sidebar, padding-top untuk header */}
      <div className="flex-1 flex flex-col min-h-screen pl-0 md:pl-64 transition-all duration-300" style={{backdropFilter:'blur(0.5px)'}}>
         <main className="flex-1 p-8 bg-green-50 bg-opacity-80 pt-20 min-h-screen">
          {renderContent()}
        </main>
      </div>
      {notifArtikel && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] px-6 py-4 rounded-xl shadow-lg bg-gradient-to-r from-green-200 via-green-100 to-green-50 border border-green-400 text-green-900 font-semibold flex items-center gap-3 animate-fade-in">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          <span>{notifArtikel}</span>
        </div>
      )}
      {notifFasilitas && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] px-6 py-4 rounded-xl shadow-lg bg-gradient-to-r from-green-200 via-green-100 to-green-50 border border-green-400 text-green-900 font-semibold flex items-center gap-3 animate-fade-in">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          <span>{notifFasilitas}</span>
        </div>
      )}
      {notifDestinasi && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] px-6 py-4 rounded-xl shadow-lg bg-gradient-to-r from-green-200 via-green-100 to-green-50 border border-green-400 text-green-900 font-semibold flex items-center gap-3 animate-fade-in">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          <span>{notifDestinasi}</span>
        </div>
      )}
      {notifGaleri && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] px-6 py-4 rounded-xl shadow-lg bg-gradient-to-r from-green-200 via-green-100 to-green-50 border border-green-400 text-green-900 font-semibold flex items-center gap-3 animate-fade-in">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          <span>{notifGaleri}</span>
        </div>
      )}
      {notifTentang && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] px-6 py-4 rounded-xl shadow-lg bg-gradient-to-r from-green-200 via-green-100 to-green-50 border border-green-400 text-green-900 font-semibold flex items-center gap-3 animate-fade-in">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          <span>{notifTentang}</span>
        </div>
      )}
      {notifReview && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] px-6 py-4 rounded-xl shadow-lg bg-gradient-to-r from-green-200 via-green-100 to-green-50 border border-green-400 text-green-900 font-semibold flex items-center gap-3 animate-fade-in">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          <span>{notifReview}</span>
        </div>
      )}
      {notifProfile && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] px-6 py-4 rounded-xl shadow-lg bg-gradient-to-r from-green-200 via-green-100 to-green-50 border border-green-400 text-green-900 font-semibold flex items-center gap-3 animate-fade-in">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          <span>{notifProfile}</span>
        </div>
      )}
    </div>
  );
};

export default Admin; 