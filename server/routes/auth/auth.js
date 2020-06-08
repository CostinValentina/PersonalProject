const router = require("express").Router()
const User = require("../../models/User")
const Joi = require("joi")
const bcrypt = require("bcrypt")
const jsonwebtoken = require("jsonwebtoken")
const verifyToken = require("../../middleware/verifyToken")
const crypto = require("crypto")
var ObjectId = require('mongoose').Types.ObjectId;
const { BindUsers } = require('../../models/bindUsers');

/* Sign in with an email and password, receive a JWT */
router.post("/login", async (request, response) => {
    const schema = Joi.object({
        email: Joi.string().required().email(),
        password: Joi.string().required()
    })

    const { error } = schema.validate(request.body)
    if (error) {
        return response.status(400).send(error.details[0].message)
    }

    /* Search for a user */
    const query = {
        email: request.body.email
    }

    const user = await User.findOne(query)

    if (user) {
        /* Compare passwords via bcrypt */
        const isPasswordCorrect = await bcrypt.compare(request.body.password, user.password)

        if (isPasswordCorrect) {
            await user.save()

            const token = jsonwebtoken.sign({
                fullName: user.fullName,
                email: user.email,
                role: user.role
            }, process.env.TOKEN_SECRET)
            
            /* Respond with JWT */
            response.json({
                token
            })
        } else {
            response.status(401).send("Wrong email address or password")
        }
    } else {
        response.status(401).send("Wrong email address or password")
    }
})

/* Create a new user with a unique email and a password */
router.post("/signup", async (request, response) => {
    const schema = Joi.object({
        fullName: Joi.string().required(),
        email: Joi.string().required().email(),
        password: Joi.string().required()
    })

    const { error } = schema.validate(request.body)
    if (error) {
        return response.status(400).send(error.details[0].message)
    }

    /* Store password securely with salt and hash */
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(request.body.password, salt)

    const newUser = new User({
        fullName: request.body.fullName,
        email: request.body.email,
    })

    /* Build indexes to ensure unique constraint is enforced */
    await User.init()

    try {
        /* Write to database */
        const user = await newUser.save()
        await user.save()

        const bindUser = new BindUsers({
            email: request.body.email,
            password: hashedPassword,
            role: user.role
        });

        await bindUser.save();
        
        response.status(200).send(JSON.stringify(`Signed up as ${user.email}`))
        
    } catch (e) {
        response.status(400).send(JSON.stringify(`Could not sign up as ${request.body.email} Duplicate email`))
    }
})

//CRUD new added
//Metoda asta ar trebui sa adauge la lista de rezervari 
//localhost:3000/api/auth/5eb55c6e66549d14dc0b8ccf
router.put('/:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    var user = {
        reserveList: req.body.reserveList,
        nameRez: req.body.nameRez,
        noPers: req.body.noPers,
        arrivalDate: req.body.arrivalDate,
        departureDate: req.body.departureDate
    };

    User.updateOne({_id: req.params.id}, { $push: { reserveList:  req.body }}, {new: true}, (err, doc) => {
        if(!err){ res.send(doc);}
        else{ console.log('Error in User Update. Could not add reserveInfo:' + JSON.stringify(err, undefined, 2)); }
    });
});

router.delete('/:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    User.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in User Delete :' + JSON.stringify(err, undefined, 2)); }
    });
});

//localhost:3000/api/auth/
router.get('/', (req, res) => {
    User.find((err, docs) => {
        if (!err) { res.send(docs); }
        else { console.log('Error in Retriving Users :' + JSON.stringify(err, undefined, 2)); }
    });
});

//Metoda acesta ia din lista de rezervari a unui user anume
router.get('/:id', (req, res) => {  //new 
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);


    User.findById(req.params.id, 'reserveInfo', (err, doc) => {
            if (!err) { res.send(doc); }
            else { console.log('Error in Retriving User :' + JSON.stringify(err, undefined, 2)); }
        });
});

//get current user
router.get('/user/:id', (req, res) => { 
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);


    User.findById(req.params.id, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Retriving User :' + JSON.stringify(err, undefined, 2)); }
    });
});

//Metoda asta treb sa stearga din reserveInfo un element anume
router.put('/delete/:id', (req, res) =>{
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    User.updateOne({_id: req.params.id}, { $pull: { reserveInfo:  req.body }}, {multi: true}, (err, doc) => {
        if(!err){ res.send(doc);}
        else{ console.log('Error in User Update. Could not delete a reservation from reserveInfo:' + JSON.stringify(err, undefined, 2)); }
    });
});

//comada user de aici
//Metoda asta treb sa stearga din orderList un element anume
router.put('/deleteInComanda/:id', (req, res) =>{
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    User.updateOne({_id: req.params.id}, { $pull: { orderList:  req.body }}, {multi: true}, (err, doc) => {
        if(!err){ res.send(doc);}
        else{ console.log('Error in User Update. Could not delete a reservation from reserveInfo:' + JSON.stringify(err, undefined, 2)); }
    });
});

//Metoda acesta ia din lista de comenzi a unui user anume
router.get('/fromComanda/:id', (req, res) => {  //new 
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);


    User.findById(req.params.id, 'orderList', (err, doc) => {
            if (!err) { res.send(doc); }
            else { console.log('Error in Retriving User :' + JSON.stringify(err, undefined, 2)); }
        });
});

//Treb sa adauge in lista cu comenzi
router.put('/comandaItem/:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    var order = {
        orderList: req.body.orderList,
        nameComanda: req.body.nameComanda,
        price: req.body.price,
        qty: req.body.qty 
    };

    User.updateOne({_id: req.params.id}, { $push: { orderList:  req.body }}, {new: true}, (err, doc) => {
        if(!err){ res.send(doc);}
        else{ console.log('Error in User Update. Could not add reserveInfo:' + JSON.stringify(err, undefined, 2)); }
    });
});

//multiply price with qty TO DO
router.get('/total/:id', (req, res) =>{
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    User.findById(req.params.id, 'orderList', (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Retriving User :' + JSON.stringify(err, undefined, 2)); }
    });

    // db.aggregateSumDemo.aggregate([ {
    //      $group: {
    //         _id: null,
    //         "TotalCount": {
    //            $sum:1
    //         }
    //      }
    //   } ] );
    // //produsul price qty
    // Member.aggregate([
    //     { "$match": { "_id": userid } },
    //     { "$unwind": "$friends" },
    //     { "$match": { "friends.status": 0 } }],
    //     function( err, data ) {
      
    //       if ( err )
    //         throw err;
      
    //       console.log( JSON.stringify( data, undefined, 2 ) );
      
    //     }
    //   );
})

module.exports = router
