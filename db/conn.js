import config from "../config.js";
import mysql from "mysql2";

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'etracker_db'
});
export default db