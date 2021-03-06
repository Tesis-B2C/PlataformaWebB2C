'Use strict'

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
const path = require('path');
const chalk = require('chalk');
//Notificaciones
const  socketIO = require('socket.io');


//--------------------------------------servidor
var fs = require('fs');
var https = require('https');
const PORT = 5000;


let server =https.createServer({
    key: fs.readFileSync('/etc/server.key'),
    cert: fs.readFileSync('/etc/comdero_com.crt')
}, app).listen(PORT, function(){
    console.log('\n')
    console.log(`>> Socket listo y escuchando por el puerto: ${chalk.green('5000')}`)
});

let io=socketIO(server);
module.exports.io=socketIO(server);

//---------------------------------------- local
/*const http= require('http');
let server =http.createServer(http);
let io=socketIO(server);

module.exports.io=socketIO(server);*/






require('./sockets/socket');

//cargar Rutas

var dpa_rutas = require('./routes/dpa');
var agente_rustas = require('./routes/agente');
var categoria_rutas = require('./routes/categoria');
var unidad_medida_rutas = require('./routes/unidad_medida');
var producto_rutas=require('./routes/producto');
var metodo_pago_rutas=require('./routes/metodo_pago');
var tienda_rutas = require('./routes/tienda');
var metodo_envio_rutas=require('./routes/metodo_envio');
var descuento_rutas=require('./routes/descuento');
var correo_rutas=require('./routes/correo');
var carrito_rutas=require('./routes/carrito');
var compra_rutas=require('./routes/compra');
var valoracion_rutas=require('./routes/valoracion');
var estadisticas_rutas=require('./routes/estadisticas');
var notificaciones_rutas=require('./routes/notificacion');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); //convertir a json als peticiones

//configurar cabeceras http
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
 
    next();
});

// rutas base

app.use('/api', dpa_rutas);
app.use('/api',agente_rustas);
app.use('/api',categoria_rutas);
app.use('/api',unidad_medida_rutas);
app.use('/api',producto_rutas);
app.use('/api', metodo_pago_rutas);
app.use('/api',tienda_rutas);
app.use('/api',metodo_envio_rutas);
app.use('/api',descuento_rutas);
app.use('/api',correo_rutas);
app.use('/api',carrito_rutas);
app.use('/api',compra_rutas);
app.use('/api',valoracion_rutas);
app.use('/api',estadisticas_rutas);
app.use('/api',notificaciones_rutas);

app.use('/uploads/tiendas',express.static(path.resolve('uploads/tiendas')));
app.use('/uploads/productos',express.static(path.resolve('uploads/productos')));
//app.use('/api', administrador_rutes);
/*app.use('/api', user_routes);
app.use('/api', nuevaOferta_routes);
app.use('/api', administrador_rutes);
app.use('/api',email);*/

//app.use('/api',paypal);



//----------------------------------------- local
/*
server.listen(5000, function () {
    console.log('\n')
    console.log(`>> Socket listo y escuchando por el puerto: ${chalk.green('5000')}`)
});
*/


module.exports = app; // hace referencia a la variable de express

