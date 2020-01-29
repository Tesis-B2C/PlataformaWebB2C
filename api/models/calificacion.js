const Sequelize = require('sequelize');
var db = require("../database/db.js");
var Producto_Descuento = require("./producto_descuento");

const Calificacion = db.sequelize.define('Calificacion', {

        ID_CALIFICACION:
            {
                type: Sequelize.BIGINT,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true
            },
        MOTIVO_DESCUENTO:
            {
                type: Sequelize.STRING,
                allowNull: false
            },
        VALOR:
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
            }
    },
    {
        timestamps: false
    })

Descuento.hasMany(Producto_Descuento, {foreignKey: 'ID_DESCUENTO', sourceKey: 'ID_DESCUENTO'});
Producto_Descuento.belongsTo(Descuento, {foreignKey: 'ID_DESCUENTO', sourceKey: 'ID_DESCUENTO'});

module.exports = Calificacion;
