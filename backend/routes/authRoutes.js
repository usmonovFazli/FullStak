
const express = require('express');
const multer = require('multer');
const { register, login } = require('../controllers/authController');

const router = express.Router();
const upload = multer({ dest: 'uploads/profile' });

router.post('/register', upload.single('profile'), register);
router.post('/login', login);

module.exports = router;
