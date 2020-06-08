const mongoose = require("mongoose")
const moment = require('moment');

const ReserveSchema = new mongoose.Schema({
    nameRez: {
        type: String,
        required: true
    },
    noPers:{ 
        type: Number,
        required: true
    },
    arrivalDate:{
        type: Date,
        requiered: true
    },
    departureDate:{
        type: Date,
        requiered: true
    },
});

const OrderSchema = new mongoose.Schema({
    nameComanda: String,
    price: Number,
    qty: Number
});


const UserSchema = new mongoose.Schema({
    orderList: [ //comandaList
        OrderSchema
    ],
    reserveList: [
        ReserveSchema
    ],
    fullName:{
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        default: "Client"
    }
});

module.exports  = mongoose.model("User", UserSchema);
//module.exports.User = mongoose.model("User", UserSchema)
module.exports.Order = mongoose.model("Order", OrderSchema)
module.exports.Reserve = mongoose.model("Reserve", ReserveSchema)
