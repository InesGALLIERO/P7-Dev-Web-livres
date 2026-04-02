const express = require('express');
const mongoose = require('mongoose');

const stuffRouter = require('./routes/stuff');
const userRoutes = require('./routes/user')

mongoose.connect(
  'mongodb+srv://ines:t_h_3DgXBMCLh_r@cluster0.7pxfpyu.mongodb.net/test'
)
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch((error) => console.log('Connexion à MongoDB échouée !', error));

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});


app.use('/images', express.static('images'));

// ───── ROUTE RACINE ─────
app.get('/', (req, res) => {
    res.send('Backend fonctionne !');
});

app.use('/api/books', stuffRouter);
app.use('/api/auth', userRoutes);

module.exports = app;