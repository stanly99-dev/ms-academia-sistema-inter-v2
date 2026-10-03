// ============================================================
// MS ACADEMIA — Conexão com o Banco de Dados MySQL
// Projeto Interdisciplinar 2026.2 — UNIBRA
// ============================================================

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'dev_user',
  password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : '123321',
  database: process.env.DB_NAME || 'ms_academia',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Testar conexão ao iniciar
pool.getConnection()
  .then(conn => {
    console.log('✅ Conectado com sucesso ao banco de dados MySQL (ms_academia)');
    conn.release();
  })
  .catch(err => {
    console.warn('⚠️  Aviso: Não foi possível conectar ao MySQL imediatamente:', err.message);
    console.warn('    Verifique se o serviço MySQL está ativo e se o banco ms_academia foi importado.');
  });

module.exports = pool;
