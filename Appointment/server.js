const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const app = express();
const port = 3000;

// PostgreSQL pool setup
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'meeting_scheduler',
  password: '  ',
  port: 5432,
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('public'));

// Endpoint to handle booking form submissions
app.post('/book', async (req, res) => {
  const { name, email, phone, notes, date, time, withWhom } = req.body; // Added withWhom
  const token = uuidv4(); // Generate a unique token

  try {
    // Get the current date
    const currentDate = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD

    // Get the next turn number for the current day
    let nextTurnNumber;
    const queueResult = await pool.query(
      `SELECT next_turn_number FROM daily_queues WHERE date = $1`,
      [currentDate]
    );

    if (queueResult.rows.length === 0) {
      // No entry for today, create one with the next turn number as 1
      nextTurnNumber = 1;
      await pool.query(
        `INSERT INTO daily_queues (date, next_turn_number) VALUES ($1, $2)`,
        [currentDate, nextTurnNumber + 1]
      );
    } else {
      // Entry exists, get the next turn number
      nextTurnNumber = queueResult.rows[0].next_turn_number;
      await pool.query(
        `UPDATE daily_queues SET next_turn_number = $1 WHERE date = $2`,
        [nextTurnNumber + 1, currentDate]
      );
    }

    // Insert booking with the turn number and with_whom details
    const query = `
      INSERT INTO bookings (name, email, phone, notes, date, time, token, waiting_turn_number, with_whom)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *;
    `;
    const values = [name, email, phone, notes, date, time, token, nextTurnNumber, withWhom];

    const result = await pool.query(query, values);

    // Send confirmation email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'yadavbiplove20@gmail.com',
        pass: 'wyft aufh gald mjzl ',
      },
    });

    const mailOptions = {
      from: 'yadavbiplove20@gmail.com',
      to: email,
      subject: 'Appointment Confirmation',
      text: `Dear ${name},

Your appointment has been confirmed. Here are the details:

Date: ${date}
Time: ${time}
Notes: ${notes ? notes : 'N/A'}
Token: ${token}
Waiting Turn Number: ${nextTurnNumber}
With Whom: ${withWhom}

If you have any questions or need to make changes to your appointment, please do not hesitate to contact us.

Thank you for choosing us. We look forward to seeing you!

Best regards,
ISMT College

Contact Information:
- Email: info@ismt.edu.np
- Phone: +977-1-4112122
`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Email sent: ' + info.response);
    });

    res.status(200).send('Booking confirmed!');
  } catch (error) {
    console.error('Error inserting into database:', error); // Log the error
    res.status(500).send('Error saving booking.');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  console.log('Database connected successfully');
  release();
});
