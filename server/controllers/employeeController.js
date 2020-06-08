const express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const jsonwebtoken = require("jsonwebtoken")
var ObjectId = require('mongoose').Types.ObjectId;
const verifyToken2 = require("../middleware/verifyToken2")
const crypto = require("crypto")
const Employee  = require('../models/employee');
const Joi = require("joi")
const { BindUsers } = require('../models/bindUsers');
var { SecureAPI } = require('../middleware/basicAuth');

// => localhost:3000/employees/
router.post("/emp/login", async (request, response) => {
    const schema = Joi.object({
        email: Joi.string().required().email(),
        password: Joi.string().required()
    })

    const { error } = schema.validate(request.body)
    if (error) {
        return response.status(400).send(error.details[0].message)
    }

    /* Search for a employee */
    const query = {
        email: request.body.email
    }

    const employee = await Employee.findOne(query)

    if (employee) {
        /* Compare passwords via bcrypt */
        const isPasswordCorrect = await bcrypt.compare(request.body.password, employee.password)

        if (isPasswordCorrect) {
            /* Add a new valid session to the database */
            // const sessionId = crypto.randomBytes(32).toString("hex")
            // employee.sessions.push(sessionId)
            await employee.save()

            /*
                *
                * Sign the JWT with the employee's email address and session ID.
                * The session ID will allow us to revoke JWTs later on.
                * By default, the JWT also has an "iat" field.
                *
                */
            const token = jsonwebtoken.sign({
                email: employee.email,
                role: employee.role,
                // sessionId
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

/* Create a new employee with a unique email and a password */
router.post("/emp/signup", SecureAPI("Admin"), async (request, response) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        password: Joi.string().required(),
        salary: Joi.number(),
        hireDate: Joi.date()
    })

    const { error } = schema.validate(request.body)
    if (error) {
        return response.status(400).send(error.details[0].message)
    }

    /* Store password securely with salt and hash */
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(request.body.password, salt)

    const newEmployee = new Employee({
        name: request.body.name,
        email: request.body.email,
        salary: request.body.salary,
        hireDate: request.body.hireDate
    })

    /* Build indexes to ensure unique constraint is enforced */
    await Employee.init()

    try {
        /* Write to database */
       const employee = await newEmployee.save()
     //  await employee.save()
   
        const bindUser = new BindUsers({
            email: request.body.email,
            password: hashedPassword,
            role: employee.role
        });
           
        await bindUser.save();
        
        response.status(200).send(JSON.stringify(`Signed up as ${employee.email}`))
        
    } catch (e) {
        console.log("e =>", e)
        response.status(400).send(JSON.stringify(`Could not sign up as ${request.body.email} Duplicate email`))
    }
})

////////////////////////////////////////////////////////////////
router.get('/',SecureAPI("Admin"), (req, res) => {
    Employee.find((err, docs) => {
        if (!err) { res.send(docs); }
        else { console.log('Error in Retriving Employees :' + JSON.stringify(err, undefined, 2)); }
    });
});

router.get('/:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    Employee.findById(req.params.id, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Retriving Employee :' + JSON.stringify(err, undefined, 2)); }
    });
});

router.put('/:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    var emp = {
        name: req.body.name,
        email: req.body.email,
        salary: req.body.salary,
        hireDate: req.body.hireDate
    };
    Employee.findByIdAndUpdate(req.params.id, { $set: emp }, { new: true }, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Employee Update :' + JSON.stringify(err, undefined, 2)); }
    });
});

router.delete('/:id',SecureAPI("Admin"), (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    Employee.findById(req.params.id,{email:1}, function(err, resEmp){
        if(err){
            return res.send(err);
        }else if(resEmp){
            Employee.remove({_id: resEmp._id}, function(err, resRemEmp){
            if(err){
                return res.send(err);
            }else{
        // console.log(resRemEmp);
                if(resEmp.email){
                    BindUsers.remove({email: resEmp.email}, function(err, resRemBindUsers){
                    if(err){
                    return res.send(err);
                    }else{
                    //console.log(resRemBindUsers);
                    return res.send('employee delete from Employee and BindUser');
                }
            });
        }else{
            return res.send('employee delete from Employee but email not exists');
        }
        }
        });
        }else{
            return res.send('No employee found this id');
        }
     });
});

module.exports = router;