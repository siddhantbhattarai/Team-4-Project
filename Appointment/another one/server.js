const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;


const pool = new Pool({
  user: 'postgres', 
  host: 'localhost',
  database: 'meeting_scheduler',
  password: '  ', 
  port: 5432,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(express.static('public'));


app.post('/book', async (req, res) => {
  const { name, email, phone, notes, date, time } = req.body;

  const query = `
    INSERT INTO bookings (name, email, phone, notes, date, time)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;

  const values = [name, email, phone, notes, date, time];

  try {
    const result = await pool.query(query, values);
    res.status(200).send('Booking confirmed!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error saving booking.');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
