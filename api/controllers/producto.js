'use strict'
const Imagen_Producto = require("../models/imagen_producto");

const Oferta = require("../models/oferta");
const Producto = require("../models/producto");
const Producto_Categoria = require("../models/producto_categoria");
const Variante = require("../models/variante");
const Categoria = require("../models/categoria");
const moment = require('moment');
const db = require('../database/db');
const fs = require('fs-extra');
const path = require('path');

async function saveProducto(req, res) {
    const t = await db.sequelize.transaction({autocommit: false});
    const vvariantesGuardas = [];
    try {
        let producto = JSON.parse(req.body.producto);
        let oferta = JSON.parse(req.body.oferta);
        let variantes = JSON.parse(req.body.variantes);
        let vimagenes = JSON.parse(req.body.vimagenes);
        let categorias = JSON.parse(req.body.categorias);
        console.log("imagenes", req.files);
        console.log("objetos", oferta, producto, variantes, vimagenes, categorias);

        let ofertaGuardada = await Oferta.create({
                NUM_TIENDA: oferta.Num_Tienda,
                IVA: oferta.Iva,
                FECHA_CREACION: moment(),
                GARANTIA: oferta.Garantia,
                ESTADO_OFERTA: oferta.Estado_Oferta,
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
                VENDER_SIN_STOCK: producto.Vender_Sin_Stock,
                CONDICION: producto.Condicion,
                PESO_PRODUCTO: producto.Peso_Producto
            },
            {
                transaction: t
            });

        for (const c of categorias) {
            await Producto_Categoria.create({
                    ID_PRODUCTO: productoGuardado.dataValues.ID_PRODUCTO,
                    COD_PRODUCTO: productoGuardado.dataValues.COD_PRODUCTO,
                    ID_CATEGORIA: c,
                },
                {
                    transaction: t
                });

        }


        for (let v of variantes) {
            let variantesGuardadas = await Variante.create({
                ID_PRODUCTO: productoGuardado.dataValues.ID_PRODUCTO,
                COD_PRODUCTO: productoGuardado.dataValues.COD_PRODUCTO,
                COLOR: v.Color,
                TALLA: v.Talla,
                MATERIAL: v.Material,
                PRECIO_UNITARIO: v.Precio_Unitario,
                STOCK: v.Stock,
                MEDIDA: v.Cod_Unidad,
                ESTADO_VARIANTE:v.Estado_Variante
            }, {
                transaction: t
            });
            vvariantesGuardas.push(variantesGuardadas);

        }

        for (let i = 0; i < vvariantesGuardas.length; i++) {
            for (let j = 0; j < vimagenes[i].length; j++) {
                for (let h = 0; h < req.files.length; h++) {
                    if (vimagenes[i][j].Nombre_Imagen == req.files[h].originalname) {
                        vimagenes[i][j].Imagen = req.files[h].path;
                    }
                }
            }
        }
        for (let i = 0; i < vvariantesGuardas.length; i++) {
            for (let j = 0; j < vimagenes[i].length; j++) {
                console.log(vimagenes[i][j].Tamanio_Imagen);
                await Imagen_Producto.create({
                    NUM_VARIANTE: vvariantesGuardas[i].dataValues.NUM_VARIANTE,
                    NOMBRE_IMAGEN: vimagenes[i][j].Nombre_Imagen,
                    TIPO_IMAGEN: vimagenes[i][j].Tipo_Imagen,
                    IMAGEN: vimagenes[i][j].Imagen,
                    TAMANIO_IMAGEN: vimagenes[i][j].Tamanio_Imagen,

                }, {
                    transaction: t
                });
            }
        }


        if (ofertaGuardada && productoGuardado) {
            res.status(200).send({
                message: "Su producto ha sido registrado  exitosamente"
            });

            await t.commit();
        } else {
            res.status(404).send({
                message: "Al parecer hubo probelmas con el registro del producto"
            });
        }

    } catch (err) {
        for (let h = 0; h < req.files.length; h++) {
            if (fs.exists(path.resolve(req.files[h].path))) {
                console.log('existe');
                await fs.unlink(path.resolve(req.files[h].path));
            }
        }

        await t.rollback();
        res.status(500).send({
            message: 'error:' + err
        });
    }
}


async function getMisProductos(req, res) {
    try {
        let productosObtenidas = await Oferta.findAll({where: {NUM_TIENDA: req.params.id}, include: {model: Producto}});

        if (productosObtenidas.length) {
            res.status(200).send({
                data: productosObtenidas,
                message: "Productos cargadas correctamente"
            });
        } else {
            res.status(404).send({
                message: 'Al parecer no se encuentra productos registrados en la base de datos'
            });


        }
    } catch (err) {
        res.status(500).send({
            message: 'error:' + err
        });
    }

}


