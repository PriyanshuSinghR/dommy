const mongooose = require('mongoose');

const userSchema = new mongooose.Schema({
    name: {
        type: String
    },
    phone: {
        type: Number
    },
    rollNo: {
         type: Number
    }
})

module.exports = mongooose.model('USER', userSchema);;