const express = require('express');
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;
var { BindUsers } = require('../models/bindUsers');
const Joi = require("joi")
const bcrypt = require("bcrypt")
const jsonwebtoken = require("jsonwebtoken")
const crypto = require("crypto")
var { SecureAPI } = require('../middleware/basicAuth');

//localhost:3000/bindUsers

//cred ca in acest fisier ar trebui sa fie si fct de login si logout
//nu sunt sigura de fct asta
router.post("/login", async (request, response) => {
    const schema = Joi.object({
        email: Joi.string().required().email(),
        password: Joi.string().required()
    })

    const { error } = schema.validate(request.body)
    if (error) {
        return response.status(400).send(error.details[0].message)
    }

    /* Search for a anyUser */
    const query = {
        email: request.body.email
    }

    //anyUser anyUser
    const anyUser = await BindUsers.findOne(query)

    if (anyUser) {
        /* Compare passwords via bcrypt */
        const isPasswordCorrect = await bcrypt.compare(request.body.password, anyUser.password)

        if (isPasswordCorrect) {
            /* Add a new valid session to the database */
            const sessionId = crypto.randomBytes(32).toString("hex")
            anyUser.sessions.push(sessionId)
            await anyUser.save()

            /*
             *
             * Sign the JWT with the user's email address and session ID.
             * The session ID will allow us to revoke JWTs later on.
             * By default, the JWT also has an "iat" field.
             *
             */
            const token = jsonwebtoken.sign({
                email: anyUser.email,
                role: anyUser.role,
                sessionId
            }, process.env.TOKEN_SECRET)
            
            /* Respond with JWT */
            response.json({
                token
            })
        } else {
            response.status(401).send("Wrong email address or password")
        }
    } else {
        response.status(401).send("Wrong email address or password error")
    }
})

router.get('/',SecureAPI("Admin"), (req, res) => {
    BindUsers.find((err, docs) => {
        if (!err) { res.send(docs); }
        else { console.log('Error in Retriving bindUsers:' + JSON.stringify(err, undefined, 2)); }
    });
});

router.get('/:id',(req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    BindUsers.findById(req.params.id, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Retriving bindUsers :' + JSON.stringify(err, undefined, 2)); }
    });
});

router.post('/', (req, res) => {
    var bindUser = new BindUsers({
        email: req.body.email,
        password: req.body.password,
        role: req.body.role
    });

    bindUser.save((err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in bindUser Save :' + JSON.stringify(err, undefined, 2)); }
    });
});

//cred ca nu am nevoie
router.put('/:id',(req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    var bindUser = new BindUsers({
        email: req.body.email,
        password: req.body.password,
        role: req.body.role
    });
    BindUsers.findByIdAndUpdate(req.params.id, { $set: bindUser }, { new: true }, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in bindUsers Update :' + JSON.stringify(err, undefined, 2)); }
    });
});

router.delete('/:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    BindUsers.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in bindUser Delete :' + JSON.stringify(err, undefined, 2)); }
    });
});

//nu cred ca ar trebui inclusa
router.delete('/', (req, res) =>{
    BindUsers.remove((err, doc) =>{
        if (!err) { res.send(doc); }
        else { console.log('Error in Deleting all BindUsers :' + JSON.stringify(err, undefined, 2)); }
    })
});

module.exports = router;