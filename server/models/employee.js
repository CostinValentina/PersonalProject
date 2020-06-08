const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmployeeSchema = new Schema({
    name: { type: String },
    email: { type : String,
        required: 'The employee should have a unique email',
        unique: true
    }, 
    salary: { 
        type: Number,
        default: 300
    },
    hireDate: { 
        type: Date,
        default: new Date()
    },
    role:{ 
        type: String,
        default:"Employee"
    },
    sessions: {
        type: Array,
        required: true,
        default: []
    }
});

module.exports = mongoose.model('Employee', EmployeeSchema);

