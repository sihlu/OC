const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const env = require('dotenv').config();
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');
const path = require('path');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require("express-rate-limit");

const app = express();

const connectString= 'mongodb+srv://'+process.env.DB_USER+':'+process.env.DB_PASS+'@'+process.env.DB_HOST+'/'+process.env.DB_NAME+'?retryWrites=true&w=majority';
mongoose.connect(connectString,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !')
);
 
//Sécurisation de l'application
app.use(helmet()); 
app.use(mongoSanitize());
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100
});
app.use('/api/', apiLimiter);


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);


module.exports = app;