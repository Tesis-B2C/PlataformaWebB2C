const Sequelize = require('sequelize');
var db = require("../database/db.js");
var Compra_Producto = require("./compra_producto");

const Compra = db.sequelize.define('COMPRA', {
        NUM_COMPRA: {
            type: Sequelize.BIGINT,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        COD_AGENTE: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        FECHA_COMPRA:
            {
                type: Sequelize.DATEONLY,
                allowNull: false
            },
        HORA_COMPRA:
            {
                type: Sequelize.TIME,
                allowNull: false
            },


        CALLE_PRINCIPAL_ENTREGA:
            {
                type: Sequelize.STRING,
                allowNull: true
            },

        CALLE_SECUNDARIA_ENTREGA:
            {
                type: Sequelize.STRING,
                allowNull: true
            },
        COD_DPA:
            {
                type: Sequelize.STRING,
                allowNull: true

            },

        NOMBRE_PERSONA_ENTREGA:
            {
                type: Sequelize.STRING,
                allowNull: true
            },
        TIPO_IDENTIFICACION_ENTREGA: {
            type: Sequelize.STRING,
            allowNull: true
        },
        IDENTIFICACION_ENTREGA:
            {
                type: Sequelize.STRING,
                allowNull: true
            },
        NUM_COD_POSTAL_ENTREGA: {
            type: Sequelize.STRING,
            allowNull: true
        },
        TELEFONO_ENTREGA: {
            type: Sequelize.STRING,
            allowNull: true
        },
        NUM_CASA_ENTREGA: {
            type: Sequelize.STRING,
            allowNull: true
        },
        TIPO_IDENTIFICACION_FACTURA: {
            type: Sequelize.STRING,
            allowNull: false
        },
        NOMBRE_FACTURA: {
            type: Sequelize.STRING,
            allowNull: false
        },
        CORREO_FACTURA: {
            type: Sequelize.STRING,
            allowNull: false
        },
        IDENTIFICACION_FACTURA: {
            type: Sequelize.STRING,
            allowNull: false
        },
        TELEFONO_FACTURA: {
            type: Sequelize.STRING,
            allowNull: false
        },
        DIRECCION_FACTURA: {
            type: Sequelize.STRING,
            allowNull: false
        },
        ESTADO_COMPRA: {
            type: Sequelize.NUMBER,
            allowNull: false
        },
        FECHA_ENVIO: {
            type: Sequelize.DATEONLY,
            allowNull: true
        },
        METODO_PAGO:
            {
                type: Sequelize.STRING,
                allowNull: false
            },
        METODO_ENVIO:
            {
                type: Sequelize.STRING,
                allowNull: false
            },
        COSTO_ENVIO:
            {
                type: Sequelize.FLOAT(8, 2),
                allowNull: false
            },
        RECARGO_PAYPAL:
            {
                type: Sequelize.FLOAT(8, 2),
                allowNull: false
            },
        PORCENTAJE_RECARGO_PAYPAL:
            {
                type: Sequelize.FLOAT(8, 2),
                allowNull: false
            },

    },


    {
        timestamps: false,
        id: false
    })
Compra.hasMany(Compra_Producto, {foreignKey: 'NUM_COMPRA', sourceKey: 'NUM_COMPRA'});
Compra_Producto.belongsTo(Compra, {foreignKey: 'NUM_COMPRA', sourceKey: 'NUM_COMPRA'});
module.exports = Compra;
