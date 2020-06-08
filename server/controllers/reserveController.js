const express = require('express');
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;
const moment = require('moment');
var { SecureAPI } = require('../middleware/basicAuth');
var { Reserve } = require('../models/User');

// => localhost:3000/reserves/
// SecureAPI("Admin, Employee"),
router.get('/', (req, res) => {
    Reserve.find((err, docs) => {
        if (!err) { res.send(docs); }
        else { console.log('Error in Retriving reserve:' + JSON.stringify(err, undefined, 2)); }
    });
});

//SecureAPI("Client, Employee"),
router.get('/:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    Reserve.findById(req.params.id, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Retriving reserve :' + JSON.stringify(err, undefined, 2)); }
    });
});

// SecureAPI("Client"),
router.post('/',(req, res) => {
    var reserve = new Reserve({
        nameRez: req.body.nameRez,
      //  email: req.body.email,
        noPers: req.body.noPers,
        // arrivalDate: moment(req.body.arrivalDate).add(3,'h'), 
        // departureDate: moment(req.body.departureDate).add(3,'h'),
        arrivalDate: req.body.arrivalDate,
        departureDate: req.body.departureDate
        
    });
    reserve.save((err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in reserve Save :' + JSON.stringify(err, undefined, 2)); }
    });
});

//Adauga in reserveList un element nou in rezervarile unui user
//SecureAPI("Client"),
router.put('/:id',  (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    var reserve = {
        nameRez: req.body.nameRez,
      //  email: req.body.email,
        noPers: req.body.noPers,
        arrivalDate: req.body.arrivalDate,
        departureDate: req.body.departureDate
    };


    Reserve.updateOne({_id: req.params.id}, { $push: { comanda:  req.body }}, {new: true}, (err, doc) => {
        if(!err){ res.send(doc);
        }
        else{ console.log('Error in reserve Update. Could not add reserves:' + JSON.stringify(err, undefined, 2)); }
    });

});

//Sterge comanda unui user
router.delete('/deleteAll/:id', SecureAPI("Client"),(req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    Reserve.updateOne({_id: req.params.id}, { $unset: {comanda: 1 }} ,(err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in reserve Delete :' + JSON.stringify(err, undefined, 2)); }
    });
});

//delete whole object
router.delete('/:id', SecureAPI("Admin"),(req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    Reserve.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in reserve Delete :' + JSON.stringify(err, undefined, 2)); }
    });
});


//Metoda asta treb sa stearga un anumit item din comnada unui user
//pt a anula o rezervare
router.put('/delete/:id', SecureAPI("Client"),(req, res) =>{
    
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    Reserve.updateOne({_id: req.params.id}, { $pull: { comanda:  req.body }}, {multi: true}, (err, doc) => {
        if(!err){ res.send(doc);}
        else{ console.log('Error in User Update. Could not delete a reservation from reserveInfo:' + JSON.stringify(err, undefined, 2)); }
    });
});

//Metoda acesta ia lista cu rezervarile unui user anume
// router.get('/reserve/:id', (req, res) => {  //new 
//     if (!ObjectId.isValid(req.params.id))
//         return res.status(400).send(`No record with given id : ${req.params.id}`);


//     Reserve.findById(req.params.id, 'comanda', (err, doc) => {
//         if (!err) { res.send(doc); }
//         else { console.log('Error in Retriving User :' + JSON.stringify(err, undefined, 2)); }
//     });

// });

//metoda treb sa ia din db toate rezervarile care au un anume email
router.get('/looking/myReservations', SecureAPI("Client, Employee"),(req, res) => {
    Reserve.find( {email: req.body.email},(err, doc) =>{
        if(!err){
            res.send(doc);
        }else{
            console.log('Error in searching reservation by email :'+ JSON.stringify(err, undefined, 2));
        }
    });
})

module.exports = router;