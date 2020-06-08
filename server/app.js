require('./config/config');
require('./models/db');
const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const cors = require("cors")
const bodyParser = require('body-parser');
const router = express.Router();

const employeeController = require('./controllers/employeeController.js');
const desertController = require('./controllers/desertController.js');
const drinkController = require('./controllers/drinkController.js');
const foodController = require('./controllers/foodController.js');
const tableController = require('./controllers/tableController');
const reserveController = require('./controllers/reserveController');
const contactUsController = require('./controllers/contactUsController'); 
const orderController = require('./controllers/orderController');
const bindUsersController = require('./controllers/bindUserController');
const bussinessInfoController = require('./controllers/bussinessInfoController');

const app = express();

// middleware
app.use(bodyParser.json());
app.use(express.json())
dotenv.config()

var origin = '*'

app.use((req, res, next) => {
    console.log("head", req.headers);
    if (req.headers.origin) {
        origin = req.headers.origin
    } else {
        origin = "*"
    }
    next();
})
app.use(cors({ credentials: true, origin: origin }));

//dataBase 
mongoose.set('useCreateIndex', true)
mongoose.set("useFindAndModify", false)

/* Routes */
app.use("/api/auth", require("./routes/auth/auth"));
app.use("/api/auth", require("./routes/auth/password"));
app.use("/api/auth", require("./routes/auth/whoami"));

/*Other routes*/
app.use('/employees', employeeController);
//app.use("/api/emp", require("./password/passwordEmp"));
app.use("/api/any", require("./password/passwordBindUsers")); 

app.use('/deserts', desertController);
app.use('/drinks', drinkController);
app.use('/foods', foodController);
app.use('/tables', tableController);
app.use('/reserves', reserveController);
app.use('/messages', contactUsController);
app.use('/orders', orderController);
app.use('/bindUsers', bindUsersController);
app.use('/bussinessInfo', bussinessInfoController);
// app.get('/deserts/:id', desertController.allowIfLoggedIn , desertController);

// error handler
app.use((err, req, res, next) => {
    if (err.name === 'ValidationError') {
        var valErrors = [];
        Object.keys(err.errors).forEach(key => valErrors.push(err.errors[key].message));
        res.status(422).send(valErrors)
    }
    else{
        console.log(err);
    }
});

app.listen(process.env.PORT, () => console.log(`Server started on port : ${process.env.PORT}`));