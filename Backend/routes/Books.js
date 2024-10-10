const express = require('express');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const router = express.Router();

const booksCtrl = require('../controllers/Books');

            // Routes pour les livres

router.post("/", auth, multer, booksCtrl.createBook); // Route pour créer un livre
router.get("/", booksCtrl.getAllBooks); // Route pour obtenir la liste des livres
router.get("/:id", booksCtrl.getOneBook); // Route pour obtenir les détails d'un livre spécifique
router.get("/bestratings", booksCtrl.getBestRatings); // Route pour obtenir les livres les mieux notés
router.put("/:id", auth, multer, booksCtrl.modifyBook); // Route pour mettre à jour les informations d'un livre
router.delete("/:id", auth, booksCtrl.deleteBook); // Route pour supprimer un livre

module.exports = router;