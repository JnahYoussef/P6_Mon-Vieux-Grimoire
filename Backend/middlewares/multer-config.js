const multer = require('multer'); 
const path = require('path'); // on importe le module path pour travailler avec les chemins de fichiers

// dictionnaire des types MIME
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp'
};

const storage = multer.diskStorage({ // on utilise la méthode diskStorage pour enregistrer sur le disque
    destination: (req, file, callback) => { // on indique à multer d'enregistrer les fichiers dans le dossier images
        callback(null, 'images');
    },
    filename: (req, file, callback) => { // on utilise la fonction filename pour indiquer à multer d'utiliser le nom d'origine, de remplacer les espaces par des underscores et d'ajouter un timestamp Date.now() comme nom de fichier
        const name = path.basename(file.originalname, path.extname(file.originalname)).split(' ').join('_'); // on utilise la fonction split pour créer un tableau en séparant les éléments à chaque espace, puis la fonction join pour créer une chaîne de caractères en regroupant les éléments du tableau séparés par _
        const extension = MIME_TYPES[file.mimetype]; // on utilise la constante dictionnaire des types MIME pour résoudre l'extension de fichier appropriée
        callback(null, name + Date.now() + '.' + extension); // on appelle ensuite la fonction callback, on passe null pour indiquer qu'il n'y a pas eu d'erreur, on concatène le nom de fichier et l'extension complète du fichier
    }
});

module.exports = multer({ storage }).single('image'); // on exporte notre middleware multer configuré, on lui passe notre constante storage et on lui indique qu'il s'agit d'un fichier image unique
