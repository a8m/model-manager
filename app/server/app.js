var http = require('http'),
  express = require('express'),
  fs = require('fs'),
  namescpace = require('express-namespace'),
  resource = require('express-resource'),
  app = express();

var iniparser = require('iniparser'),
  config = iniparser.parseSync('config.ini');

//load the route handlers
var routes = require('./routes')(app);

//configuration json file for dev/prod environment
var configFile = require('./config.json')[app.get('env')];


//load the resourceful route handler --- awesome!! handle routing alone
app.resource('users', require('./resource/users.js'));


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


//app.get('/', function(req, res){
//  res.render('index', {title:config.title, message:config.message});
//});


http.createServer(app).listen(config.port, function(){
  console.log('app listen to port %s', config.port);
});
