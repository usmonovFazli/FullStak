
const User = require('../models/user');
const Request = require('../models/request');

const getAllUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

const getAllRequests = async (req, res) => {
  const requests = await Request.find().populate('user_id', 'username email');
  res.json(requests);
};

const updateRequestStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const updated = await Request.findByIdAndUpdate(id, { status }, { new: true });
  res.json(updated);
};

module.exports = { getAllUsers, getAllRequests, updateRequestStatus };
