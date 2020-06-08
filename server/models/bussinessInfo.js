const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BussinessSchema = new Schema( {
    restoName :{
        type: String,
        required: true
    },
    email: { 
        type : String,
        required: true
    }, 
    phone: {
        type: String
    },
    location:{
        type: String
    },
    address:{
        type: String
    },
    openHour: {
        type: String
    },
    closeHour: {
        type: String
    }
});

module.exports = mongoose.model('BussinessInfo', BussinessSchema);