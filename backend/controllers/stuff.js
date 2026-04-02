//logique pour chaque fonction
const Book = require('../models/book')
const fs = require('fs');



exports.createBook = (req, res, next) => {
   const bookObject = JSON.parse(req.body.book);
   delete bookObject._id;
   delete bookObject._userId;
   const book = new Book({
       ...bookObject,
       userId: req.auth.userId,
       imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
   });
 
   book.save()
   .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
   .catch(error => { res.status(400).json( { error })})
};




exports.modifyBook = (req, res, next) => {

  const bookObject = req.file ? {
    ...JSON.parse(req.body.book),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  delete bookObject._userId;
  Book.findOne({_id: req.params.id})
  .then( (book) => {
    if(book.userId != req.auth.userId){
      res.status(403).json({ message : 'Not authorized'});
    }else {
      Book.updateOne({ _id: req.params.id}, { ...bookObject, _id: req.params.id})
        .then(() => res.status(200).json({message : 'livre modifié!'}))
        .catch(error => res.status(401).json({ error }));
    }
  })
  .catch( (error) => {
      res.status(400).json({error})
  } )
};




exports.deleteBook = (req, res, next) => {
  Book.findOne({_id: req.params.id})
  
  .then( (book) => {
    if(book.userId != req.auth.userId){
      res.status(403).json({ message : 'Not authorized'});
    }else {
      const filename = book.imageUrl.split('/images/') [1];
       fs.unlink(`images/${filename}`, () => {
                   Book.deleteOne({_id: req.params.id})
                       .then(() => { res.status(200).json({message: 'livre supprimé !'})})
                       .catch(error => res.status(401).json({ error }));
               });
    }
  })
  .catch( (error) => {
      res.status(500).json({error})
  } )
};

exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
  .then(book => res.status(200).json(book))
  .catch(error => res.status(400).json({error }))
};

exports.getAllBooks = (req, res, next) => {
  Book.find()
  .then(books => res.status(200).json(books))
  .catch(error => res.status(400).json({error }))
}

exports.rateBook = (req, res, next) => {
  const userId = req.auth.userId;
  const grade = Number(req.body.rating);

  // Vérifier la note
  if (grade < 0 || grade > 5) {
    return res.status(400).json({ message: "Note invalide" });
  }

  Book.findOne({ _id: req.params.id })
    .then(book => {

      if (!book) {
        return res.status(404).json({ message: "Livre non trouvé" });
      }

      // Vérifier si déjà noté
      const alreadyRated = book.ratings.find(r => r.userId === userId);
      if (alreadyRated) {
        return res.status(400).json({ message: "Vous avez déjà noté ce livre" });
      }

      // Ajouter la note
      book.ratings.push({ userId: userId, grade: grade });

      // Calculer la moyenne
      const total = book.ratings.reduce((acc, r) => acc + r.grade, 0);
      book.averageRating = book.ratings.length > 0
        ? total / book.ratings.length
        : 0;

      return book.save();
    })
    .then(updatedBook => {
      res.status(200).json({
        message: "Note ajoutée",
        book: updatedBook
      });
    })
    .catch(error => res.status(400).json({ error }));
};
exports.getBestRatedBooks = (req, res, next) => {
  Book.find()
    .sort({ averageRating: -1 })
    .limit(3)
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
};