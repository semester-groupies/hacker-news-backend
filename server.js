'use strict';

/**
 * Module dependencies.
 */
const express = require('express');


const client = require('prom-client');
const errorHandler = require('errorhandler');
const logger = require('morgan');
const bodyParser = require('body-parser');
var cors = require('cors');
/**
 * Controllers (route handlers).
 */
const index = require('./routes/index');
const story = require('./routes/post');
const users = require('./routes/users');
const status = require('./routes/status');

/**
 * Create Express server.
 */
const app = express();
app.use(cors());
var addJsonHeaders = function (req, res, next) {
    req.headers['content-type'] = 'application/json';
    // res.setHeader('Content-Type', 'application/json');
    next();
}
// app.use(cors());
app.use(addJsonHeaders);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/', index);
app.use('/user', users);
app.use('/status', status);
app.use('/post', story);
/*
app.get('/', (req, res) => {
  res.send('Hello World from a Docker image and Richy!');
});*/
app.use(express.static('apidoc'));
/**
 * Express configuration.
 */
app.set('host', process.env.NODE_ENV || 'localhost');
//todo set digital ocean port in configuration
app.set('port', 8090);
app.use(logger('dev'));
process.on('exit', function () {
    console.log('About to exit.');
});
/**
 * Error Handler.
 */
app.use(errorHandler());

/**
 * Prometheus metrics
 */
const register = new client.Registry();
const histogram = new client.Histogram({
	name: 'backend_histogram',
	help: 'metric_help',
	labelNames: ['code']
});
/**
 * Elk stack
 */
var log4jsLogger = require('./log4js.js').fileAll;
var log4jsLoggerInfo = require('./log4js.js').fileInfo;

setTimeout(() => {
	histogram.labels('200').observe(Math.random());
	histogram.labels('300').observe(Math.random());

}, 10);

app.get('/metrics', (req, res) => {
	res.set('Content-Type', register.contentType);
	res.end(register.metrics());
});

// setInterval(()=>{
// 	console.log(process.memoryUsage())
// },10000);

//Enable collection of default metrics
client.collectDefaultMetrics({register});

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
    console.log(
        `Hacker-news api is running at http://localhost:${app.get('port')} with ${app.get('host')} configuration`
    );
})
;

module.exports = app;

