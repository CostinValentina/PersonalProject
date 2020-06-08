const mongoose = require('mongoose');

var Drink = mongoose.model('Drink', {
    nameDrink: { 
        type: String,
        required: 'The drink should have a name',
        unique: true
    },
    price: { type: Number},
    stock: { type: Number},
});

module.exports = { Drink };