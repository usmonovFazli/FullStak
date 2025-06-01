
const Message = require('../models/message');

const sendMessage = async (req, res) => {
  const { senderId, receiverId, message } = req.body;
  const imagePath = req.file ? '/' + req.file.path.replace('\\', '/') : null;

  const newMessage = new Message({
    sender_id: senderId,
    receiver_id: receiverId,
    message,
    image_path: imagePath
  });
  await newMessage.save();

  res.status(201).json({ message: 'Message sent', data: newMessage });
};

const getMessages = async (req, res) => {
  const { user1, user2 } = req.params;
  const messages = await Message.find({
    $or: [
      { sender_id: user1, receiver_id: user2 },
      { sender_id: user2, receiver_id: user1 }
    ]
  }).sort('created_at');

  res.json({ messages });
};

module.exports = { sendMessage, getMessages };
