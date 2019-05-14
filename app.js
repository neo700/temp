var express = require('express');   
var logger = require('morgan')
var bodyParser = require('body-parser');
var path = require('path');
var book = require('./routes/book.js');
var auth = require('./routes/auth');
var mongoose = require('mongoose');

mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://ecko:euro4san@ds155076.mlab.com:55076/ecko',{
    useNewUrlParser: true,
    promiseLibrary : require('bluebird')})
    .then(()=> console.log('connection is successful'))
    .catch((err)=> console.error(err));

var app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'build')));
app.use('/api/book', book);
app.use('/api/auth', auth);

app.use(function(req,res,next){
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function(err,req,res,next){
    // set locals to providing errors in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.json('error');

});

module.exports = app;
