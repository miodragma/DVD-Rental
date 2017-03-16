var express = require('express');
var path = require('path');
var logger = require('morgan');

var app = express();

app.use(logger('dev'));

app.use(express.static(__dirname + '/public'));

var router = require('./routes/router');
app.use('/router', router);

app.use('/', router);
app.use(function (req, res, next) {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});
app.listen(3000, function () {
    console.log("app started on port 3000")
});
