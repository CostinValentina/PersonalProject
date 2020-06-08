const jwt = require('jsonwebtoken');
var { BindUsers} = require("../models/bindUsers")

/* Make sure that the JWT's employee exists and session is not expired */
module.exports = async function (request, response, next) {
    let auth = request.headers.authorization

    if (auth) {
        auth = auth.replace("Bearer ", "")

        /* Decode the JWT to get information inside */
        const result = jwt.verify(auth, process.env.TOKEN_SECRET)

        const query = {
            email: result.email
        }

        const anyUser = await BindUsers.findOne(query)

        /* Check if the employee exists, and if the session is not expired */
        if (anyUser) {
            // if (employee.sessions.includes(body.sessionId)) {
            //     /*
            //      *
            //      * Make note of this: in routes with this middleware, you can access
            //      * the employee's document by using request.employee!
            //      * 
            //      * Asa pot sa iau toate informatiile despre un employee logat  !!!!!!!
            //      */
            //     request.employee = employee

            //     next()
            // } else {
            //     response.status(401).send("Authorization expired")
            // }
            request.anyUser = anyUser

            next()
        } else {
            response.status(401).send("Authorization does not exist")
        }
    } else {
        response.status(401).send("No such user")
    }
}
