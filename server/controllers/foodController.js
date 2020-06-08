const express = require('express');
const router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;
var { SecureAPI } = require('../middleware/basicAuth');
var { Food } = require('../models/food');

// => localhost:3000/Foods/
router.get('/',(req, res) => {
    Food.find((err, docs) => {
        if (!err) { res.send(docs); }
        else { console.log('Error in Retriving Foods :' + JSON.stringify(err, undefined, 2)); }
    });
});

router.get('/:id',(req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    Food.findById(req.params.id, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Retriving Food :' + JSON.stringify(err, undefined, 2)); }
    });
});

router.post('/', SecureAPI("Admin"), async(req, res) => {
    var food = new Food({
        nameFood: req.body.nameFood,
        price: req.body.price,
    });

    /* Build indexes to ensure unique constraint is enforced */
    await Food.init()

    // try{
    //     const foodToSave = await food.save()
    //     await foodToSave.save()
    //     res.status(200).send(JSON.stringify('A new type of food was added'))
    // }catch(e){
    //     res.status(400).send(JSON.stringify(`Duplicate type of food`))
    // }
    // //daca merge partea de sus sterge aici
    
    food.save((err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Food Save :' + JSON.stringify(err, undefined, 2)); }
    });
});

router.put('/:id',SecureAPI("Admin, Client"), (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    var food = {
        nameFood: req.body.nameFood,
        price: req.body.price,

    };
    Food.findByIdAndUpdate(req.params.id, { $set: food }, { new: true }, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Food Update :' + JSON.stringify(err, undefined, 2)); }
    });
});

router.delete('/:id',SecureAPI("Admin"), (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    Food.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Food Delete :' + JSON.stringify(err, undefined, 2)); }
    });
});

module.exports = router;