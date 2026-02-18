const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
db.getConnection()
  .then(() => console.log("DB Connected ✅"))
  .catch(err => console.error("DB Error ❌", err));


module.exports = db;
