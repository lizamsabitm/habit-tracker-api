// ============================================================
// MIGRATION: menambah kolom profil di tabel users
// Dipakai layar Profil + Edit Profil di aplikasi:
// Hobi / Minat, Bio, dan pilihan ikon foto profil
// Nilai default sama dengan tampilan awal di profile_screen.dart
// ============================================================

exports.up = async function (knex) {
  await knex.schema.alterTable('users', (table) => {
    table.string('interests').notNullable().defaultTo('Olahraga, Membaca, Belajar');
    table
      .text('bio')
      .notNullable()
      .defaultTo('Saya sedang membangun kebiasaan yang lebih baik.');
    table.string('profile_icon').notNullable().defaultTo('person');
  });
};

exports.down = async function (knex) {
  // SQLite tidak bisa menghapus kolom langsung: Knex membuat ulang tabel users.
  // Kalau foreign key aktif, menghapus tabel lama ikut menghapus semua habit
  // (ON DELETE CASCADE). Jadi foreign key dimatikan sementara selama proses ini.
  await knex.raw('PRAGMA foreign_keys = OFF');
  try {
    await knex.schema.alterTable('users', (table) => {
      table.dropColumn('interests');
      table.dropColumn('bio');
      table.dropColumn('profile_icon');
    });
  } finally {
    await knex.raw('PRAGMA foreign_keys = ON');
  }
};

// PRAGMA foreign_keys tidak berpengaruh di dalam transaksi,
// jadi migration ini dijalankan tanpa transaksi.
exports.config = { transaction: false };
