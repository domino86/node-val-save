const express = require('express');
const bodyParser = require('body-parser');

const Routes = require('./routes');

const app = express();
const port = process.env.NODE_ENV || 5000;

app.set('port', port);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', Routes);

app.listen(port, () => { console.log(`App running on port ${port}`) });
