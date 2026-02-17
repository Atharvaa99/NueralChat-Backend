const mongoose = require('mongoose');


const promptSchema = mongoose.Schema({
    chat:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'chat',
        required: true
    },
    prompt: {
        type: String,
        required: true
    },
    response:{
        type: String,
        required: true
    },
    model:{
        type: String,
        enum: ['llama3','mixtral','gemma'],
        required: true
    }
})

const promptModel = mongoose.model('prompts_response',promptSchema);

module.exports = promptModel;