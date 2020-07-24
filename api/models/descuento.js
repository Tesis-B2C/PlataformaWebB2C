const Sequelize = require('sequelize');
var db = require("../database/db.js");
var Producto_Descuento = require("./producto_descuento");

const Descuento = db.sequelize.define('DESCUENTO', {

        ID_DESCUENTO:
            {
                type: Sequelize.BIGINT,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true
            },
        NUM_TIENDA:
            {
                type: Sequelize.INTEGER,
                allowNull: false
            },
        MOTIVO_DESCUENTO:
            {
                type: Sequelize.STRING,
                allowNull: false
            },
        PORCENTAJE_DESCUENTO:
            {
                type: Sequelize.FLOAT,
                allowNull: false
            },
        FECHA_INICIO:
            {
                type: Sequelize.DATEONLY,
                allowNull: false
            },
        FECHA_FIN:
            {
                type: Sequelize.DATEONLY,
                allowNull: false
            },
        TIPO_DESCUENTO:
            {
                type: Sequelize.STRING,
                allowNull: false
            },
        HORA_INICIO:
            {
                type: Sequelize.STRING,
                allowNull: false
            },
        HORA_FIN:
            {
                type: Sequelize.STRING,
                allowNull: false
            },
        ESTADO_DESCUENTO:
            {
                type: Sequelize.INTEGER,
                allowNull: false
            }
    },
    {
        timestamps: false,
        id:false
    })

Descuento.hasMany(Producto_Descuento, {foreignKey: 'ID_DESCUENTO', sourceKey: 'ID_DESCUENTO'});
Producto_Descuento.belongsTo(Descuento, {foreignKey: 'ID_DESCUENTO', sourceKey: 'ID_DESCUENTO'});

module.exports = Descuento;
