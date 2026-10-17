// ============================================================
// Migration: membuat tabel users, habits, dan quotes
// Struktur tabel mengikuti data yang dipakai di aplikasi Flutter
// (Login/Register/Profil -> users, Home/Detail/Progress -> habits, Quote -> quotes)
// ============================================================

exports.up = async function (knex) {
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('email').notNullable().unique();
    table.string('password_hash').notNullable();
    table.date('join_date').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('habits', (table) => {
    table.increments('id').primary();
    table
      .integer('user_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table.string('title').notNullable();
    table.string('subtitle').notNullable();
    table.text('description').notNullable();
    table.boolean('is_done').notNullable().defaultTo(false);
    table.integer('streak_days').notNullable().defaultTo(0);
    table.float('progress').notNullable().defaultTo(0); // 0.0 sampai 1.0
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('quotes', (table) => {
    table.increments('id').primary();
    table.text('quote').notNullable();
    table.string('author').notNullable();
    table.string('category').notNullable();
  });
};

exports.down = async function (knex) {
  // Urutan dibalik: tabel yang punya foreign key dihapus lebih dulu
  await knex.schema.dropTableIfExists('quotes');
  await knex.schema.dropTableIfExists('habits');
  await knex.schema.dropTableIfExists('users');
};
