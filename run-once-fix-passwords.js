// run-once-fix-passwords.js
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function fixPassword() {
  const email = 'himanshu@sr4ipr.in';
  const newPassword = 'YourNewPassword123'; // set what you want

  const hash = await bcrypt.hash(newPassword, 10);
  const result = await pool.query(
    'UPDATE users SET password_hash = $1 WHERE LOWER(email) = LOWER($2) RETURNING id, email',
    [hash, email]
  );

  if (result.rows.length) {
    console.log('✅ Password updated for:', result.rows[0].email);
  } else {
    console.log('❌ User not found — insert them instead');
    // Optionally insert:
    // await pool.query('INSERT INTO users (email, password_hash, name, role, avatar) VALUES ($1,$2,$3,$4,$5)', [email, hash, 'Himanshu', 'founder', 'H']);
  }
  await pool.end();
}

fixPassword().catch(console.error);