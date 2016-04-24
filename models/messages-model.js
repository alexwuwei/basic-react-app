'use strict';

const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
  author: {type: String, required: true},
  text: String
}, { versionKey: false });

var Message = mongoose.model('Message', messageSchema);
module.exports = Message;
