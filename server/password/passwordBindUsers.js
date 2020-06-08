const mongoose = require('mongoose');
const router = require("express").Router()
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const BindUsers = require('../models/bindUsers');
const jwtHelper = require('../config/jwtHelperBindUser');

//localhost:3000/api/any/change_password_bindUsers
router.post("/change_password_bindUsers", jwtHelper, async (request, response) => {
   console.log("Parola de schimbat pt any User")
    const schema = Joi.object({
        oldPassword: Joi.string().required(),
        newPassword: Joi.string().required()
    })

    const { error } = schema.validate(request.body)
    if (error) {
        return response.status(400).send(error.details[0].message)
    }

    /* Make sure old passord is correct */
    const isPasswordCorrect = await bcrypt.compare(request.body.oldPassword, request.anyUser.password)
    if (!isPasswordCorrect) {
        return response.status(400).send("Old password is not correct for employee")
    }

    /* Store password securely with salt and hash */
    const salt = await bcrypt.genSalt(10)
    const hashedNewPassword = await bcrypt.hash(request.body.newPassword, salt)

    /* Update password in database */
    request.anyUser.password = hashedNewPassword
    await request.anyUser.save()

    response.status(200).send(JSON.stringify("Updated an user or an employee password"))
})
module.exports = router