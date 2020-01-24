'use strict'

let bcrypt = require('bcrypt-nodejs');
let moment = require('moment');

const Sequelize= require("sequelize");



// coenxion base

let app = require('./appi');
let mysql = require('mysql2');
let port = process.env.PORT || 3977;

app.listen(port, function () {
    console.log("memsql user", port);
});




