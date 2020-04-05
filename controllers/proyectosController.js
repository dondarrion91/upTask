const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/tareas');
const slug = require('slug');

exports.proyectosHome = async(req, res) => {

    const usuarioId = res.locals.usuario.id;

    const proyectos = await Proyectos.findAll({where:{usuarioId}});
    
    res.render("index",{
        nombrePagina: 'Proyectos',
        proyectos
    }); // al usar .json puedo consumir en otro proyecto (se recomienda en una rest Api)
}

exports.formularioProyecto = async(req, res) => {
    const usuarioId = res.locals.usuario.id;

    const proyectos = await Proyectos.findAll({where:{usuarioId}});
    res.render("nuevoProyecto",{
        nombrePagina: 'Nuevo Proyecto',
        proyectos
    });
}

exports.nuevoProyecto = async (req, res) => {
    //Enviar a consola lo que escriba el suario
    
    const usuarioId = res.locals.usuario.id;

    const proyectos = await Proyectos.findAll({where:{usuarioId}});
    const { nombre } = req.body;
    let errores = [];

    if(!nombre){
        errores.push({
            "texto": "Agrega un nombre al proyecto"
        });
    }

    if(errores.length > 0){
        res.render('nuevoProyecto',{
            nombrePagina: "Nuevo Proyecto",
            errores,
            proyectos
        })
    }else{
        //no hay errores
        //insertar en BBDD

        const usuarioId = res.locals.usuario.id;
        
        
        await Proyectos.create({nombre,usuarioId});
        res.redirect('/');

    }
}

exports.proyectoPorUrl = async(req,res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectosPromise = Proyectos.findAll({where:{usuarioId}});
    
    const proyectoPromise =  Proyectos.findOne({
        where: {
            url: req.params.url,
            usuarioId
        }
    });

    const [proyectos,proyecto] = await Promise.all([proyectosPromise,proyectoPromise]);

    // consultar tareas del Proyecto Actual
    const tareas = await Tareas.findAll({
        where:{
            proyectoId: proyecto.id
        },
        // include: [
        //     {model: Proyectos}
        // ]
    })

    


    if(!proyecto) return next();
    
    res.render("tareas",{
        nombrePagina: "tareas del Proyecto",
        proyecto,
        proyectos,
        tareas
    });
}

exports.formularioEditar = async(req,res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectosPromise = Proyectos.findAll({where:{usuarioId}});
    const proyectoPromise =  Proyectos.findOne({
        where: {
            id: req.params.id,
            usuarioId
        }
    });

    const [proyectos,proyecto] = await Promise.all([proyectosPromise,proyectoPromise]);

    res.render('nuevoProyecto',{
        nombrePagina: "Editar Proyecto",
        proyectos,
        proyecto
    })
}

exports.actualizarProyecto = async (req, res) => {
    //Enviar a consola lo que escriba el suario
    
    const usuarioId = res.locals.usuario.id;

    const proyectos = await Proyectos.findAll({where:{usuarioId}});
    const { nombre } = req.body;
    let errores = [];

    if(!nombre){
        errores.push({
            "texto": "Agrega un nombre al proyecto"
        });
    }

    if(errores.length > 0){
        res.render('nuevoProyecto',{
            nombrePagina: "Nuevo Proyecto",
            errores,
            proyectos
        })
    }else{
        //no hay errores
        //insertar en BBDD

        
        
        await Proyectos.update(
            {nombre: nombre},
            {where: {
                        id: req.params.id
                    }
            }
        );
        res.redirect('/');

    }
}

exports.eliminarProyecto = async(req,res,next) => {
    const {urlProyecto} = req.query;
    const resultado = await Proyectos.destroy({ //DELETE FROM '' WHERE id = 20
        where: {
            url: urlProyecto
        }
    }); 

    if(!resultado){
        return next();
    }

    res.status(200).send("Proyecto Eliminado Correctamente");
}