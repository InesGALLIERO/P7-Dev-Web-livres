const express = require('express');
const mongoose = require('mongoose');

const Book = require('./models/book');

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

// ───── ROUTE RACINE ─────
app.get('/', (req, res) => {
    res.send('Backend fonctionne !');
});

app.post('/api/stuff', (req, res, next) => {
    delete req.body._id 
    const book = new Book({
      ...req.body
    });
    book.save()
    .then(() => res.status(201).json({ message: 'livre enregistré'}))
    .catch(error => res.status(400).json({error }));
});

app.put('/api/stuff/:id', (req, res, next) => {
  Book.updateOne({_id: req.params.id}, {...req.body, _id: req.params.id })
  .then( () => res.status(200).json({ message: 'livre modifié'}) )
  .catch(error => res.status(400).json({error }))
});

app.delete('/api/stuff/:id', (req, res, next) => {
  Book.deleteOne({ _id: req.params.id })
  .then( () => res.status(200).json({ message: 'livre supprimé'}) )
  .catch(error => res.status(400).json({error }))
})

app.get('/api/stuff/:id', (req, res, next) => {
  Book.findOne({ _id: req.params.id })
  .then(book => res.status(200).json(book))
  .catch(error => res.status(400).json({error }))
});

app.get('/api/stuff', (req, res, next) => {
  Book.find()
  .then(books => res.status(200).json(books))
  .catch(error => res.status(400).json({error }))
});


module.exports = app;