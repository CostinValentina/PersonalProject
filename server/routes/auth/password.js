const router = require("express").Router()
const Joi = require("joi")
const bcrypt = require("bcrypt")
const verifyToken = require("../../middleware/verifyToken")
const User = require("../../models/User")


/* Allow the signed in user to change their old password */
router.post("/change_password", verifyToken, async (request, response) => {
    const schema = Joi.object({
        oldPassword: Joi.string().required(),
        newPassword: Joi.string().required()
    })

    const { error } = schema.validate(request.body)
    if (error) {
        return response.status(400).send(error.details[0].message)
    }

    /* Make sure old passord is correct */
    const isPasswordCorrect = await bcrypt.compare(request.body.oldPassword, request.user.password)
    if (!isPasswordCorrect) {
        return response.status(400).send("Old password is not correct")
    }

    /* Store password securely with salt and hash */
    const salt = await bcrypt.genSalt(10)
    const hashedNewPassword = await bcrypt.hash(request.body.newPassword, salt)

    /* Update password in database */
    request.user.password = hashedNewPassword
    await request.user.save()

    response.send("Updated your password")
})


module.exports = router