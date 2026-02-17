const chatModel = require('../model/chat.model');
const promptModel = require('../model/prompt-response.model');
const mongoose = require('mongoose');
const modelResponse = require('../services/groq.service');


async function deleteChat(req, res) {

    const chatId = req.params.chatId;

    try {
        await chatModel.findByIdAndDelete(chatId);

        await promptModel.deleteMany({
            chat: chatId
        });

        res.status(200).json({
            message: 'Chat delted Successfully'
        })
    } catch (err) {

        return res.status(503).json({
            message: 'Failed to delete Chat'
        })
    }

}

async function viewChat(req, res) {

    try {
        const chats = await chatModel.find({ user: req.user.id })
            .sort({ createdAt: -1 })

        res.status(200).json({
            message: 'Chats fetched successfully',
            chats
        })
    } catch (err) {
        res.status(503).json({
            message: 'Failed to fetch chats'
        })
    }
}

async function createPrompt(req, res) {

    const chatId = req.params.chatId;
    const { prompt, model } = req.body;

    try {

        let chat;
        if (chatId === 'new'|| !mongoose.Types.ObjectId.isValid(chatId)) {

            const title = prompt.split(' ').slice(0, 5).join(' ') + '...';

            chat = await chatModel.create({
                user: req.user.id,
                title,
                summary: null
            });

        } else {
            chat = await chatModel.findById(chatId);
            if (!chat) {
                return res.status(404).json({
                    message: "Can't find chat enter correct id."
                })
            }
        }

        const recentMessages = await promptModel.find({ chat: chatId })
            .sort({ createdAt: - 1 })
            .limit(10)
            .sort({ createdAt: 1 });

        const messages = [];

        if (chat.summary) {

            messages.push({
                role: 'user',
                content: `Previous conversation summary: ${chat.summary}`
            });
            messages.push({
                role: 'assistant',
                content: 'I understand the context of our previous conversation'
            })
        }

        recentMessages.forEach(msg => {
            messages.push({ role: 'user', content: msg.prompt }),
                messages.push({ role: 'assistant', content: msg.response })
        });

        messages.push({ role: 'user', content: prompt });

        const response = await modelResponse(model, messages);

        const messageCount = await promptModel.countDocuments({ chat: chatId });

        if (messageCount > 0 && messageCount % 10 === 0) {
            const summaryMessage = [
                ...messages,
                { role: 'assistant', content: response },
                { role: 'user', content: 'Summarize our conversation in 3-4 sentences' }
            ];

            const summary = await modelResponse(model, summaryMessage);
            await chatModel.findByIdAndUpdate(chat._id, { summary });
        }

        await promptModel.create({
            chat: chat._id,
            prompt,
            response,
            model
        });

        res.status(201).json({
            message: 'Response generated successfully',
            chatId: chat._id,
            title: chat.title,
            response
        })


    } catch (err) {
        console.log('Error:', err);
        return res.status(503).json({
            message: 'Failed to generate response'
        })
    }
}

async function viewPrompt(req, res) {

    const chatId = req.params.chatId;
    try {
        const prompts = await promptModel.find({ chat: chatId })
            .sort({ createdAt: 1 })

        res.status(200).json({
            message: 'Fetched all chats successfully',
            prompts
        })
    } catch (err) {
        console.log(err);
        res.status(503).json({
            message: 'Failed to fetch all chats'
        })
    }
}

module.exports = { deleteChat, viewChat, createPrompt, viewPrompt }