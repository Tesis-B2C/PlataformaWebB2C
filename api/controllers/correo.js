const nodemailer = require('nodemailer');
exports.EnviarCorreo = (correo, asunto, Nombre, token) => {
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'doginotificaciones@gmail.com',
            pass: 'dogi12345.'
        }
    });

    if (asunto == 'Activación de cuenta') {
        var mailOptions = {
            from: 'doginotificaciones@gmail.com',
            to: correo,
            subject: asunto,
            text: 'Hola' + Nombre + ', Gracias por registrarte en "COMDERO". ' + 'Porfavor da click en el siguiente link para completar la activacion: http://localhost:4200/loguin/',
            html: 'Hola<strong> ' + Nombre + '</strong>,<br><br>Gracias por registrarte en ' +
                '"COMDERO". Porfavor da click en el siguiente link para completar la activacion:<br><br><a ' +
                'href="http://localhost:4200/loguin/' + token + '">http://localhost:4200/loguin/</a>'
        };
    } else if (asunto == 'Cambio de contraseña') {
        var mailOptions = {
            from: 'doginotificaciones@gmail.com',
            to: correo,
            subject: asunto,
            text: 'Hola' + Nombre + ', Gracias por registrarte en "COMDERO". Porfavor da click en el siguiente link para poder cambiar su contraseña: http://localhost:4200/olvido-contrasenia-paso2/' + TOKENTEMPORAL,
            html: 'Hola<strong> ' + Nombre + '</strong>,<br><br>Gracias por registrarte en "COMDERO". Porfavor da click en el siguiente link para poder cambiar su contraseña:<br><br><a href="http://localhost:4200/olvido-contrasenia-paso2/' + TOKENTEMPORAL + '">http://localhost:4200/olvido-contrasenia-paso2/</a>'

        };
    }
// Function to send e-mail to the user
    transporter.sendMail(mailOptions, function (error) {

        if (error) {

            return "error"
        } else {

            return "success"
        }
    });

}