async function getProducto(req, res) {
    try {
        let productoObtenido = await Oferta.findOne({
            where: {ID_OFERTA: req.params.id},
            include: {
                model: Producto,
                include: [{
                    model: Variante,
                    separate: true,
                    order: [['NUM_VARIANTE', 'ASC']],
                    include: {model: Imagen_Producto, separate: true, order: [['ID_IMAGEN', 'ASC']]}
                }, {
                    model: Producto_Categoria,
                    include: {model: Categoria}
                }],

            },

        });

        if (productoObtenido) {
            res.status(200).send({
                data: productoObtenido,
                message: "Producto cargado correctamente"
            });
        } else {
            res.status(404).send({
                message: 'Al parecer no se encuentra el producto registrado en la base de datos'
            });


        }
    } catch (err) {
        res.status(500).send({
            message: 'error:' + err
        });
    }

}

async function updateProducto(req, res) {
    const t = await db.sequelize.transaction({autocommit: false});
    const vvariantesGuardas = [];
    try {
       let producto = JSON.parse(req.body.producto);
        let oferta = JSON.parse(req.body.oferta);
        let variantes = JSON.parse(req.body.variantes);
        let vimagenes = JSON.parse(req.body.vimagenes);
        let categorias = JSON.parse(req.body.categorias);
        console.log("imagenes", req.files);
        console.log("objetos", oferta, producto, variantes, vimagenes, categorias);

     /*   let ofertaGuardada = await Oferta.create({
                NUM_TIENDA: oferta.Num_Tienda,
                IVA: oferta.Iva,
                FECHA_CREACION: moment(),
                GARANTIA: oferta.Garantia,
                ESTADO_OFERTA: oferta.Estado_Oferta,
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
                VENDER_SIN_STOCK: producto.Vender_Sin_Stock,
                CONDICION: producto.Condicion,
                PESO_PRODUCTO: producto.Peso_Producto
            },
            {
                transaction: t
            });

        for (const c of categorias) {
            await Producto_Categoria.create({
                    ID_PRODUCTO: productoGuardado.dataValues.ID_PRODUCTO,
                    COD_PRODUCTO: productoGuardado.dataValues.COD_PRODUCTO,
                    ID_CATEGORIA: c,
                },
                {
                    transaction: t
                });

        }


        for (let v of variantes) {
            let variantesGuardadas = await Variante.create({
                ID_PRODUCTO: productoGuardado.dataValues.ID_PRODUCTO,
                COD_PRODUCTO: productoGuardado.dataValues.COD_PRODUCTO,
                COLOR: v.Color,
                TALLA: v.Talla,
                MATERIAL: v.Material,
                PRECIO_UNITARIO: v.Precio_Unitario,
                STOCK: v.Stock,
                MEDIDA: v.Cod_Unidad,
                ESTADO_VARIANTE:v.Estado_Variante
            }, {
                transaction: t
            });
            vvariantesGuardas.push(variantesGuardadas);

        }

        for (let i = 0; i < vvariantesGuardas.length; i++) {
            for (let j = 0; j < vimagenes[i].length; j++) {
                for (let h = 0; h < req.files.length; h++) {
                    if (vimagenes[i][j].Nombre_Imagen == req.files[h].originalname) {
                        vimagenes[i][j].Imagen = req.files[h].path;
                    }
                }
            }
        }
        for (let i = 0; i < vvariantesGuardas.length; i++) {
            for (let j = 0; j < vimagenes[i].length; j++) {
                console.log(vimagenes[i][j].Tamanio_Imagen);
                await Imagen_Producto.create({
                    NUM_VARIANTE: vvariantesGuardas[i].dataValues.NUM_VARIANTE,
                    NOMBRE_IMAGEN: vimagenes[i][j].Nombre_Imagen,
                    TIPO_IMAGEN: vimagenes[i][j].Tipo_Imagen,
                    IMAGEN: vimagenes[i][j].Imagen,
                    TAMANIO_IMAGEN: vimagenes[i][j].Tamanio_Imagen,

                }, {
                    transaction: t
                });
            }
        }


        if (ofertaGuardada && productoGuardado) {
            res.status(200).send({
                message: "Su producto ha sido registrado  exitosamente"
            });

            await t.commit();
        } else {
            res.status(404).send({
                message: "Al parecer hubo probelmas con el registro del producto"
            });
        }*/

    } catch (err) {
       /* for (let h = 0; h < req.files.length; h++) {
            if (fs.exists(path.resolve(req.files[h].path))) {
                console.log('existe');
                await fs.unlink(path.resolve(req.files[h].path));
            }
        }

        await t.rollback();*/
        res.status(500).send({
            message: 'error:' + err
        });
    }
}

module.exports = {          // para exportar todas las funciones de este modulo

    saveProducto,
    getMisProductos,
    getProducto,
    updateProducto

};
