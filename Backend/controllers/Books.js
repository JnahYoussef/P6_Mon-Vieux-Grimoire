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

// ajouter la fonctionnalité de notation des livres
exports.rateBook = (req, res, next) => {
  // Vérification que la note est comprise entre 0 et 5
  if (req.body.rating >= 0 && req.body.rating <= 5) {
    const ratingObject = { userId: req.auth.userId, grade: req.body.rating }; // Création de l'objet note
    // Récupération du livre par son ID
    Book.findOne({ _id: req.params.id })
      .then((book) => {
        if (!book) {
          return res.status(404).json({ message: 'Livre non trouvé' });
        }

        // Création d'un tableau contenant tous les userId ayant déjà noté ce livre
        const userIdArray = book.ratings.map((rating) => rating.userId);

        // Vérifier que l'utilisateur authentifié n'a pas déjà noté
        if (userIdArray.includes(req.auth.userId)) {
          return res.status(403).json({ message: 'Not authorized: Vous avez déjà noté ce livre.' });
        }

        // Ajout de la nouvelle note de l'utilisateur au tableau des notes du livre
        book.ratings.push(ratingObject);

        // Recalcule de la moyenne des notes
        const grades = book.ratings.map((rating) => rating.grade); // Création d'un tableau contenant toutes les notes
        const averageGrades = grades.reduce((sum, grade) => sum + grade, 0) / grades.length; 

        // Mise à jour de la moyenne des notes
        book.averageRating = averageGrades;

        // Sauvegarde des changements (nouvelle note et moyenne mise à jour)
        book.save()
          .then(() => res.status(201).json(book))
          .catch((error) => res.status(400).json({ error }));
      })
      .catch((error) => res.status(500).json({ error }));
  } else {
    // Si la note n'est pas comprise entre 0 et 5
    res.status(400).json({ message: 'La note doit être comprise entre 0 et 5' });
  }
};


exports.getBestRating = (req, res, next) => {
    // Récupération de tous les livres
    Book.find().sort({averageRating: -1}).limit(3)   // Puis tri par rapport aux moyennes dans l'ordre décroissant, limitation du tableau aux 3 premiers éléments
        .then((books)=>res.status(200).json(books))
        .catch((error)=>res.status(404).json({ error }));
};

