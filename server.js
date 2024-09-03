const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { Sequelize } = require('sequelize');
const session = require('express-session');
const authRoutes = require('./routes/auth');
const notesRoutes = require('./routes/notes');
const crypto=require('crypto')

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(express.static('client'));  

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
});

// Test the database connection
sequelize.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.log('Error: ' + err));

// Initialize session middleware
const secret = crypto.randomBytes(64).toString('hex');// Generate a random secret-key

app.use(session({
  secret: secret,
  resave: false,
  saveUninitialized: true,
}));

app.use('/auth', authRoutes);
app.use('/notes', notesRoutes);

app.listen(3000, () => console.log('Server started on port 3000'));
