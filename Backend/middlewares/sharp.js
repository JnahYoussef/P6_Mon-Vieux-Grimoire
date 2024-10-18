const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

module.exports = (req, res, next) => {
    // Vérifier si un fichier a été téléchargé
    if (req.file) {
        const originalPath = req.file.path;
        const fileBaseName = path.basename(req.file.filename, path.extname(req.file.filename)); // Nom de fichier sans extension
        const newFileName = fileBaseName + '.webp'; // Nouveau nom de fichier avec extension WebP
        const newFilePath = path.join('images', newFileName); // Chemin complet du fichier compressé

        sharp.cache(false); // Désactiver le cache pour éviter les problèmes de mémoire

        // Redimensionner et convertir l'image en WebP
        sharp(originalPath)
            .resize(500)
            .webp({ quality: 90 }) // Compression avec qualité
            .toFile(newFilePath, (err) => {
                if (err) {
                    return res.status(500).json({ error: "Erreur lors de la conversion de l'image" });
                }

                // Supprimer l'image originale après la conversion
                fs.unlink(originalPath, (unlinkErr) => {
                    if (unlinkErr) {
                        console.error(`Erreur lors de la suppression de l'image originale: ${unlinkErr.message}`);
                        // Continuer même si la suppression échoue, mais on log l'erreur
                    }

                    // Mettre à jour le nom et le chemin du fichier compressé dans la requête
                    req.file.filename = newFileName;
                    req.file.path = newFilePath;

                    // Appeler le middleware suivant
                    next();
                });
            });
    } else {
        // Si aucun fichier n'est téléchargé, passer au middleware suivant
        next();
    }
};
