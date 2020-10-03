'use strict'
const Imagen_Producto = require("../models/imagen_producto");
const Tienda = require("../models/tienda");
const Sucursal = require("../models/sucursal");
const Dpa = require("../models/dpa");
const Oferta = require("../models/oferta");
const Producto = require("../models/producto");
const Producto_Categoria = require("../models/producto_categoria");
const Producto_Descuento = require("../models/producto_descuento");
const Descuento = require("../models/descuento");
const Variante = require("../models/variante");
const Opcion_Envio = require("../models/opcion_envio");
const Metodo_Pago = require("../models/metodo_pago");
const Calificacion = require("../models/calificacion");
const Comentario = require("../models/comentario");
const Categoria = require("../models/categoria");
const moment = require('moment');
const db = require('../database/db');
const fs = require('fs-extra');
const path = require('path');
const Agente = require('../models/agente');

const {Op} = require("sequelize");

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
        if (!oferta.Iva) {
            oferta.Iva = 0;
        }
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

        if (!producto.Cod_Producto) {
            producto.Cod_Producto = '000000';
        }
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
                ESTADO_VARIANTE: v.Estado_Variante
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
                message: "Su producto ha sido registrado exitosamente"
            });

            await t.commit();
        } else {
            res.status(401).send({
                message: "Al parecer hubo problemas con el registro del producto"
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
        let verificar = await Agente.findOne({where: {COD_AGENTE: req.user.id}});

        if (!verificar) {
            return res.status(401).send({
                message: "No tiene los permisos necesarios"
            });
        } else {
            let productosObtenidas = await Oferta.findAll({ //$or: [{ESTADO_OFERTA: 0},{ESTADO_OFERTA: 1}]
                where: {NUM_TIENDA: req.params.id, ESTADO_OFERTA: {[Op.or]: [0, 1]}},
                include: {model: Producto},
                order: [['ID_OFERTA', 'DESC']]
            });

            if (productosObtenidas) {
                res.status(200).send({
                    data: productosObtenidas,
                    message: "Productos cargadas correctamente"
                });
            }
        }
    } catch (err) {
        res.status(500).send({
            message: 'error:' + err
        });
    }

}

async function getProducto(req, res) {
    try {
        let verificar = await Agente.findOne({where: {COD_AGENTE: req.user.id}});

        if (!verificar) {
            return res.status(401).send({
                message: "No tiene los permisos necesarios"
            });
        } else {
            let productoObtenido = await Oferta.findOne({
                where: {
                    ID_OFERTA: req.params.id, ESTADO_OFERTA: {[Op.or]: [0, 1]}
                },
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
    const vimagenesporborrar = [];
    try {
        let producto = JSON.parse(req.body.producto);
        let oferta = JSON.parse(req.body.oferta);
        let variantes = JSON.parse(req.body.variantes);
        let vimagenes = JSON.parse(req.body.vimagenes);
        let categorias = JSON.parse(req.body.categorias);
        console.log("imagenes", req.files);
        console.log("objetos", oferta, producto, variantes, vimagenes, categorias);

        let ofertaActualizada = await Oferta.update({
                NUM_TIENDA: oferta.Num_Tienda,
                IVA: oferta.Iva,
                FECHA_CREACION: moment(),
                GARANTIA: oferta.Garantia,
                ESTADO_OFERTA: oferta.Estado_Oferta,
            }, {
                where: {ID_OFERTA: req.params.id},

                transaction: t
            }
        );

        let productoActualizado = await Producto.update({
            COD_PRODUCTO: producto.Cod_Producto,
            ID_OFERTA: req.params.id,
            NOMBRE_PRODUCTO: producto.Nombre_Producto,
            DESCRIPCION_PRODUCTO: producto.Descripcion_Producto,
            DETALLE_PRODUCTO: producto.Detalle_Producto,
            MARCA: producto.Marca,
            LLEVAR_STOCK: producto.Rastrear_Stock,
            VENDER_SIN_STOCK: producto.Vender_Sin_Stock,
            CONDICION: producto.Condicion,
            PESO_PRODUCTO: producto.Peso_Producto
        }, {
            where: {ID_PRODUCTO: producto.Id_Producto},

            transaction: t
        });

        await Producto_Categoria.destroy({
            where: {ID_PRODUCTO: producto.Id_Producto},
            transaction: t
        });

        for (const c of categorias) {
            await Producto_Categoria.create({
                    ID_PRODUCTO: producto.Id_Producto,
                    COD_PRODUCTO: producto.Cod_Producto,
                    ID_CATEGORIA: c,
                },
                {
                    transaction: t
                });
        }

        for (let v of variantes) {
            if (v.Estado_Variante == 0) {
                let variantesActualizadas = await Variante.update({
                    ID_PRODUCTO: producto.Id_Producto,
                    COD_PRODUCTO: producto.Cod_Producto,
                    COLOR: v.Color,
                    TALLA: v.Talla,
                    MATERIAL: v.Material,
                    PRECIO_UNITARIO: v.Precio_Unitario,
                    STOCK: v.Stock,
                    MEDIDA: v.Cod_Unidad,
                    ESTADO_VARIANTE: v.Estado_Variante
                }, {
                    where: {NUM_VARIANTE: v.Num_Variante},
                    transaction: t
                });
                v.NUM_VARIANTE = v.Num_Variante;
                vvariantesGuardas.push(v);
            } else if (v.Estado_Variante == 1) {
                let variantesGuardadas = await Variante.create({
                    ID_PRODUCTO: producto.Id_Producto,
                    COD_PRODUCTO: producto.Cod_Producto,
                    COLOR: v.Color,
                    TALLA: v.Talla,
                    MATERIAL: v.Material,
                    PRECIO_UNITARIO: v.Precio_Unitario,
                    STOCK: v.Stock,
                    MEDIDA: v.Cod_Unidad,
                    ESTADO_VARIANTE: 0
                }, {
                    transaction: t
                });
                vvariantesGuardas.push(variantesGuardadas.dataValues);
            } else if (v.Estado_Variante == 2) {
                let variantesDestruidas = await Variante.update({ESTADO_VARIANTE: 2}, {
                    where: {NUM_VARIANTE: v.Num_Variante},
                    transaction: t
                });
            }
        }


        for (let i = 0; i < vvariantesGuardas.length; i++) {
            for (let j = 0; j < vimagenes[i].length; j++) {

                if (vimagenes[i][j].Estado_Imagen == 1) {
                    for (let h = 0; h < req.files.length; h++) {
                        if (vimagenes[i][j].Nombre_Imagen == req.files[h].originalname) {
                            vimagenes[i][j].Imagen = req.files[h].path;
                        }
                    }
                } else if (vimagenes[i][j].Estado_Imagen == 2) {
                    vimagenesporborrar.push(vimagenes[i][j].Imagen);
                    /*  if (fs.exists(path.resolve(vimagenes[i][j].Imagen))) {
                          console.log('existe');
                          await fs.unlink(path.resolve(vimagenes[i][j].Imagen));
                      }*/
                    await Imagen_Producto.destroy({
                        where: {ID_IMAGEN: vimagenes[i][j].Id_Imagen},
                        transaction: t
                    })
                }
            }
        }
        for (let i = 0; i < vvariantesGuardas.length; i++) {
            for (let j = 0; j < vimagenes[i].length; j++) {
                console.log(vimagenes[i][j].Tamanio_Imagen);
                let num = vvariantesGuardas[i].NUM_VARIANTE;

                if (vimagenes[i][j].Estado_Imagen == 1 && (vimagenes[i][j].Tipo_Imagen == 'video' || vimagenes[i][j].Tipo_Imagen == 'youtube')) {
                    if (vimagenes[i][j].Id_Imagen != null) {
                        vimagenesporborrar.push(vimagenes[i][j].path);
                        await Imagen_Producto.update({
                            NOMBRE_IMAGEN: vimagenes[i][j].Nombre_Imagen,
                            TIPO_IMAGEN: vimagenes[i][j].Tipo_Imagen,
                            IMAGEN: vimagenes[i][j].Imagen,
                            TAMANIO_IMAGEN: vimagenes[i][j].Tamanio_Imagen,
                        }, {
                            where: {ID_IMAGEN: vimagenes[i][j].Id_Imagen},
                            transaction: t
                        });
                    } else {
                        await Imagen_Producto.create({
                            NUM_VARIANTE: vvariantesGuardas[i].NUM_VARIANTE,
                            NOMBRE_IMAGEN: vimagenes[i][j].Nombre_Imagen,
                            TIPO_IMAGEN: vimagenes[i][j].Tipo_Imagen,
                            IMAGEN: vimagenes[i][j].Imagen,
                            TAMANIO_IMAGEN: vimagenes[i][j].Tamanio_Imagen,
                        }, {
                            transaction: t
                        });
                    }
                } else if (vimagenes[i][j].Estado_Imagen == 1) {
                    await Imagen_Producto.create({
                        NUM_VARIANTE: vvariantesGuardas[i].NUM_VARIANTE,
                        NOMBRE_IMAGEN: vimagenes[i][j].Nombre_Imagen,
                        TIPO_IMAGEN: vimagenes[i][j].Tipo_Imagen,
                        IMAGEN: vimagenes[i][j].Imagen,
                        TAMANIO_IMAGEN: vimagenes[i][j].Tamanio_Imagen,
                    }, {
                        transaction: t
                    });
                }
            }
        }

        if (ofertaActualizada && productoActualizado) {

            if (vimagenesporborrar[0]) {
                console.log("vector imagene spor borrar2", vimagenesporborrar);
                for (let ipb of vimagenesporborrar) {
                    if (fs.exists(path.resolve(ipb))) {
                        console.log('existe');
                        await fs.unlink(path.resolve(ipb));
                    }
                }
            }
            res.status(200).send({
                message: "Su producto ha sido registrado exitosamente"
            });

            await t.commit();
        } else {
            res.status(404).send({
                message: "Al parecer hubo problemas con el registro del producto"
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

async function updateEstadoProducto(req, res) {
    const t = await db.sequelize.transaction({autocommit: false});
    try {
        let verificar = await Agente.findOne({where: {COD_AGENTE: req.user.id}});

        if (!verificar) {
            return res.status(500).send({
                message: "No tiene los permisos necesarios"
            });
        } else {
            let ofertaActualizada = await Oferta.update({
                ESTADO_OFERTA: req.body.estado,
            }, {
                where: {ID_OFERTA: req.params.id, ESTADO_OFERTA: {[Op.or]: [0, 1]}}, transaction: t
            });

            let busquedaOferta = await Oferta.findAll({
                where: {ID_OFERTA: req.params.id, ESTADO_OFERTA: {[Op.or]: [0, 1]}}, include: {model: Producto},
                transaction: t
            });

            for (let element of busquedaOferta) {
                await Variante.update({
                    ESTADO_VARIANTE: req.body.estado,
                }, {
                    where: {ID_PRODUCTO: element.dataValues.PRODUCTO.ID_PRODUCTO, ESTADO_VARIANTE: {[Op.or]: [0, 1]}},
                    transaction: t
                });
            }

            if (ofertaActualizada > 0) {
                res.status(200).send({
                    message: "El producto ha sido actualizado correctamente"
                });
                await t.commit();
            } else {
                res.status(402).send({
                    message: 'Al parecer no se encuentra el producto registrado en la base de datos'
                });
            }
        }
    } catch (err) {
        await t.rollback();
        res.status(500).send({
            message: 'error:' + err
        });
    }
}

async function updateEstadoProductos(req, res) {
    const t = await db.sequelize.transaction({autocommit: false});
    try {
        let verificar = await Agente.findOne({where: {COD_AGENTE: req.user.id}});

        if (!verificar) {
            return res.status(500).send({
                message: "No tiene los permisos necesarios"
            });
        } else {
            for (const s of req.body) {
                await Oferta.update({
                    ESTADO_OFERTA: req.params.estado,
                }, {
                    where: {ID_OFERTA: s}, transact: t
                });
            }
            res.status(200).send({
                message: "El producto ha sido actualizado correctamente"
            });
            t.commit();
        }
    } catch (err) {
        t.rollback();
        res.status(500).send({
            message: 'error:' + err
        });
    }
}

/*     //INICIO SECCION PARA PAGINA PRINCIPAL//     */
async function obtenerTodosProductos(req, res) {
    const t = await db.sequelize.transaction({autocommit: false});
    let fechaHoy = moment().format("YYYY-MM-DD");
    try {
        let productosObtenidos;
        if (req.params.estado == 0) {
            productosObtenidos = await Oferta.findAll({
                include: [{
                    model: Producto,
                    attributes: ['ID_PRODUCTO', 'COD_PRODUCTO', 'ID_OFERTA', 'NOMBRE_PRODUCTO',],
                    include: [{
                        model: Variante,
                        separate: true,
                        attributes: ['ID_PRODUCTO', 'COD_PRODUCTO', 'NUM_VARIANTE', 'PRECIO_UNITARIO'],
                        order: [['NUM_VARIANTE', 'ASC']],
                        include: {
                            model: Imagen_Producto,
                            where: {
                                TIPO_IMAGEN: {
                                    [Op.like]: 'image%'
                                }
                            },
                            separate: true,
                            attributes: ['NUM_VARIANTE', 'IMAGEN'],
                            order: [['ID_IMAGEN', 'ASC']]
                        }
                    }, {
                        model: Producto_Descuento,
                        include: {
                            model: Descuento,
                            where: {
                                ESTADO_DESCUENTO: 0,
                                FECHA_INICIO: {
                                    [Op.lte]: fechaHoy
                                },
                                FECHA_FIN: {
                                    [Op.gte]: fechaHoy
                                }
                            }
                        }
                    }, {
                        model: Calificacion,
                        separate: true,
                        attributes: ['ID_PRODUCTO', 'COD_PRODUCTO', [Calificacion.sequelize.fn('AVG', Calificacion.sequelize.col('NUM_ESTRELLAS')), 'PROMEDIO_CAL']],
                        group: ['ID_PRODUCTO', 'COD_PRODUCTO']
                    }, {
                        model: Comentario,
                        separate: true,
                        attributes: ['ID_PRODUCTO', 'COD_PRODUCTO', [Comentario.sequelize.fn('COUNT', Comentario.sequelize.col('ID_COMENTARIO')), 'TOTAL_COM']],
                        group: ['ID_PRODUCTO', 'COD_PRODUCTO']
                    }]
                }, {
                    model: Tienda,
                    where: {
                        ESTADO_TIENDA: 0,
                    },
                    attributes: ['NOMBRE_COMERCIAL', 'NUM_TIENDA']
                }],
                attributes: ['ID_OFERTA', 'IVA'],
                where: {
                    ESTADO_OFERTA: 0,
                    FECHA_CREACION: {[Op.between]: [moment().subtract(1, 'months'), moment()]}
                },
                order: [['ID_OFERTA', 'ASC']],
                transaction: t
            });
        } else {
            productosObtenidos = await Oferta.findAll({
                include: [{
                    model: Producto,
                    attributes: ['ID_PRODUCTO', 'COD_PRODUCTO', 'ID_OFERTA', 'NOMBRE_PRODUCTO',],
                    include: [{
                        model: Variante,
                        separate: true,
                        attributes: ['ID_PRODUCTO', 'COD_PRODUCTO', 'NUM_VARIANTE', 'PRECIO_UNITARIO'],
                        order: [['NUM_VARIANTE', 'ASC']],
                        include: {
                            model: Imagen_Producto,
                            where: {
                                TIPO_IMAGEN: {
                                    [Op.like]: 'image%'
                                }
                            },
                            separate: true,
                            attributes: ['NUM_VARIANTE', 'IMAGEN'],
                            order: [['ID_IMAGEN', 'ASC']]
                        }
                    }, {
                        model: Producto_Descuento,
                        include: {
                            model: Descuento,
                            where: {
                                ESTADO_DESCUENTO: 0,
                                FECHA_INICIO: {
                                    [Op.lte]: fechaHoy
                                },
                                FECHA_FIN: {
                                    [Op.gte]: fechaHoy
                                }
                            }
                        }
                    }, {
                        model: Calificacion,
                        separate: true,
                        attributes: ['ID_PRODUCTO', 'COD_PRODUCTO', [Calificacion.sequelize.fn('AVG', Calificacion.sequelize.col('NUM_ESTRELLAS')), 'PROMEDIO_CAL']],
                        group: ['ID_PRODUCTO', 'COD_PRODUCTO']
                    }, {
                        model: Comentario,
                        separate: true,
                        attributes: ['ID_PRODUCTO', 'COD_PRODUCTO', [Comentario.sequelize.fn('COUNT', Comentario.sequelize.col('ID_COMENTARIO')), 'TOTAL_COM']],
                        group: ['ID_PRODUCTO', 'COD_PRODUCTO']
                    }]
                }, {
                    model: Tienda,
                    where: {
                        ESTADO_TIENDA: 0,
                    },
                    attributes: ['NOMBRE_COMERCIAL', 'NUM_TIENDA']
                }],
                attributes: ['ID_OFERTA', 'IVA'],
                where: {
                    ESTADO_OFERTA: 0,

                },
                order: [['ID_OFERTA', 'ASC']],
                transaction: t
            });
        }
        await t.commit();
        res.status(200).send({
            data: productosObtenidos,
            message: "Producto cargado correctamente"
        });
    } catch (e) {
        await t.rollback();
        res.status(500).send({
            message: 'error:' + e
        });
    }
}

async function obtenerProductoDetalle(req, res) {
    const t = await db.sequelize.transaction({autocommit: false});
    try {
        let fechaHoy = moment().format("YYYY-MM-DD");

        let productoObtenido = await Oferta.findOne({
            where: {ID_OFERTA: req.params.id, ESTADO_OFERTA: 0},
            include: [{
                model: Producto,
                include: [{
                    model: Variante,
                    separate: true,
                    where: {ESTADO_VARIANTE: 0},
                    order: [['NUM_VARIANTE', 'ASC']],
                    include: {
                        model: Imagen_Producto,
                        separate: true,
                        order: [['ID_IMAGEN', 'ASC']]
                    }
                }, {
                    model: Producto_Descuento,
                    include: {
                        model: Descuento,
                        where: {
                            ESTADO_DESCUENTO: 0,
                            FECHA_INICIO: {
                                [Op.lte]: fechaHoy
                            },
                            FECHA_FIN: {
                                [Op.gte]: fechaHoy
                            }
                        }
                    }
                }, {
                    model: Producto_Categoria,
                    include: {model: Categoria}
                }, {
                    model: Calificacion,
                    separate: true,
                    attributes: ['ID_PRODUCTO', 'COD_PRODUCTO', [Calificacion.sequelize.fn('AVG', Calificacion.sequelize.col('NUM_ESTRELLAS')), 'PROMEDIO_CAL']],
                    group: ['ID_PRODUCTO']
                }, {
                    model: Comentario,
                    include: {model: Agente},
                    order: [['ID_COMENTARIO', 'DESC']],
                    separate: true
                }],
            }, {
                model: Tienda,
                attributes: ['NUM_TIENDA', 'NOMBRE_COMERCIAL', 'CONTACTO_WHATSAPP', 'LINK_PAGINA', 'LINK_FACEBOOK'],
                include: [{
                    model: Opcion_Envio,
                    separate: true,
                    order: [['ID_OPCION_ENVIO', 'ASC']]
                }, {
                    model: Metodo_Pago,
                    separate: true,
                    order: [['ID_METODO_PAGO', 'ASC']]
                }, {
                    model: Sucursal,
                    separate: true,
                    order: [['NUM_SUCURSAL', 'ASC']],
                    include: {
                        model: Dpa
                    }
                }]
            }],
            attributes: ['ID_OFERTA', 'NUM_TIENDA', 'IVA', 'GARANTIA'],
            transaction: t
        });

        if (productoObtenido) {
            await t.commit();
            res.status(200).send({
                data: productoObtenido,
                message: "Producto cargado correctamente"
            });
        } else {
            await t.rollback();
            res.status(404).send({
                message: 'Al parecer no se encuentra el producto registrado en la base de datos'
            });
        }
    } catch (err) {
        await t.rollback();
        res.status(500).send({
            message: 'error:' + err
        });
    }
}

/*     //FIN SECCION PARA PAGINA PRINCIPAL//      */

module.exports = {          // para exportar todas las funciones de este modulo
    saveProducto,
    getMisProductos,
    getProducto,
    updateProducto,
    updateEstadoProducto,
    obtenerTodosProductos,
    obtenerProductoDetalle,
    updateEstadoProductos
};
