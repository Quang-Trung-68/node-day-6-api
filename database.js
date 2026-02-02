const mysql = require("mysql2/promise");
const dbConfig = require("@/configs/db.config");

const db = mysql.createPool({
  host: dbConfig.host, // Địa chỉ MySQL server
  user: dbConfig.user, // Username để đăng nhập MySQL
  password: dbConfig.password, // Password của user
  database: dbConfig.database, // Tên database cần kết nối
  port: dbConfig.port, // Port MySQL (mặc định 3306)
});

module.exports = db;
