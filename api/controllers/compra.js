'use strict'

const DPA = require('../models/dpa'); //importar el modelo del usuario  o lo que son las clases comunes

async function saveComprarProducto(req, res) {
    console.log(" INFORMACION COMPRA ", req.body);
   /* let verificar = await Agente.findOne({where: {COD_AGENTE: req.user.id}, include: {model: Carrito}});
    try {
        if (!verificar) {
            return res.status(500).send({
                message: "No tiene los permisos necesarios"
            });
        } else {

            let carritoGuardado = await Carrito_Producto.create({
                NUM_VARIANTE: req.body.Num_Variante,
                ID_CARRITO: verificar.dataValues.CARRITO.ID_CARRITO,
                CANTIDAD_PRODUCTO_CARRITO: req.body.Cantidad_Producto_Carrito,
                FECHA_CREACION_CARRITO: moment(),
                IMAGEN_MOSTRAR: req.body.Imagen_Mostrar
            });



            if (carritoGuardado) {
                res.status(200).send({
                    data: carritoGuardado,
                    message: "Carrito de compras actualizado correctamente"
                });
            } else {
                res.status(404).send({
                    message: 'No se pudo agregar producto al carrito de comrpas'
                });


            }

        }
    } catch (err) {
        res.status(500).send({
            message: 'error:' + err
        });
    }*/
}


module.exports = {
    saveComprarProducto
};
