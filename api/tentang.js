// tentang.js
const express = require('express');
const router = express.Router();
const pool = require('./config/database');
const multer = require('multer');
const path = require('path');

// Hapus CORS di sini, cukup di app.js

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/images'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '_' + file.originalname);
  },
});
const upload = multer({ storage });

// GET data tentang (asumsi id=1)
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM tentang LIMIT 1');
    if (rows.length > 0) {
      res.json({ success: true, data: rows[0] });
    } else {
      res.json({
        success: true,
        data: {
          judul: 'Tentang Dayeuhmanggung',
          deskripsi: '',
          sejarah: '',
          visi_misi: '',
          tujuan_web: '',
          tim: '',
          kontak: '',
          gambar: '',
          tautan: ''
        }
      });
    }
  } catch (e) {
    res.status(500).json({ success: false, error: 'Server error: ' + e.message });
  }
});

// PUT (update semua field tentang, JSON)
router.put('/', async (req, res) => {
  try {
    const { judul, deskripsi, sejarah, visi_misi, tujuan_web, tim, kontak, gambar, tautan } = req.body;
    if (!judul) return res.status(400).json({ success: false, error: 'Judul diperlukan' });
    
    // Cek apakah ada data di tabel
    const [rows] = await pool.query('SELECT id FROM tentang LIMIT 1');

    if (rows.length > 0) {
      const existingId = rows[0].id; // Ambil ID yang ada
      // Update record yang ada
      await pool.query(
        'UPDATE tentang SET judul=?, deskripsi=?, sejarah=?, visi_misi=?, tujuan_web=?, tim=?, kontak=?, gambar=?, tautan=?, updated_at=NOW() WHERE id=?',
        [judul, deskripsi, sejarah, visi_misi, tujuan_web, tim, kontak, gambar, tautan, existingId]
      );
      res.json({ success: true, message: 'Data tentang berhasil diperbarui' });
    } else {
      // Insert record baru jika tabel kosong
      await pool.query(
        'INSERT INTO tentang (judul, deskripsi, sejarah, visi_misi, tujuan_web, tim, kontak, gambar, tautan, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())',
        [judul, deskripsi, sejarah, visi_misi, tujuan_web, tim, kontak, gambar, tautan]
      );
      res.json({ success: true, message: 'Data tentang berhasil ditambahkan' });
    }
  } catch (e) {
    res.status(500).json({ success: false, error: 'Server error: ' + e.message });
  }
});

// POST (upload/update gambar saja, multipart)
router.post('/gambar', upload.single('gambar'), async (req, res) => {
  try {
    let gambar = null;
    if (req.file) {
      gambar = req.file.filename;
      await pool.query('UPDATE tentang SET gambar = ?, updated_at = NOW() WHERE id = 1', [gambar]);
      res.json({ success: true, message: 'Gambar tentang berhasil diupload', gambar });
    } else {
      res.status(400).json({ success: false, error: 'File gambar diperlukan' });
    }
  } catch (e) {
    res.status(500).json({ success: false, error: 'Server error: ' + e.message });
  }
});

module.exports = router; 