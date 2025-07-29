const express = require('express');
const router = express.Router();
const db = require('./config/database');

// GET semua data
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM data_dayeuh ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST tambah data
router.post('/', async (req, res) => {
  const { judul, deskripsi, kategori } = req.body;
  try {
    const [result] = await db.query('INSERT INTO data_dayeuh (judul, deskripsi, kategori) VALUES (?, ?, ?)', [judul, deskripsi, kategori]);
    res.json({ success: true, id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT edit data
router.put('/:id', async (req, res) => {
  const { judul, deskripsi, kategori } = req.body;
  try {
    await db.query('UPDATE data_dayeuh SET judul=?, deskripsi=?, kategori=? WHERE id=?', [judul, deskripsi, kategori, req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE data
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM data_dayeuh WHERE id=?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 