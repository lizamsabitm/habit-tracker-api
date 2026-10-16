// ============================================================
// server.js
// API sederhana untuk aplikasi Habit Tracker
// Menggunakan Node.js + Express
// Semua data masih DUMMY (hardcode), belum pakai database
// ============================================================

const express = require('express');
const app = express();
const PORT = 3000;

// Middleware supaya server bisa baca body JSON dari request (dibutuhkan untuk Login & Register)
app.use(express.json());

// ============================================================
// DATA DUMMY
// (Strukturnya mengikuti habit_data.dart, quote_data.dart, dan kebutuhan Login/Register/Profil)
// ============================================================

const habitList = [
  {
    id: 1,
    title: 'Membaca Buku',
    subtitle: 'Target: 30 Menit',
    description: 'Membaca minimal 1 bab per hari untuk meningkatkan wawasan dan kemampuan berpikir kritis.',
    isDone: true,
    streak: '5 Hari Berturut-turut',
    progress: 0.7,
  },
  {
    id: 2,
    title: 'Olahraga Pagi',
    subtitle: 'Target: 15 Menit',
    description: 'Lakukan peregangan atau jogging ringan setiap pagi untuk menjaga kesehatan tubuh.',
    isDone: false,
    streak: '3 Hari Berturut-turut',
    progress: 0.4,
  },
  {
    id: 3,
    title: 'Minum Air Putih',
    subtitle: 'Target: 8 Gelas',
    description: 'Pastikan tubuh terhidrasi dengan minum minimal 8 gelas air putih setiap hari.',
    isDone: true,
    streak: '10 Hari Berturut-turut',
    progress: 0.9,
  },
  {
    id: 4,
    title: 'Menulis Jurnal',
    subtitle: 'Target: 1 Halaman',
    description: 'Tulis refleksi harian untuk melatih kebiasaan berpikir dan mengekspresikan diri.',
    isDone: false,
    streak: '2 Hari Berturut-turut',
    progress: 0.3,
  },
  {
    id: 5,
    title: 'Belajar Flutter',
    subtitle: 'Target: 1 Jam',
    description: 'Pelajari satu topik baru di Flutter setiap hari untuk meningkatkan skill programming.',
    isDone: true,
    streak: '7 Hari Berturut-turut',
    progress: 0.85,
  },
];

const quoteList = [
  {
    id: 1,
    quote: 'Kesuksesan adalah hasil dari persiapan, kerja keras, dan belajar dari kegagalan.',
    author: 'Colin Powell',
    category: 'Motivasi',
  },
  {
    id: 2,
    quote: 'Jangan menunggu kesempatan, ciptakan kesempatan itu sendiri.',
    author: 'George Bernard Shaw',
    category: 'Produktivitas',
  },
  {
    id: 3,
    quote: 'Kebiasaan kecil yang konsisten mengalahkan usaha besar yang sesekali.',
    author: 'James Clear',
    category: 'Habit',
  },
  {
    id: 4,
    quote: 'Kamu tidak harus hebat untuk memulai, tapi kamu harus memulai untuk menjadi hebat.',
    author: 'Zig Ziglar',
    category: 'Motivasi',
  },
  {
    id: 5,
    quote: 'Disiplin adalah jembatan antara tujuan dan pencapaian.',
    author: 'Jim Rohn',
    category: 'Disiplin',
  },
];

// Data user dummy, dipakai untuk Login & Profil
const userDummy = {
  id: 1,
  name: 'Lyz',
  email: 'lyz@example.com',
  password: '123456', // dummy saja, nanti kalau sungguhan JANGAN simpan password polos begini
  totalHabit: habitList.length,
  joinDate: '2026-01-10',
};

// ============================================================
// ENDPOINT: HOME / HABIT
// ============================================================

// GET semua habit (dipakai di Home Screen & Progress Screen)
app.get('/api/habits', (req, res) => {
  res.json(habitList);
});

// GET detail 1 habit berdasarkan id (dipakai di Detail Habit Screen)
app.get('/api/habits/:id', (req, res) => {
  const habit = habitList.find(h => h.id === parseInt(req.params.id));
  if (!habit) {
    return res.status(404).json({ message: 'Habit tidak ditemukan' });
  }
  res.json(habit);
});

// ============================================================
// ENDPOINT: QUOTE
// ============================================================

// GET semua quote (dipakai di Quote Screen)
app.get('/api/quotes', (req, res) => {
  res.json(quoteList);
});

// GET detail 1 quote berdasarkan id (dipakai di Quote Detail Screen)
app.get('/api/quotes/:id', (req, res) => {
  const quote = quoteList.find(q => q.id === parseInt(req.params.id));
  if (!quote) {
    return res.status(404).json({ message: 'Quote tidak ditemukan' });
  }
  res.json(quote);
});

// ============================================================
// ENDPOINT: LOGIN
// ============================================================

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  // Validasi sederhana: cocokkan dengan data dummy
  if (email === userDummy.email && password === userDummy.password) {
    res.json({
      message: 'Login berhasil',
      user: {
        id: userDummy.id,
        name: userDummy.name,
        email: userDummy.email,
      },
    });
  } else {
    res.status(401).json({ message: 'Email atau password salah' });
  }
});

// ============================================================
// ENDPOINT: REGISTER
// ============================================================

app.post('/api/register', (req, res) => {
  const { name, email, password } = req.body;

  // Validasi sederhana: cek apakah ada field yang kosong
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Nama, email, dan password wajib diisi' });
  }

  // Karena ini dummy, kita cuma pura-pura berhasil daftar (tidak benar-benar disimpan)
  res.status(201).json({
    message: 'Registrasi berhasil',
    user: { name, email },
  });
});

// ============================================================
// ENDPOINT: PROFIL
// ============================================================

app.get('/api/profile', (req, res) => {
  res.json({
    id: userDummy.id,
    name: userDummy.name,
    email: userDummy.email,
    totalHabit: userDummy.totalHabit,
    joinDate: userDummy.joinDate,
  });
});

// ============================================================
// ROOT ENDPOINT (cuma buat cek server hidup atau tidak)
// ============================================================

app.get('/', (req, res) => {
  res.send('Habit Tracker API sedang berjalan. Coba akses /api/habits atau /api/quotes');
});

// ============================================================
// JALANKAN SERVER
// ============================================================

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
