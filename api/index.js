'use strict'

var bcrypt = require('bcrypt-nodejs');
var moment = require('moment');
const Sequelize= require("sequelize");

// coenxion base
var app = require('./appi');
var mysql = require('mysql');


// ----------local
/*
var port = process.env.PORT || 3977;
app.listen(port, function () {
    console.log("Servidor corriendo", port);
});

*/



//----------------------servidor


var fs = require('fs');
var https = require('https');
const PORT = 445;


https.createServer({
    key: fs.readFileSync('/etc/server.key'),
    cert: fs.readFileSync('/etc/comdero_com.crt')
}, app).listen(PORT, function(){
    console.log("My https server listening on port " + PORT + "...");
});






