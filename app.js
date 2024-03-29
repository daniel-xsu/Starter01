
/**
 * Module dependencies.
 */

var express = require('express')
    , routes = require('./routes')
    , message = require('./routes/message')
    , http = require('http')
    , path = require('path')
    , url = require('url')
    , fs = require('fs')
    ;

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser({
    keepExtensions: true,
    uploadDir: '/var/www/html/mobile/public/',
    limit: '20mb'
}));
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', routes.home);
app.get('/restful/messages', message.findAllRestful);
app.get('/restful/messages/:id', message.findByIdRestful);
app.get('/messages', message.findAll);
app.get('/messages/:id', message.findById);

app.get('/newmessage', message.addOne);
app.post('/newmessage', message.saveOne);

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
