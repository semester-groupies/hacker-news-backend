'use strict';

const express = require('express');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();
app.get('/', (req, res) => {
  res.send('Hello World from a Restarted app built from a Docker image! With a whole team but Richie is still the Bum\n');
});

app.listen(PORT, HOST);

console.log(`Running on http://${HOST}:${PORT}`);