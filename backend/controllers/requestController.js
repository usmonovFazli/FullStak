
const Request = require('../models/request');

const create = async (req, res) => {
  const userId = req.body.userId;
  const text = req.body.text;
  const imagePath = req.file ? '/' + req.file.path.replace('\\', '/') : null;

  const newRequest = new Request({ user_id: userId, text, image_path: imagePath });
  await newRequest.save();

  res.status(201).json({ message: 'Request created', request: newRequest });
};

const getAll = async (req, res) => {
  const requests = await Request.find().populate('user_id', 'username email');
  res.json({ requests });
};

module.exports = { create, getAll };
