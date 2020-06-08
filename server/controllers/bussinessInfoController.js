const express = require('express');
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;
var { SecureAPI } = require('../middleware/basicAuth');
const BussinessInfo = require('../models/bussinessInfo');

router.get('/', (req, res) => {
    BussinessInfo.find((err, docs) => {
        if (!err) { res.send(docs); }
        else { console.log('Error in Retriving BussinessInfo :' + JSON.stringify(err, undefined, 2)); }
    });
});

router.post('/', async(req, res) => {
    var bussinessInfo = new BussinessInfo({
        restoName: req.body.restoName,
        email: req.body.email,
        phone: req.body.phone,
        location: req.body.location,
        address: req.body.address,
        openHour: req.body.openHour,
        closeHour: req.body.closeHour
    });

    bussinessInfo.save((err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in BussinessInfo Save :' + JSON.stringify(err, undefined, 2)); }
    });
});

//SecureAPI("Admin"),
router.put('/:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    var bussinessInfo = {
        restoName: req.body.restoName,
        email: req.body.email,
        phone: req.body.phone,
        location: req.body.location,
        address: req.body.address,
        openHour: req.body.openHour,
        closeHour: req.body.closeHour
    };
    BussinessInfo.findByIdAndUpdate(req.params.id, { $set: bussinessInfo }, { new: true }, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Food Update :' + JSON.stringify(err, undefined, 2)); }
    });
});

router.get('/:id',(req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    BussinessInfo.findById(req.params.id, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Retriving Food :' + JSON.stringify(err, undefined, 2)); }
    });
});

module.exports = router;