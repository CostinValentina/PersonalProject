const mongoose = require('mongoose');
const User = require('./User');
//const Employee =  require('./Employee');

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (!err) { console.log('MongoDB connection succeeded.'); }
    else { console.log('Error in MongoDB connection : ' + JSON.stringify(err, undefined, 2)); }
}, {useMongoClient: true}
);

const db = {
    User, //Employee
}
module.exports = db;

require('./User');
