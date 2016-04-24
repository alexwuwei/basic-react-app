'use strict'

const express     = require('express');
const app         = express();
const mongoose    = require('mongoose');
const fs          = require('fs');
const path        = require('path');
const bodyParser  = require('body-parser');
const PORT        = process.env.PORT || 3000;
const Message     = require(__dirname + '/models/messages-model');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-cache');
  next();
});



app.get('/api/messages', (req, res) => {
  console.log('get route hit');
  Message.find({}).exec((err, messages) => {
    if (err) throw err;
    res.status(200).json(messages);
    // res.end();
  });
});

app.post('/api/messages', (req, res) => {
  // req.on('data', (data) => {
  //   console.log('data is: ', JSON.parse(data));
  //   req.body = JSON.parse(data);
  //   let newMessage = new Message(req.body);
  //   newMessage.save((err, message) => {
  //     if (err) throw err;
  //     res.status(200).json(message);
  //     res.end();
  //   })
  // })
  var newMessage = new Message(req.body);
  newMessage.save(function(err, message) {
    res.status(200).json(message);
  });
});

app.put('/api/messages/:id', (req, res) => {
  console.log('PUT route hit for /customers/:id');
    Message.findByIdAndUpdate({_id: req.params.id}, req.body, (err, message) => {
      if (err) return res.send(err);
      res.json(message);
    });
});

app.delete('/api/messages/:id', (req, res) => {
  console.log('DEL route hit for /customers/', req.params.id);
   Message.findById(req.params.id, (err, message) => {
     message.remove((err, message) => {
       res.json({message: 'message removed'});
     })
   })
})
app.use('/', express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/db');

app.listen(PORT, () => console.log('listening on 3000'));
