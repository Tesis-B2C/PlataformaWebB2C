/*host: '192.168.245.129',    Base Vanessa*/
const Sequelize = require("sequelize");
const db = {}


const sequelize = new Sequelize("basetesis", "root", "12345678", {
    host: '192.168.245.129',
    dialect: "mysql",
    operatorsAliase: false,
    define:
        {
            freezeTableName: true,
        },
    pool:
        {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000

        }

});


db.sequelize = sequelize;
db.Sequelize = Sequelize;

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });


module.exports = db;
