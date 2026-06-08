require('dotenv').config();
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

(async () => {
  const hash = await bcrypt.hash('Sr4ipr@2025', 10);

  await pool.query(
    `UPDATE users
     SET password_hash = $1
     WHERE password_hash IS NULL
        OR password_hash = ''`,
    [hash]
  );

  console.log('Passwords fixed.');

  await pool.end();
})();