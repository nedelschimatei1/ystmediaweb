const mysql = require('mysql2/promise');

let pool = null;

async function getPool() {
  if (pool) return pool;
  const host = process.env.MYSQL_HOST;
  const port = Number(process.env.MYSQL_PORT || 3306);
  const user = process.env.MYSQL_USER;
  const password = process.env.MYSQL_PASS;
  const database = process.env.MYSQL_DB;

  if (!host || !user || !database) throw new Error('MySQL not configured; set MYSQL_HOST, MYSQL_USER and MYSQL_DB');

  pool = mysql.createPool({ host, port, user, password, database, waitForConnections: true, connectionLimit: Number(process.env.MYSQL_POOL_SIZE || 5) });
  return pool;
}

async function markBounce(email, isHard) {
  const p = await getPool();
  const normalized = (email || '').trim().toLowerCase();
  if (isHard) {
    await p.execute('UPDATE subscribers SET bounceCount = bounceCount + 1, isBounced = 1, subscribed = 0, unsubscribedAt = ? WHERE email = ?', [new Date(), normalized]);
  } else {
    await p.execute('UPDATE subscribers SET bounceCount = bounceCount + 1 WHERE email = ?', [normalized]);
  }
}

module.exports = { markBounce };
