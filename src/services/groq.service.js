const Groq = require('groq-sdk');

const client = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

const MODELS = {
    llama3: 'llama-3.3-70b-versatile',      
    llama3fast: 'llama-3.1-8b-instant'    
}

async function modelResponse(model,messages) {
    const response = await client.chat.completions.create({
        model: MODELS[model],
        messages
    })
    
    return response.choices[0].message.content;
}

module.exports = modelResponse;

