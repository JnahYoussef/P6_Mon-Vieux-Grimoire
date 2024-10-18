const express = require('express');
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');
const sharp = require('../middlewares/sharp');
const router = express.Router();


const booksCtrl = require('../controllers/Books');

            // Routes pour les livres


router.get("/", booksCtrl.getAllBooks); // Route pour obtenir la liste des livres
router.get("/bestrating", booksCtrl.getBestRating); // Route pour obtenir les livres les mieux notés
router.get("/:id", booksCtrl.getOneBook); // Route pour obtenir les détails d'un livre spécifique
router.post("/", auth, multer, sharp, booksCtrl.createBook); // Route pour créer un livre
router.put("/:id", auth, multer, sharp, booksCtrl.modifyBook); // Route pour mettre à jour les informations d'un livre
router.post("/:id/rating", auth, booksCtrl.rateBook); // Route pour noter un livre
router.delete("/:id", auth, booksCtrl.deleteBook); // Route pour supprimer un livre


module.exports = router;