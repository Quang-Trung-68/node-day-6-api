const db = require("@root/database");
const bcrypt = require("bcrypt");
const authConfig = require("../configs/auth.config");

async function register(body) {
  const email = body.email;
  const password = await bcrypt.hash(body.password, authConfig.saltRounds);

  const [{ insertId }] = await db.query(
    "INSERT INTO users (email, password) VALUES (?, ?)",
    [email, password],
  );

  return insertId;
}

async function login(body) {
  const { email, password } = body;

  const [users] = await db.query(
    "SELECT id,password FROM users WHERE email = ?",
    [email],
  );
  const user = users[0];

  return user;
}

async function logout(body) {
  const accessToken = body.access_token;
  const refreshToken = body.refresh_token;
  await revokeAccessToken({ accessToken });
  await revokeRefreshToken({ refreshToken });
  return null;
}

async function saveAccessToken(body) {
  const { userId, accessToken } = body;
  const query = `INSERT INTO access_tokens (user_id, token) VALUES (?, ?);`;
  const params = [userId, accessToken];

  const result = await db.query(query, params);
  return result;
}

async function saveRefreshToken(body) {
  const { userId, refreshToken, expiresAt } = body;
  const query = `INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?);`;
  const params = [userId, refreshToken, expiresAt];

  const result = await db.query(query, params);
  return result;
}

async function revokeRefreshToken(body) {
  const { refreshToken } = body;
  const query = `UPDATE refresh_tokens SET is_revoked = ? WHERE token = ?;`;
  const params = [1, refreshToken];

  const result = await db.query(query, params);
  return result;
}

async function revokeAccessToken(body) {
  const { accessToken } = body;
  const query = `UPDATE access_tokens SET is_revoked = ? WHERE token = ?;`;
  const params = [1, accessToken];

  const result = await db.query(query, params);
  return result;
}

async function checkValidRefreshToken(body) {
  const { refreshToken } = body;
  const query = `SELECT COUNT(*) AS count FROM refresh_tokens WHERE token = ? AND is_revoked = 0 AND expires_at >= now()`;
  const params = [refreshToken];

  const [[{ count }]] = await db.query(query, params);
  return count > 0;
}

async function checkValidAccessToken(body) {
  const { accessToken } = body;
  const query = `SELECT COUNT(*) AS count FROM access_tokens WHERE token = ? AND is_revoked = 0`;
  const params = [accessToken];

  const [[{ count }]] = await db.query(query, params);
  return count > 0;
}

module.exports = {
  register,
  login,
  logout,
  saveAccessToken,
  saveRefreshToken,
  checkValidRefreshToken,
  checkValidAccessToken,
  revokeRefreshToken,
};
