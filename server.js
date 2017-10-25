'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'localhost';

const express = require('express');
const logger = require('morgan');
const users = require('./routes/users');

// App
const app = express();

app.use(logger('combined')); // can be chnged to 'dev' for more simple logging

app.use('/user', users);

app.get('/', (req, res) => {
  res.send('Hello World from a Docker image and Richy!');
});

const port = process.env.LISTEN_PORT || process.env.PORT || 3030;
const server = app.listen(port, () => {
  const env = process.env.NODE_ENV;
  console.log(
    `Hacker-news api is running at http://localhost:${port} with ${env} configuration`
  );
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
