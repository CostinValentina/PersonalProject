const express = require('express');
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;
var { SecureAPI } = require('../middleware/basicAuth');
var { Order } = require('../models/User');

// => localhost:3000/orders/
router.post('/', (req, res) => {
    console.log("here is nok");
    var order = new Order({
        nameComanda: req.body.nameComanda,
        price: req.body.price,
        qty: req.body.qty
    });
    order.save((err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in order Save :' + JSON.stringify(err, undefined, 2)); }
    });
});

// SecureAPI("Admin, Employee"),
router.get('/', (req, res) => {
    Order.find((err, docs) => {
        if (!err) { res.send(docs); }
        else { console.log('Error in Retriving Orders :' + JSON.stringify(err, undefined, 2)); }
    });
});

router.get('/:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    Order.findById(req.params.id, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Retriving messages :' + JSON.stringify(err, undefined, 2)); }
    });
});

//SecureAPI("Client"),
// router.post('/', (req, res) => {
//     var order = new Order({
//         name: req.body.name,
//         address: req.body.address
//     });
//     order.save((err, doc) => {
//         if (!err) { res.send(doc); }
//         else { console.log('Error in order Save :' + JSON.stringify(err, undefined, 2)); }
//     });
// });



//SecureAPI("Client"), 
// router.put('/:id', (req, res) => {
//     if (!ObjectId.isValid(req.params.id))
//         return res.status(400).send(`No record with given id : ${req.params.id}`);

//     var order = new Order({
//         name: req.body.name,
//         address: req.body.address
//     });
//     Order.findByIdAndUpdate(req.params.id, { $set: order }, { new: true }, (err, doc) => {
//         if (!err) { res.send(doc); }
//         else { console.log('Error in Order Update :' + JSON.stringify(err, undefined, 2)); }
//     });
// });

router.put('/:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    var order = new Order({
        nameComanda: req.body.nameComanda,
        price: req.body.price,
        qty: req.body.qty
    });
    Order.findByIdAndUpdate(req.params.id, { $set: order }, { new: true }, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Order Update :' + JSON.stringify(err, undefined, 2)); }
    });
});

router.delete('/:id',  (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    Order.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in message Delete :' + JSON.stringify(err, undefined, 2)); }
    });
});

module.exports = router;