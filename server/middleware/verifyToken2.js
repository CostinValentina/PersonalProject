const jsonwebtoken = require("jsonwebtoken")
//const Employee = require("../models/Employee")

/* Make sure that the JWT's employee exists and session is not expired */
module.exports = async function (request, response, next) {
    let auth = request.headers.authorization

    if (auth) {
        auth = auth.replace("Bearer ", "")

        /* Decode the JWT to get information inside */
        const body = jsonwebtoken.verify(auth, process.env.TOKEN_SECRET)

        const query = {
            email: body.email
        }

        const employee = await Employee.findOne(query)

        /* Check if the employee exists, and if the session is not expired */
        if (employee) {
            if (employee.sessions.includes(body.sessionId)) {
                /*
                 *
                 * Make note of this: in routes with this middleware, you can access
                 * the employee's document by using request.employee! Very convenient.
                 * 
                 */
                request.employee = employee

                next()
            } else {
                response.status(401).send("Authorization expired")
            }
        } else {
            response.status(401).send("Authorization does not exist")
        }
    } else {
        response.status(401).send("Authorization required")
    }
}
