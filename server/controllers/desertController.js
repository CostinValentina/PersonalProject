const express = require('express');
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;
var { SecureAPI } = require('../middleware/basicAuth');
var { Desert } = require('../models/desert');

// => localhost:3000/deserts/
router.get('/',(req, res) => {
    Desert.find((err, docs) => {
        if (!err) { res.send(docs); }
        else { console.log('Error in Retriving Deserts :' + JSON.stringify(err, undefined, 2)); }
    });
});

router.get('/:id',(req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    Desert.findById(req.params.id, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Retriving Desert :' + JSON.stringify(err, undefined, 2)); }
    });
});

router.post('/',SecureAPI("Admin"), async(req, res) => {
    var desert = new Desert({
        nameDesert: req.body.nameDesert,
        price: req.body.price,
    });

    /* Build indexes to ensure unique constraint is enforced */
    await Desert.init()

    try{
        const desertToSave = await desert.save()
        await desertToSave.save()
        res.status(200).send(JSON.stringify('A new type of desert was added'))
    }catch(e){
        res.status(400).send(JSON.stringify(`Duplicate type of desert`))
    }
    // desert.save((err, doc) => {
    //     if (!err) { res.send(doc); }
    //     else { console.log('Error in Desert Save :' + JSON.stringify(err, undefined, 2)); }
    // });
});

router.put('/:id',SecureAPI("Admin, Client") ,(req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    var desert = {
        nameDesert: req.body.nameDesert,
        price: req.body.price,
    };
    Desert.findByIdAndUpdate(req.params.id, { $set: desert }, { new: true }, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Desert Update :' + JSON.stringify(err, undefined, 2)); }
    });
});

router.delete('/:id', SecureAPI("Admin"), (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    Desert.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Desert Delete :' + JSON.stringify(err, undefined, 2)); }
    });
});

module.exports = router;