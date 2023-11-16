const http = require("http");
const app = require("./app");
const config = require("./config.js");
const server = http.createServer(app);
//const db = require("./db.js");
const logger = require("./logger.js");

server.listen(config.httpPort, () =>{
    logger.info("Server listening on port " + config.httpPort);
})