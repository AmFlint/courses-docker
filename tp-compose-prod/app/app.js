const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mysql = require('promise-mysql');

const app = express();

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/', (req, res) => {
  return res.send({
    message: 'hello'
  });
});

app.get('/messages', async (req, res) => {
  const query = 'SELECT * FROM messages';
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || '127.0.0.1',
      user: process.env.DB_USER || 'test',
      password: process.env.DB_PASSWORD || 'test',
      database: process.env.DB_NAME || 'mydatabase'
    });
  
    const results = await connection.query(query);
    connection.end();
  
    return res.send(results);
  } catch(error) {
    return res.status(500).send({
      error,
      message: 'Work is not done yet...'
    })
  }
});

module.exports = app;
