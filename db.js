// ============================================================
// db.js
// Membuat koneksi database yang dipakai oleh server.js
// ============================================================

const knex = require('knex');
const config = require('./knexfile');

const environment = process.env.NODE_ENV || 'development';

module.exports = knex(config[environment]);
