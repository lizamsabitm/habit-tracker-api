// ============================================================
// knexfile.js
// Konfigurasi koneksi database untuk Knex (tool migration & query)
// Saat ini pakai SQLite (database = 1 file: database.sqlite3)
// Kalau nanti pindah ke PostgreSQL/MySQL, cukup ganti bagian
// "client" dan "connection" di bawah, file migration tetap bisa dipakai.
// ============================================================

module.exports = {
  development: {
    client: 'better-sqlite3',
    connection: {
      filename: './database.sqlite3',
    },
    useNullAsDefault: true,
    migrations: { directory: './migrations' },
    seeds: { directory: './seeds' },
  },
};
