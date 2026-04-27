const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    email : {
        type : String,
        required : true,
    },
    isComplete: {
        type : Boolean,
        default : false,    
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
    }

})

module.exports = mongoose.model("Todo", todoSchema);