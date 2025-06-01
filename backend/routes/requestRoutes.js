
const express = require('express');
const multer = require('multer');
const { create, getAll } = require('../controllers/requestController');

const router = express.Router();
const upload = multer({ dest: 'uploads/requests' });

router.post('/', upload.single('image'), create);
router.get('/', getAll);

module.exports = router;
