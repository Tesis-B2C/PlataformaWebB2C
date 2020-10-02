'use strict'

 const jwt = require('jwt-simple');
const moment = require('moment'); // ayuda a que se regisrtere feha de inicio y de expiracion de la creacion del token
const secret = 'clave_secreta_curso';



exports.ensureAuth=function(req, res, next) // comprobar si los datos son correctos del token que nos va a llevar
{


    if(!req.headers.authorization)//  aque verificamos si viene con la cabecera autorizada es decir que corresponda  los daatos
    {
        return res.status(403).send({message:'la peticion no tiene la cabecera de autenticacion'});
    }

    var token = req.headers.authorization.replace( /['"]+/g, '' );

    try
    {
        var payload = jwt.decode(token,secret);
        if(payload.exp <= moment().unix())
        {
            return res.status(401).send({message:'El token a expirado'});
        }

    }catch(ex)
    {
        //console.log(ex);
        return res.status(401).send({message:'token no valido'});
    }

    req.user=payload;// ya lo tiene en la request  un usuario con todols los datos
    next();
}
