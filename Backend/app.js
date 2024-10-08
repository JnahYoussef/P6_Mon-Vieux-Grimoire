const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const bookRoutes = require('./routes/Books');
const userRoutes = require('./routes/User');

// Connexion à la base de données MongoDB
mongoose.connect('mongodb+srv://youssef:8B3yNpmXKaRYLFru@cluster0.47go9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0') 
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use(express.json()); // on utilise la méthode json() pour transformer le corps de la requête en objet JavaScript utilisable

// Middleware pour éviter les erreurs CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // on donne l'accès à notre API à tout le monde
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); // on donne l'autorisation d'utiliser certains headers dans les requêtes envoyées vers notre API
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // on donne l'autorisation d'envoyer des requêtes avec certaines méthodes
    next(); // on appelle la fonction next() pour passer à la suite du middleware
});

app.use(bodyParser.json());

app.use('/api/books', bookRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;