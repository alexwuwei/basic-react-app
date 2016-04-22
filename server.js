'use strict'

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;
const Message = require(__dirname + '/models/messages-model');

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

app.get('api/messages', (req, res) => {
  console.log('get route hit');
  Message.find({}).exec((err, messages) => {
    if (err) throw err;
    res.status(200).json(JSON.parse(messages))
    res.end();
  });
});

app.post('api/messages', (req, res) => {
  req.on('data', (data) => {
    req.body = JSON.parse(data);
    let newMessage = new Message(req.body);
    newMessage.save((err, message) => {
      if (err) throw err;
      res.status(200).json(message);
      res.end();
    })
  })
})

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/db');

app.listen(PORT, () => console.log('listening on 3000'));
