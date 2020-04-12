const Sequelize = require("sequelize");
const db = require("../config/db");
const Proyectos = require("./Proyectos");

const tareas = db.define('tareas',{
    id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    tarea: Sequelize.STRING,
    estado: Sequelize.INTEGER(1)
});
tareas.belongsTo(Proyectos);



module.exports = tareas;