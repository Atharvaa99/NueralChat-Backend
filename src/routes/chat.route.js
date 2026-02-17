const express = require('express');
const chatController = require('../controller/chat.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();



router.get('/all',authMiddleware.authUser, chatController.viewChat);

router.post('/new/message',authMiddleware.authUser, chatController.createPrompt);
router.post('/:chatId/message',authMiddleware.authUser, chatController.createPrompt);
router.get('/:chatId/messages',authMiddleware.authUser, chatController.viewPrompt);
router.delete('/:chatId',authMiddleware.authUser, chatController.deleteChat);

module.exports = router;