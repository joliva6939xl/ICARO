const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',        // Tu usuario de psql
  host: 'localhost',
  database: 'control_seguridad',
  password: '1',           // La contraseña que usas al entrar a psql
  port: 5432,
});

pool.on('connect', () => {
  console.log('¡Conectado a la base de datos PostgreSQL exitosamente!');
});

module.exports = pool;