const express = require('express');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser')
const app = express();
const port = 3000;
const router = require('./routes/routes');
const cors = require("cors")
//Middlewares
app.use(morgan('dev'));
app.use(cors())
const jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(express.json());
// Routes

app.use(router);
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'public','index.html'))
});
// Static Content
app.use(express.static(path.join(__dirname,'public')));

app.listen(port, () => {
  console.log('[Server] Listening on port:', port);
});
