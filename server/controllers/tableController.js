const express = require('express');
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;
var { SecureAPI } = require('../middleware/basicAuth');
var { Table } = require('../models/table');

// => localhost:3000/Tables/   
router.get('/', (req, res) => {
    Table.find((err, docs) => {
        if (!err) { res.send(docs); }
        else { console.log('Error in Retriving Mese:' + JSON.stringify(err, undefined, 2)); }
    });
});

router.get('/:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    Table.findById(req.params.id, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Retriving Mese :' + JSON.stringify(err, undefined, 2)); }
    });
});

//pt a da posibilitatea adminului de a adauga o table noua 
//tine cont ca adauga table , dar nu poate cum e scris aici nu poate sa-i dea direct din post valori 

router.post('/', SecureAPI("Admin"), async(req, res) => {
    var table = new Table({
        nrTable: req.body.nrTable,
        nrPers: req.body.nrPers
    });

    /* Build indexes to ensure unique constraint is enforced */
    await Table.init()
    
    try{
        const tableToSave = await table.save()
        await tableToSave.save()
        res.status(200).send(JSON.stringify('A new table was created'))
    }catch(e){
        res.status(400).send(JSON.stringify(`Duplicate table`))
    }
});

router.delete('/:id', SecureAPI("Admin"), (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    Table.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Table Delete :' + JSON.stringify(err, undefined, 2)); }
    });
});

//Adauga in mese un element nou in array 
router.put('/:id', SecureAPI("Admin"), (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    var table = {
        nrTable: req.body.nrTable,
        nrPers: req.body.nrPers
    };


    Table.findByIdAndUpdate(req.params.id, { $set: table }, { new: true }, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in table Update :' + JSON.stringify(err, undefined, 2)); }
    });
});

//vreau sa obtin numai documentele ce au anumita data si ora sase  = true. de ex
// router.post('/condDate', async (req, res) => {
//     if (req.body.day) {
//         let dt = new Date(req.body.day);
//         dt.setHours(0, 0, 0, 0);
//         console.log(new Date())
//         cond = {
//             dayofYear: (dt.getDate() -1),
//             monthOfYear: (dt.getMonth() + 1),
//             year: dt.getFullYear()
//         }
//     }
//    // cond.opt=req.body.opt;
//     console.log(cond);
//     console.log(req.body.sase);
    
//     Table.aggregate([
//         {
//             $project: {
//                 dayofYear: { $dayOfMonth: "$day" },
//                 monthOfYear: { $month: "$day" },
//                 year: { $year: "$day" },
//                 sase: "$sase",
//                 sapte:" $sapte"
//             }
//         },
//         {
//             $match: cond
//         }
//     ])
//     .exec()
//     .then(data => {
//         res.json(data)
//     })
//     .catch(err => {
//         console.log(err);
//         res.send(err)
//     })
// });


//cauta dupa o data anume si o ora sa fie disponibila - inca nu e gata
// router.post('/updateTable', async (req, res) => {
//     let oraAleasa;
//     const options = { returnNewDocument: true };
//     console.log(req.body.day)
//     if(req.body.sase){
//         Table.findOneAndUpdate({ day: req.body.day, sase: true }, { sase: false }, options, function( err,  result  ) {
//             if (err) {
//               res.send(err);
//             } else {
//               res.send(result);
//             }
//           });
//         oraAleasa = "sase";
//         console.log(oraAleasa)
//     }
// });

module.exports = router;