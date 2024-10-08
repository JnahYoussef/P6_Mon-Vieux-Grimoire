const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

const stuffCtrl = require('../controllers/Books');

            // Routes pour les livres

router.post("/", auth, stuffCtrl.createBook); // Route pour créer un livre
router.get("/", auth, stuffCtrl.getAllBooks); // Route pour obtenir la liste des livres
router.get("/:id", auth, stuffCtrl.getOneBook); // Route pour obtenir les détails d'un livre spécifique
router.put("/:id", auth, stuffCtrl.modifyBook); // Route pour mettre à jour les informations d'un livre
router.delete("/:id", auth, stuffCtrl.deleteBook); // Route pour supprimer un livre

module.exports = router;