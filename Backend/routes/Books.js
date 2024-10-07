const express = require('express');
const router = express.Router();
const stuffCtrl = require('../controllers/Books');

            // Routes


router.post("/", stuffCtrl.createBook); // Route pour créer un livre
router.get("/", stuffCtrl.getAllBooks); // Route pour obtenir la liste des livres
router.get("/:id", stuffCtrl.getOneBook); // Route pour obtenir les détails d'un livre spécifique
router.put("/:id", stuffCtrl.modifyBook); // Route pour mettre à jour les informations d'un livre
router.delete("/:id", stuffCtrl.deleteBook); // Route pour supprimer un livre

module.exports = router;