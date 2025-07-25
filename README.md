# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Website Perkebunan Dayeuhmanggung

Website resmi Perkebunan Dayeuhmanggung yang menampilkan informasi tentang perkebunan, produk unggulan, galeri foto, dan sistem review customer.

## Fitur

- **Landing Page**: Hero section dengan informasi utama perkebunan
- **Best Of**: Menampilkan produk-produk unggulan perkebunan
- **Tentang**: Informasi detail tentang perkebunan, visi, dan misi
- **Galeri**: Koleksi foto-foto perkebunan
- **Review**: Sistem review dan rating dari customer
- **Artikel**: Artikel-artikel terkait perkebunan
- **Admin Panel**: Panel admin untuk mengelola konten website

## Teknologi yang Digunakan

### Frontend
- React.js
- Vite
- Tailwind CSS
- Framer Motion (untuk animasi)

### Backend
- PHP
- MySQL
- Apache (XAMPP)

## Setup dan Instalasi

### Prerequisites
- Node.js (versi 16 atau lebih baru)
- XAMPP (Apache + MySQL)
- Git

### Langkah-langkah Setup

1. **Clone Repository**
   ```bash
   git clone <repository-url>
   cd dayeuhmanggung-site
   ```

2. **Install Dependencies Frontend**
   ```bash
   npm install
   ```

3. **Setup Database**
   - Start XAMPP (Apache dan MySQL)
   - Buka phpMyAdmin di browser: `http://localhost/phpmyadmin`
   - Buat database baru dengan nama `dayeuhmanggung_db`
   - Import file `database_setup.sql` ke database tersebut

4. **Konfigurasi Database**
   - Edit file `api/config/database.php`
   - Sesuaikan konfigurasi database jika diperlukan:
     ```php
     $host = 'localhost';
     $dbname = 'dayeuhmanggung_db';
     $username = 'root';
     $password = '';
     ```

5. **Jalankan Aplikasi**
   ```bash
   npm run dev
   ```
   - Frontend akan berjalan di: `http://localhost:5173`
   - Pastikan XAMPP Apache berjalan untuk API backend

### Struktur Database

#### Tabel `best_of`
- `id` (INT, AUTO_INCREMENT, PRIMARY KEY)
- `judul` (VARCHAR(255))
- `deskripsi` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### Tabel `tentang`
- `id` (INT, AUTO_INCREMENT, PRIMARY KEY)
- `deskripsi_perkebunan` (TEXT)
- `visi_misi` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### Tabel `review`
- `id` (INT, AUTO_INCREMENT, PRIMARY KEY)
- `nama` (VARCHAR(100))
- `rating` (INT, 1-5)
- `komentar` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### Tabel `artikel`
- `id` (INT, AUTO_INCREMENT, PRIMARY KEY)
- `judul` (VARCHAR(255))
- `isi` (TEXT)
- `gambar` (VARCHAR(255))
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### Tabel `galeri`
- `id` (INT, AUTO_INCREMENT, PRIMARY KEY)
- `judul` (VARCHAR(255))
- `gambar` (VARCHAR(255))
- `deskripsi` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### Tabel `admin`
- `id` (INT, AUTO_INCREMENT, PRIMARY KEY)
- `username` (VARCHAR(50), UNIQUE)
- `password` (VARCHAR(255))
- `nama_lengkap` (VARCHAR(100))
- `email` (VARCHAR(100))
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## API Endpoints

### Best Of
- `GET /api/bestof.php` - Ambil semua data best of
- `GET /api/bestof.php?id={id}` - Ambil data best of berdasarkan ID
- `POST /api/bestof.php` - Tambah data best of baru
- `PUT /api/bestof.php?id={id}` - Update data best of
- `DELETE /api/bestof.php?id={id}` - Hapus data best of

### Tentang
- `GET /api/tentang.php` - Ambil data halaman tentang
- `PUT /api/tentang.php` - Update data halaman tentang

### Review
- `GET /api/review.php` - Ambil semua review
- `GET /api/review.php?id={id}` - Ambil review berdasarkan ID
- `POST /api/review.php` - Tambah review baru
- `PUT /api/review.php?id={id}` - Update review
- `DELETE /api/review.php?id={id}` - Hapus review

### Artikel
- `GET /api/artikel.php` - Ambil semua artikel
- `GET /api/artikel.php?id={id}` - Ambil artikel berdasarkan ID
- `POST /api/artikel.php` - Tambah artikel baru
- `PUT /api/artikel.php?id={id}` - Update artikel
- `DELETE /api/artikel.php?id={id}` - Hapus artikel

### Galeri
- `GET /api/galeri.php` - Ambil semua data galeri
- `GET /api/galeri.php?id={id}` - Ambil data galeri berdasarkan ID
- `POST /api/galeri.php` - Tambah data galeri baru
- `PUT /api/galeri.php?id={id}` - Update data galeri
- `DELETE /api/galeri.php?id={id}` - Hapus data galeri

### Dashboard
- `GET /api/dashboard.php` - Ambil statistik dashboard

## Admin Panel

### Login Admin
- Username: `admin`
- Password: `admin123`

### Fitur Admin Panel
- Dashboard dengan statistik
- Kelola Best Of
- Kelola halaman Tentang
- Kelola Galeri
- Kelola Review Customer
- Kelola Artikel

## Struktur Folder

```
dayeuhmanggung-site/
├── api/                    # Backend API
│   ├── config/
│   │   └── database.php    # Konfigurasi database
│   │   └── bestof.php         # API Best Of
│   │   └── tentang.php        # API Tentang
│   │   └── review.php         # API Review
│   │   └── artikel.php        # API Artikel
│   │   └── galeri.php         # API Galeri
│   │   └── dashboard.php      # API Dashboard
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/         # Komponen admin
│   │   │   │   ├── Admin.jsx
│   │   │   │   └── Login.jsx
│   │   │   └── user/          # Komponen user
│   │   │       ├── Hero.jsx
│   │   │       ├── BestOf.jsx
│   │   │       ├── Tentang.jsx
│   │   │       ├── Galeri.jsx
│   │   │       ├── Review.jsx
│   │   │       ├── ReviewForm.jsx
│   │   │       ├── Artikel.jsx
│   │   │       ├── Navbar.jsx
│   │   │       └── Home.jsx
│   │   ├── services/
│   │   │   └── api.js         # Service API
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── database_setup.sql     # Setup database
│   ├── package.json
│   └── README.md
```

## Troubleshooting

### Error "Failed to load url /src/services/api.js"
- Pastikan file `src/services/api.js` sudah dibuat
- Restart development server dengan `npm run dev`

### Error Database Connection
- Pastikan XAMPP Apache dan MySQL sudah running
- Periksa konfigurasi database di `api/config/database.php`
- Pastikan database `dayeuhmanggung_db` sudah dibuat

### CORS Error
- Pastikan header CORS sudah ditambahkan di setiap file API PHP
- Pastikan domain yang mengakses API sudah benar

### API tidak merespons
- Periksa apakah Apache berjalan di XAMPP
- Periksa error log Apache di XAMPP
- Pastikan file API PHP dapat diakses melalui browser

## Kontribusi

1. Fork repository
2. Buat branch fitur baru (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## Lisensi

Distributed under the MIT License. See `LICENSE` for more information.

## Kontak

- Email: admin@dayeuhmanggung.com
- Website: https://dayeuhmanggung.com
