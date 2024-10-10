const Book = require("../models/Book");
const fs = require('fs');

exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book); // on uttilise la méthode JSON.parse pour transformer l'objet JSON en objet JavaScript
  delete bookObject._id; // on supprime l'id envoyé par le front-end pour éviter les erreurs de doublons
  delete bookObject._userId; // on supprime l'id de l'utilisateur envoyé par le front-end
  const book = new Book({
    ...bookObject, // on utilise l'opérateur spread (...) pour copier tous les éléments de req.body
    userId: req.auth.userId, // on utilise l'objet req.auth pour obtenir l'ID de l'utilisateur
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}` //on utilise l'objet req.protocol pour obtenir le protocole (ici, http ou https), et l'objet req.get("host") pour obtenir l'hôte du serveur (ici, localhost:3000), puis on ajoute /images/ et le nom du fichier pour construire l'URL complète de l'image
  });
  book.save() // on utilise la méthode save() pour enregistrer l'objet dans la base de données
    .then(() => res.status(201).json({ message: "Livre enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
}

exports.getAllBooks = (req, res, next) => {
    Book.find()
      .then(books => res.status(200).json(books))
      .catch(error => res.status(400).json({ error }));
}

exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
      .then(book => res.status(200).json(book))
      .catch(error => res.status(404).json({ error }));
}

exports.getBestRatings = (req, res, next) => {
    Book.find({ rating: { $gte: 4 } }) // on utilise l'opérateur $gte (greater than or equal) pour trouver les livres avec une note supérieure ou égale à 4
      .then(books => res.status(200).json(books))
      .catch(error => res.status(400).json({ error }));
}

exports.modifyBook = (req, res, next) => {
    const bookObject = req.file ? { // on utilise un opérateur ternaire pour déterminer si la requête contient un fichier ou non
      ...JSON.parse(req.body.book),
      imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    } : { ...req.body };

    delete bookObject._userId;
    Book.findOne({ _id: req.params.id })
      .then((book) => {
        if (book.userId != req.auth.userId) {
          res.status(401).json({ error: 'Utilisateur non autorisé !' });
        } else {
          Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Livre modifié !'}))
            .catch(error => res.status(401).json({ error }));
        }
      })
      .catch(error => res.status(400).json({ error }));
}

exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then(book => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ error: 'Utilisateur non autorisé !' });
      } else {
        const filename = book.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Book.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Livre supprimé !'}))
            .catch(error => res.status(400).json({ error }));
        });
      }
    })
    .catch(error => res.status(500).json({ error }));
}