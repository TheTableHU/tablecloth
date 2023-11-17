const http = require("http");
const express = require("express");
const morgan = require("morgan");
const expressSession = require ("express-session")
const expressHandlebars = require("express-handlebars");

const config = require("./config.js");
//const db = require("./db.js");
const logger = require("./logger.js");

const app = express();

//Logging
app.use(morgan(config.morganFormat, { stream: logger.httpStream }));

//Rendering
app.engine('hbs', expressHandlebars.engine({ defaultLayout: null, extname: '.hbs' }));

//Session
app.use(expressSession({
    secret: config.sessionSecret,
    saveUninitialized: false,
    resave: false,
}));

//Features

//Last effort to try to find a file to serve

//Return Not Found
app.use((req, res) => {
    res.status(404);
    res.type('text/plain')
    res.send('Not found');
});

module.exports = app;

const server = http.createServer(app);

server.listen(config.httpPort, () =>{
    logger.info("Server listening on port " + config.httpPort);
})