var express = require('express');
var stylus = require('stylus');
var logger = require('morgan');
var bodyParser = require('body-parser');
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

app.get('/partials/:partialPath', function(req, res) {
  res.render('partials/' + req.params.partialPath);
});


// the * says to serve index file no matter what the request. this will allow the client side routes to take over
app.get('*', function(req, res){
  res.render('index');
});


var port = 3000;
app.listen(port);
console.log('Listening on port ' + port + '...');
