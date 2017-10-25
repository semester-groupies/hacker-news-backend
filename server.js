'use strict';

/**
 * Module dependencies.
 */
const express = require('express');
const errorHandler = require('errorhandler');
const logger = require('morgan');


/**
 * Controllers (route handlers).
 */
 const index = require('./routes/index');
const users = require('./routes/users');

/**
 * Create Express server.
 */
const app = express();

app.use('/', index);
app.use('/user', users);
/*
app.get('/', (req, res) => {
  res.send('Hello World from a Docker image and Richy!');
});*/

/**
 * Express configuration.
 */
app.set('host', process.env.NODE_ENV || 'localhost');
//todo set digital ocean port in configuration
app.set('port', process.env.PORT || process.env.DIGITAL_OCEAN_PORT || 8080);
app.use(logger('dev'));

/**
 * Error Handler.
 */
app.use(errorHandler());

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
  console.log(
    `Hacker-news api is running at http://localhost:${app.get('port')} with ${app.get('host')} configuration`
  );
});

module.exports = app;

