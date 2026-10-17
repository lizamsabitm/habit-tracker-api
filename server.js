const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

function formatHabit(row) {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    description: row.description,
    isDone: Boolean(row.is_done), // SQLite menyimpan boolean sebagai 0/1
    streak: `${row.streak_days} Hari Berturut-turut`,
    progress: row.progress,
  };
}
app.get('/api/habits', async (req, res) => {
  try {
    const rows = await db('habits').orderBy('id');
    res.json(rows.map(formatHabit));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
});

app.get('/api/habits/:id', async (req, res) => {
  try {
    const row = await db('habits').where({ id: req.params.id }).first();
    if (!row) {
      return res.status(404).json({ message: 'Habit tidak ditemukan' });
    }
    res.json(formatHabit(row));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
});

app.get('/api/quotes', async (req, res) => {
  try {
    const rows = await db('quotes').orderBy('id');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
});

app.get('/api/quotes/:id', async (req, res) => {
  try {
    const row = await db('quotes').where({ id: req.params.id }).first();
    if (!row) {
      return res.status(404).json({ message: 'Quote tidak ditemukan' });
    }
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
});

const ALLOWED_PROFILE_ICONS = [
  'person',
  'self_improvement',
  'sports_soccer',
  'menu_book',
  'lightbulb',
];

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

async function formatProfile(user) {
  const [{ total }] = await db('habits').count({ total: '*' });
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    interests: user.interests,
    bio: user.bio,
    profileIcon: user.profile_icon,
    totalHabit: Number(total),
    joinDate: user.join_date,
  };
}

app.post('/api/login', async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const { password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email dan password wajib diisi' });
    }

    const user = await db('users').where({ email }).first();

    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }

    res.json({
      message: 'Login berhasil',
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
});

app.post('/api/register', async (req, res) => {
  try {
    const name = String(req.body.name || '').trim();
    const email = normalizeEmail(req.body.email);
    const { password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: 'Nama, email, dan password wajib diisi' });
    }

    const existing = await db('users').where({ email }).first();
    if (existing) {
      return res.status(409).json({ message: 'Email sudah terdaftar' });
    }

    const today = new Date().toISOString().slice(0, 10);
    const [id] = await db('users').insert({
      name,
      email,
      password_hash: bcrypt.hashSync(password, 10), 
      join_date: today,
    });

    res.status(201).json({
      message: 'Registrasi berhasil',
      user: { id, name, email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
});

app.get('/api/profile', async (req, res) => {
  try {
    const user = await db('users').where({ id: req.query.id || 1 }).first();
    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }
    res.json(await formatProfile(user));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
});

app.put('/api/profile', async (req, res) => {
  try {
    const user = await db('users').where({ id: req.query.id || 1 }).first();
    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    const { name, interests, bio, profileIcon } = req.body;

    if (profileIcon !== undefined && !ALLOWED_PROFILE_ICONS.includes(profileIcon)) {
      return res.status(400).json({
        message: `profileIcon tidak valid. Pilihan: ${ALLOWED_PROFILE_ICONS.join(', ')}`,
      });
    }

    await db('users')
      .where({ id: user.id })
      .update({
        name: name !== undefined ? String(name).trim() || 'Pengguna' : user.name,
        interests:
          interests !== undefined
            ? String(interests).trim() || 'Belum diisi'
            : user.interests,
        bio: bio !== undefined ? String(bio).trim() || 'Belum diisi' : user.bio,
        profile_icon: profileIcon !== undefined ? profileIcon : user.profile_icon,
      });

    const updated = await db('users').where({ id: user.id }).first();
    res.json({
      message: 'Profil berhasil diperbarui',
      profile: await formatProfile(updated),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
});

app.get('/', (req, res) => {
  res.send(
    'Habit Tracker API sedang berjalan. Coba akses /api/habits atau /api/quotes'
  );
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});