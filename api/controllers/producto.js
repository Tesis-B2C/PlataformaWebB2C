'use strict'
import {Oferta} from "../models/oferta";
import {Producto} from "../models/producto";
import{Producto_Categoria} from "../models/producto_categoria"
const moment = require('moment');

async function saveProducto(req, res) {

    try {
        let producto = JSON.parse(req.body.producto);
        let oferta = JSON.parse(req.body.oferta);
        let variantes = JSON.parse(req.body.variantes);
        let vimagenes = JSON.parse(req.body.vimagenes);
        let categorias = JSON.parse(req.body.categorias);
        console.log("imagenes", req.files);
        console.log("objetos",oferta,producto, variantes, vimagenes,categorias);

        let ofertaGuardada = await Oferta.create({
                NUM_TIENDA: oferta.Num_Tienda,
                IVA: oferta.Iva,
                FECHA_CREACION: moment(),
                GARANTIA: oferta.Garantia
            },
            {
                transaction: t
            });

        let productoGuardado = await Producto.create({
                COD_PRODUCTO: producto.Cod_Producto,
                ID_OFERTA: ofertaGuardada.dataValues.ID_OFERTA,
                NOMBRE_PRODUCTO: producto.Nombre_Producto,
                DESCRIPCION_PRODUCTO: producto.Descripcion_Producto,
                DETALLE_PRODUCTO: producto.Detalle_Producto,
                MARCA: producto.Marca,
                LLEVAR_STOCK: producto.Rastrear_Stock,
                VENDER_SIN_STOCK: Vender_Sin_Stock,
                CONDICION: producto.Condicion,
                PESO_PRODUCTO: producto.Peso_Producto
            },
            {
                transaction: t
            });

        let productoCategoriaGuardada = await Producto_Categoria.create({
                ID_PRODUCTO: productoGuardado.dataValues.ID_PRODUCTO,
                COD_PRODUCTO: productoGuardado.dataValues.COD_PRODUCTO,
                ID_CATEGORIA: categorias.ID_CATEGORIA,
            },
            {
                transaction: t
            });



        if (ofertaGuardada && productoGuardado && productoCategoriaGuardada) {
            res.status(200).send({
                data: tiendaGuardado.dataValues,
                message: "Su producto ha sido registrado  exitosamente"
            });

            await t.commit();
        } else {
            res.status(404).send({
                message: "Al parecer hubo probelmas con el registro del producto"
            });
        }

    } catch (err) {
        res.status(500).send({
            message: 'error:' + err
        });
    }
}

module.exports = {          // para exportar todas las funciones de este modulo

    saveProducto

};
