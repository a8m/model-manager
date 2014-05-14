var http = require('http'),
  express = require('express'),
  fs = require('fs'),
  app = express();

var iniparser = require('iniparser'),
  config = iniparser.parseSync('config.ini');

//load the route handlers
var routes = require('./routes'),
  user = require('./routes/users');

//configuration json file for dev/prod environment
var configFile = require('./config.json')[app.get('env')];

app.set('view engine', 'jade');
app.set('views', './views');
// app.set('env', 'development');
// or pass the environment in the kick-start:
// NODE_ENV=production node app.js


app.use(express.static('./public'));

if('production' == app.get('env')){
  console.log('production mode');
}else{
  console.log('development mode');
}

app.get('/', function(req, res){
  res.render('index', {title:config.title, message:config.message});
});

app.get('/user/:id', function(req, res){
  res.send('user id: ' + req.params.id);
});

app.get('/say-hello', function(req, res){
  res.render('hello');
});

app.get('/test', routes.index);

app.get('/use-next',
  function(req, res, next){
    res.set('X-one', 'foo');
    next();
  },
  function(req, res, next){
    res.set('X-two', 'bar');
    next();
  },
  function(req, res, next){
    res.send('open debugger and watch headers');
  }
);

app.post('/', function(req,res){
  res.send('/ POST OK');
});


http.createServer(app).listen(config.port, function(){
  console.log('app listen to port %s', config.port);
});
