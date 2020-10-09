'use strict'

var bcrypt = require('bcrypt-nodejs');
var moment = require('moment');
const Sequelize= require("sequelize");

// coenxion base
var app = require('./appi');
var mysql = require('mysql');
var port = process.env.PORT || 3977;


app.listen(port, function () {
    console.log("Servidor corriendo", port);
});




