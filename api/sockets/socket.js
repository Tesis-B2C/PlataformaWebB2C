const chalk = require('chalk');
const {io} = require('../appi.js');

const {Usuarios} = require('../classes/usuarios');

const usuarios = new Usuarios();



io.on('connection', function (client) {
    let {payload} = client.handshake.query;
    let data = JSON.parse(payload);
    if (data) {
        usuarios.agregarPersona(client.id, data.COD_AGENTE, data.TIENDAs);
        client.join(`room_${data.COD_AGENTE}`);
        console.log("------------------Nuevo usuario en la sal",`room_${data.COD_AGENTE}`);

       /* io.in(`room_${data.COD_AGENTE}`).emit("notificacion", usuarios.getPersonas())*/
    }

 /*   client.on('entrarChat', (data, callback) => {

        if (data.COD_AGENTE) {
            usuarios.agregarPersona(client.id, data.COD_AGENTE, data.TIENDAs);
            client.join(`room_${data.COD_AGENTE}`);
            console.log("------------------Nuevo usuario en la sal",data.COD_AGENTE,usuarios.getPersonas());

            //client.broadcast.to(data.COD_AGENTE).emit("lista usuarios", usuarios.getPersonas())
            callback({
                agente:data.COD_AGENTE
            })
        }

    })*/;



    client.on('disconnect', function () {
        usuarios.borrarPersona(client.id);
    });


});

module.exports.vUsuarios=usuarios.getPersonas();


