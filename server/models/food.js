const mongoose = require('mongoose');

var Food = mongoose.model('Food', {
    nameFood: {
         type: String,
         required: 'The food should have a name',
         unique: true
    },
    price:
    { 
        type: Number
    },
});

module.exports = { Food };