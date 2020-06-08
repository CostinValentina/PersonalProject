const mongoose = require('mongoose');  //change here carefully
var BindUsers = mongoose.model('BindUsers', {
    email: { 
        type : String,
        required: 'The employee should have a unique email',
        unique: true
    }, 
    password: {
         type: String,
         required: true
    },
    role: { 
        type: String,
        enum: ['Client', 'Employee', 'Admin']
    },
    sessions: {
        type: Array,
        required: true,
        default: []
    }
});

module.exports = {BindUsers};