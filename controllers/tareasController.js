const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/tareas');

exports.agregarTarea = async(req,res,next) => {
    
    //Obtener el proyecto acutal
    const proyecto = await Proyectos.findOne({where: {url: req.params.url}}); 

    // leer el valor del input
    const {tarea} = req.body;
    
    //estado Incompleto
    const estado = 0;
    const proyectoId = proyecto.id;

    //insertar en BBDD
    const resultado = await Tareas.create({tarea,estado,proyectoId});

    if(!resultado){
        return next();
    }

    //reedireccionar
    res.redirect(`/proyectos/${req.params.url}`);
}

exports.cambiarEstadoTarea = async(req,res,next) => {
    const {id} = req.params;
    const tarea = await Tareas.findOne({
        where:{
            id
        }
    });
    let estado = 0;
    if(tarea.estado === estado){
        estado = 1;
    }

    tarea.estado = estado;

    const resultado = await tarea.save();

    if(!resultado) return next();

    
    res.status(200).send("Actualizado...");
}

exports.eliminarTarea = async(req,res,next) => {

    const {id} = req.params;

    //Eliminar la tarea

    const resultado = await Tareas.destroy({where: {id}});

    if(!resultado) return next();

    res.status(200).send("Tarea Eliminada...");
}