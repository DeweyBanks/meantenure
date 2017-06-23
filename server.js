var express = require('express');
var stylus = require('stylus');
var logger = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var app = express();

function compile(str, path) {
  return stylus(str).set('filename', path);
}

app.set('views', __dirname + '/server/views');
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(stylus.middleware(
  {
    src: __dirname + '/public',
    compile: compile
  }
));
app.use(express.static(__dirname + '/public'));

mongoose.connect('mongodb://localhost:27017/tenureed');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error...'));
db.once('open', function callback() {
  console.log('tenureed db opened:: ');
});



var messageSchema = mongoose.Schema({message: String});
var Message = mongoose.model('Message', messageSchema);
var mongoMessage = new Message({message: 'Hello mongoDB here'});
mongoMessage.save(function(err, doc) {
    Message.findOne().exec(function(err, messageDoc) {
        mongoMessage = messageDoc.message;
    });
});


app.get('/partials/:partialPath', function(req, res) {
  res.render('partials/' + req.params.partialPath);
});


// the * says to serve index file no matter what the request. this will allow the client side routes to take over
app.get('*', function(req, res) {
  res.render('index', {
    mongoMessage: mongoMessage
  });
});


var port = process.env.PORT || 3030;
app.listen(port);
console.log('Listening on port ' + port + '...');
