const mongoose = require('mongoose');
const moment = require('moment');
const Schema = mongoose.Schema;

const MessageSchema = new Schema( {
    name: { 
        type: String,
        required: 'You should have a name',
    },
    message: {
        type: String,
        required: 'Write something for us'
    },
    points: {
        type: String,
        default: 'good',
        enum: ['good', 'average', 'bad']
    },
    dateSent : {
        type: Date,
        default: moment().add(3,'h')
    }
});

module.exports = mongoose.model('Message', MessageSchema);