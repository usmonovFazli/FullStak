
const express = require('express');
const { getAllUsers, getAllRequests, updateRequestStatus } = require('../controllers/adminController');

const router = express.Router();

router.get('/users', getAllUsers);
router.get('/requests', getAllRequests);
router.put('/requests/:id/status', updateRequestStatus);

module.exports = router;
