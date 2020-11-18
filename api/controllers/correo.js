const nodemailer = require('nodemailer');
exports.EnviarCorreo = async (correo, asunto, nombre, token) => {
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
         // text: 'Hola' + nombre + ', Gracias por registrarte en "COMDERO". ' + 'Por favor da clic en el siguiente link para completar la activación: http://localhost:4200/loguin/',
            html: 'Hola<strong> ' + nombre + '</strong>,<br><br>Gracias por registrarte en ' +
                '"COMDERO". Por favor da clic en el siguiente link para completar la activación:<br><br><a ' +
                'href="http://localhost:4200/login/' + token + '">http://localhost:4200/login/</a>'
        };
    } else if (asunto == 'Cambio de contraseña') {
        var mailOptions = {
            from: 'doginotificaciones@gmail.com',
            to: correo,
            subject: asunto,
            text: 'Hola' + nombre + ', Gracias por registrarte en "COMDERO". Porfavor da click en el siguiente link para poder cambiar su contraseña: http://localhost:4200/olvido-contrasenia-paso2/' + token,
            html: 'Hola<strong> ' + nombre + '</strong>,<br><br>Gracias por registrarte en "COMDERO". ' +
                'Porfavor da click en el siguiente link para poder cambiar su contraseña:<br><br>' +
                '<a href="http://localhost:4200/olvido-contrasenia-paso2/' + token + '">' +
                'http://localhost:4200/olvido-contrasenia-paso2/</a>'

        };
    } else if (asunto == 'Cambiar Correo') {
        var mailOptions = {
            from: 'doginotificaciones@gmail.com',
            to: correo,
            subject: asunto,
            text: 'Tu código de verificación es ' + nombre,
        };
    }
// Function to send e-mail to the user

    /* await transporter.sendMail(mailOptions, function (error, response) {

               if(error){
                   console.log(error);
                   res.end("error");
               }else{
                   console.log("Message sent: " + response.message);
                   res.end("sent");
               }
           });*/

    return new Promise(await function (resolve, reject) {
        let resp = false;
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log("Error is " + error);
                resolve(false); // or use rejcet(false) but then you will have to handle errors
            } else {
                console.log('Email sent: ' + JSON.stringify(info));
                resolve(true);
            }
        });
    });
}
