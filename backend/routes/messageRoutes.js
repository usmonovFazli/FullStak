
const express = require('express');
const multer = require('multer');
const { sendMessage, getMessages } = require('../controllers/messageController');

const router = express.Router();
const upload = multer({ dest: 'uploads/messages' });

router.post('/', upload.single('image'), sendMessage);
router.get('/:user1/:user2', getMessages);

module.exports = router;
