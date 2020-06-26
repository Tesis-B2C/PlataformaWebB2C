'use strict'

//importar el modelo del usuario  o lo que son las clases comunes


async function saveProducto(req, res) {

    try {
        let producto =JSON.parse(req.body.producto);
        let oferta =JSON.parse(req.body.oferta);

        console.log("objetos de productos", req.files);
        console.log("objetos" ,producto,oferta, JSON.parse(req.body.variantes));
        res.status(200).send({
            message: "Producto guardado correctamente"
        });
        /*if (productoGuardado) {
            res.status(200).send({
                message: "Producto guardado correctamente"
            });
        } else {
            res.status(404).send({
                message: 'El producto no ha podido guardarse'
            });


        }*/
    } catch (err) {
        res.status(500).send({
            message: 'error:' + err
        });
    }
}

module.exports = {          // para exportar todas las funciones de este modulo

    saveProducto

};
