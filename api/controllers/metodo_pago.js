'use strcit'

//importar el modelo del usuario  o lo que son las clases comunes


async function saveMetodoPago(req, res) {
    console.log("objetos de productos", req.body.params);
    try {

    } catch (err) {
        res.status(500).send({
            message: 'error:' + err
        });
    }
}

module.exports = {          // para exportar todas las funciones de este modulo

    saveMetodoPago

};
