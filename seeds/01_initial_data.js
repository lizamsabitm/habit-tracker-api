const bcrypt = require('bcryptjs');

exports.seed = async function (knex) {
  await knex('habits').del();
  await knex('quotes').del();
  await knex('users').del();

  const passwordHash = await bcrypt.hash('password123', 10);
  await knex('users').insert([
    {
      id: 1,
      name: 'Lyz',
      email: 'lyz@example.com',
      password_hash: passwordHash,
      join_date: '2026-01-10',
    },
    {
      id: 2,
      name: 'Farhan',
      email: 'farhan@example.com',
      password_hash: passwordHash,
      join_date: '2026-01-12',
    },
  ]);

  await knex('habits').insert([
    {
      id: 1,
      user_id: 1,
      title: 'Membaca Buku',
      subtitle: 'Target: 30 Menit',
      description:
        'Membaca minimal 1 bab per hari untuk meningkatkan wawasan dan kemampuan berpikir kritis.',
      is_done: true,
      streak_days: 5,
      progress: 0.7,
    },
    {
      id: 2,
      user_id: 1,
      title: 'Olahraga Pagi',
      subtitle: 'Target: 15 Menit',
      description:
        'Lakukan peregangan atau jogging ringan setiap pagi untuk menjaga kesehatan tubuh.',
      is_done: false,
      streak_days: 3,
      progress: 0.4,
    },
    {
      id: 3,
      user_id: 1,
      title: 'Minum Air Putih',
      subtitle: 'Target: 8 Gelas',
      description:
        'Pastikan tubuh terhidrasi dengan minum minimal 8 gelas air putih setiap hari.',
      is_done: true,
      streak_days: 10,
      progress: 0.9,
    },
    {
      id: 4,
      user_id: 1,
      title: 'Menulis Jurnal',
      subtitle: 'Target: 1 Halaman',
      description:
        'Tulis refleksi harian untuk melatih kebiasaan berpikir dan mengekspresikan diri.',
      is_done: false,
      streak_days: 2,
      progress: 0.3,
    },
    {
      id: 5,
      user_id: 1,
      title: 'Belajar Flutter',
      subtitle: 'Target: 1 Jam',
      description:
        'Pelajari satu topik baru di Flutter setiap hari untuk meningkatkan skill programming.',
      is_done: true,
      streak_days: 7,
      progress: 0.85,
    },
  ]);

  await knex('quotes').insert([
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
  ]);
};