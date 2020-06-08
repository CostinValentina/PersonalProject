const mongoose = require('mongoose');

var Table = mongoose.model('Table', {
    nrTable: 
    {
         type: Number,
         unique:true,
    },
    nrPers:{
        type: Number,
        required: true
    }
});

module.exports = { Table };