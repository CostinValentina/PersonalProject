const express = require('express');
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;
var { SecureAPI } = require('../middleware/basicAuth');

var { Drink } = require('../models/drink');

// => localhost:3000/Drinks/
router.get('/', (req, res) => {
    Drink.find((err, docs) => {
        if (!err) { res.send(docs); }
        else { console.log('Error in Retriving Drinks :' + JSON.stringify(err, undefined, 2)); }
    });
});

router.get('/:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    Drink.findById(req.params.id, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Retriving Drink :' + JSON.stringify(err, undefined, 2)); }
    });
});

router.post('/',SecureAPI("Admin"), async(req, res) => {
    var drink = new Drink({
        nameDrink: req.body.nameDrink,
        price: req.body.price,
        stock: req.body.stock,
    });

    /* Build indexes to ensure unique constraint is enforced */
    await Drink.init()

    try{
        const drinkToSave = await drink.save()
        await drinkToSave.save()
        res.status(200).send(JSON.stringify('A new type of drink was added'))
    }catch(e){
        res.status(400).send(JSON.stringify(`Duplicate type of drink`))
    }
    //daca merge partea de sus, sterge asta
    // drink.save((err, doc) => {
    //     if (!err) { res.send(doc); }
    //     else { console.log('Error in Drink Save :' + JSON.stringify(err, undefined, 2)); }
    // });
});

router.put('/:id', SecureAPI("Admin, Client"),(req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    var drink = {
        nameDrink: req.body.nameDrink,
        price: req.body.price,
        stock: req.body.stock,
    };
    Drink.findByIdAndUpdate(req.params.id, { $set: drink }, { new: true }, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Drink Update :' + JSON.stringify(err, undefined, 2)); }
    });
});

router.delete('/:id', SecureAPI("Admin"),(req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    Drink.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Drink Delete :' + JSON.stringify(err, undefined, 2)); }
    });
});

module.exports = router;