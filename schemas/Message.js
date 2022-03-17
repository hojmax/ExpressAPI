const mongoose = require("mongoose")

const messageSchema = new mongoose.Schema({
    senderId: Number,
    recipientId: Number,
    message: String
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message