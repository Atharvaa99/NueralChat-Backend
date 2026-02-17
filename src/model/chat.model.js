const mongoose = require('mongoose');

const chatSchema = mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    title:{
        type: String,
        required: true
    },
    summary:{
        type: String,
        default: null
    }
},{timestamps: true })

const chatModel = mongoose.model('chat',chatSchema);

module.exports = chatModel;