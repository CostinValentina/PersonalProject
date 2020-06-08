const express = require('express');
const router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;
const { SecureAPI } = require('../middleware/basicAuth');
const Message = require('../models/contactUs');

// => localhost:3000/messages/
router.get('/',(req, res) => {
    Message.find((err, docs) => {
        if (!err) { res.send(docs); }
        else { console.log('Error in Retriving Messages :' + JSON.stringify(err, undefined, 2)); }
    });
});

//cred ca nu am nevoie   SecureAPI("Client"),
router.get('/:id',(req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    Message.findById(req.params.id, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Retriving messages :' + JSON.stringify(err, undefined, 2)); }
    });
});

router.post('/', SecureAPI("Client"), (req, res) => {
    var contactUs = new Message({
        name: req.body.name,
        message: req.body.message,
        points: req.body.points

    });
    contactUs.save((err, doc) => {
        if (!err) { res.send(doc); }
        else {
            console.log("err => ", err)
            console.log('Error in message Save :' + JSON.stringify(err, undefined, 2));
        }
    });
});

router.put('/:id',SecureAPI("Client"), (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    var contactUs = new Message({
        name: req.body.name,
        message: req.body.message,
        points: req.body.points
    });
    Message.findByIdAndUpdate(req.params.id, { $set: contactUs }, { new: true }, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Message Update :' + JSON.stringify(err, undefined, 2)); }
    });
});

//,SecureAPI("Client") cred ca trebuie scoasa fct asta
router.delete('/:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    Message.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in message Delete :' + JSON.stringify(err, undefined, 2)); }
    });
});

//nu cred ca ar trebui inclusa
//SecureAPI("Client"),
router.delete('/', (req, res) =>{
    Message.remove((err, doc) =>{
        if (!err) { res.send(doc); }
        else { console.log('Error in Deleting all messages :' + JSON.stringify(err, undefined, 2)); }
    })
});

module.exports = router;