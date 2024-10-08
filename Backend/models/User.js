const mongose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');

// définition du schéma pour les utilisateurs 
const userSchema = mongose.Schema({
    email : { type: String, required: true, unique: true}, // unique pour s'assurer qu'il n'y a pas de doublon
    password : { type: String, required: true},
});

userSchema.plugin(uniqueValidator);

module.exports = mongose.model('User', userSchema);