# Kelompok 5
1. (126) ABDUR RAHMAN JIBRIN
2. (114) RIZAL ABID ALFARIZI
3. (106) LIZAM SABIT MAFAIZ
4. (128) ACHMAD AMIRUL MU'MININ
5. (115) FARHAN PUTRA PRATAMA

*Script migration db bisa dilihat di habit-tracker-api/migrations/

# Habit Tracker API

REST API untuk aplikasi **Habit Tracker** (tugas Mobile Programming, Flutter).
Dibuat dengan **Node.js + Express**, database **SQLite** dikelola lewat **Knex.js** (migration & seed).

API ini menyediakan data untuk layar-layar di aplikasi: Login, Register, Home/Habit, Detail Habit, Progress, Quote, dan Profil (termasuk Edit Profil).
Splash dan Onboarding hanya tampilan statis sehingga tidak butuh endpoint.

## Prasyarat

- [Node.js](https://nodejs.org) versi LTS
- Windows: jika `npm install` gagal saat memasang `better-sqlite3`, lihat bagian **Catatan**

## Cara Menjalankan

```bash
# 1. Install dependency
npm install

# 2. Buat tabel (migration) dan isi data awal (seed)
npm run setup

# 3. Jalankan server
npm start
```

Server berjalan di `http://localhost:3000`. Port bisa diganti lewat environment variable `PORT`.

### Script npm

| Perintah | Fungsi |
|---|---|
| `npm start` | Menjalankan server |
| `npm run migrate` | Menjalankan migration yang belum dijalankan |
| `npm run seed` | Mengisi / mereset data awal |
| `npm run setup` | `migrate` + `seed` sekaligus |
| `npm run rollback` | Membatalkan batch migration terakhir |

## Akun Dummy

Sama dengan akun di `user_data.dart` pada aplikasi Flutter.

| Nama | Email | Password |
|---|---|---|
| Lyz | `lyz@example.com` | `password123` |
| Farhan | `farhan@example.com` | `password123` |

Password disimpan dalam bentuk hash (bcrypt), bukan teks polos. Email tidak peka huruf besar/kecil.

## Struktur Folder

```
.
├── server.js        # Aplikasi Express + semua endpoint
├── db.js            # Koneksi database
├── knexfile.js      # Konfigurasi Knex (SQLite)
├── migrations/      # Script pembuat/pengubah tabel
├── seeds/           # Data awal (dummy)
└── package.json
```

## Migration

| File | Isi |
|---|---|
| `20261016000001_create_tables.js` | Membuat tabel `users`, `habits`, `quotes` |
| `20261017000001_add_profile_fields_to_users.js` | Menambah kolom profil (`interests`, `bio`, `profile_icon`) di `users` |

## Skema Database

**users**: `id`, `name`, `email` (unik), `password_hash`, `join_date`, `created_at`, `interests`, `bio`, `profile_icon`

**habits**: `id`, `user_id` (FK ke users), `title`, `subtitle`, `description`, `is_done`, `streak_days`, `progress` (0.0 - 1.0), `created_at`

**quotes**: `id`, `quote`, `author`, `category`

## Daftar Endpoint

| Method | Endpoint | Layar | Keterangan |
|---|---|---|---|
| GET | `/api/habits` | Home, Progress | Semua habit |
| GET | `/api/habits/:id` | Detail Habit | Satu habit |
| GET | `/api/quotes` | Quote | Semua quote |
| GET | `/api/quotes/:id` | Detail Quote | Satu quote |
| POST | `/api/login` | Login | Verifikasi email & password |
| POST | `/api/register` | Register | Membuat user baru |
| GET | `/api/profile?id=1` | Profil | Data profil (default `id=1`) |
| PUT | `/api/profile?id=1` | Edit Profil | Ubah nama, hobi, bio, ikon profil |

### Contoh Request & Response

**GET `/api/habits/1`**
```json
{
  "id": 1,
  "title": "Membaca Buku",
  "subtitle": "Target: 30 Menit",
  "description": "Membaca minimal 1 bab per hari ...",
  "isDone": true,
  "streak": "5 Hari Berturut-turut",
  "progress": 0.7
}
```

**GET `/api/quotes/2`**
```json
{
  "id": 2,
  "quote": "Jangan menunggu kesempatan, ciptakan kesempatan itu sendiri.",
  "author": "George Bernard Shaw",
  "category": "Produktivitas"
}
```

**POST `/api/login`**
```json
// Request body
{ "email": "lyz@example.com", "password": "password123" }

// 200 OK
{ "message": "Login berhasil", "user": { "id": 1, "name": "Lyz", "email": "lyz@example.com" } }

// 401 Unauthorized
{ "message": "Email atau password salah" }
```

**POST `/api/register`**
```json
// Request body
{ "name": "Budi", "email": "budi@example.com", "password": "rahasia" }

// 201 Created
{ "message": "Registrasi berhasil", "user": { "id": 3, "name": "Budi", "email": "budi@example.com" } }

// 400 jika ada field kosong, 409 jika email sudah terdaftar
```

**GET `/api/profile?id=1`**
```json
{
  "id": 1,
  "name": "Lyz",
  "email": "lyz@example.com",
  "interests": "Olahraga, Membaca, Belajar",
  "bio": "Saya sedang membangun kebiasaan yang lebih baik.",
  "profileIcon": "person",
  "totalHabit": 5,
  "joinDate": "2026-01-10"
}
```

**PUT `/api/profile?id=1`**
```json
// Request body (semua field opsional; yang tidak dikirim tidak diubah)
{ "name": "Lyz", "interests": "Coding, Menulis", "bio": "Belajar Flutter", "profileIcon": "menu_book" }

// 200 OK
{ "message": "Profil berhasil diperbarui", "profile": { "id": 1, "name": "Lyz", "interests": "Coding, Menulis", "...": "..." } }

// 400 jika profileIcon tidak valid, 404 jika user tidak ditemukan
```

Pilihan `profileIcon`: `person`, `self_improvement`, `sports_soccer`, `menu_book`, `lightbulb`.
Nama yang dikirim kosong menjadi `Pengguna`; hobi/bio kosong menjadi `Belum diisi` (sama dengan perilaku aplikasi).

### Kode Status

`200` berhasil, `201` data dibuat, `400` input tidak valid, `401` login gagal, `404` data tidak ditemukan, `409` email sudah terdaftar, `500` kesalahan server.

## Catatan

- Belum ada sistem token/sesi, sehingga `/api/profile` memilih user lewat query `?id=`.
- Daftar habit di aplikasi sama untuk semua akun, jadi `/api/habits` mengembalikan semua habit dan `totalHabit` adalah jumlah semuanya. Kolom `habits.user_id` disiapkan untuk pemisahan habit per user nanti.
- Di aplikasi Flutter, registrasi dengan email yang sudah ada menimpa akun lama. API sengaja menolaknya dengan status 409 agar akun tidak bisa tertimpa.
- Untuk pindah ke PostgreSQL/MySQL, ubah `client` dan `connection` di `knexfile.js` dan install driver-nya. File migration dan seed tetap bisa dipakai.
- Jika `npm install` gagal saat memasang `better-sqlite3` di Windows, install workload "Desktop development with C++" lewat Visual Studio Installer (atau Build Tools for Visual Studio), lalu ulangi `npm install`.