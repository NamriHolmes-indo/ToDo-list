require ('dotenv').config ();
const express = require ('express');
const bcrypt = require ('bcryptjs');
const mysql = require ('mysql2/promise');

const pool = mysql.createPool ({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

module.exports = {
  express,
  bcrypt,
  pool,
};