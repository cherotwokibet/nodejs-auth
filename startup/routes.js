const express = require('express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const path = require('path');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

const users = require('../routes/users');
const home = require('../routes/home');


module.exports = function(app) {
    app.set('views', path.join('./', 'views'));
    app.set('view engine', 'jade');

    //app.use(express.json());
    app.use('/',home);
    app.use('/users',users);

    //app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(expressValidator({
        errorFormatter: function(param, msg, value) {
            var namespace = param.split('.')
            , root    = namespace.shift()
            , formParam = root;
        
            while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
            }
            return {
            param : formParam,
            msg   : msg,
            value : value
            };
        }
        }));

    app.use(cookieParser());
    app.use(express.static(path.join('./', 'public')));
    app.use(flash());
  }