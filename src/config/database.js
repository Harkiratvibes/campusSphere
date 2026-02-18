const mysql = require("mysql2/promise");
console.log("DB ENV CHECK 👉", {
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  pass: process.env.MYSQLPASSWORD?.slice(0, 4) + "****",
  port: process.env.MYSQLPORT,
  db: process.env.MYSQLDATABASE,
});


const db = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  port: process.env.MYSQLPORT,
  database: process.env.MYSQLDATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
db.getConnection()
  .then(() => console.log("DB Connected ✅"))
  .catch(err => console.error("DB Error ❌", err));


module.exports = db;
