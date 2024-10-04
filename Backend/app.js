const express = require('express');

const app = express();

app.use((req, res, next) => {
    console.log('Requete reçue')
    next();
});

app.use((req, res, next) => {
   res.status(200);
    next();
});

app.use((req, res, next) => {
    res.json({message: "votre requete a bien été recu 2"});
    next();
});

app.use((req, res) => {
    console.log('reponse envoyé avec succées')
});

module.exports = app;