const mongoose = require('mongoose');

var Desert = mongoose.model('Desert', {
    nameDesert: { 
        type: String,
        required: 'The desert should have a name',
        unique: true
     },
    price: { type: Number}
});

module.exports = { Desert };