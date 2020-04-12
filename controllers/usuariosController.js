const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handlers/email');

exports.formCrearCuenta = (req,res) => {
    res.render('crearCuenta',{
        nombrePagina: 'Crear Cuenta en UpTask'
    });
}

exports.formIniciarSesion = (req,res) => {
    const { error } = res.locals.mensajes;
    res.render('iniciarSesion',{
        nombrePagina: 'Iniciar sesion en UpTask',
        error
    });
}

exports.crearCuenta = async(req,res) => {
    // leer datos
    const {email,password} = req.body;
    // crear el usuario

    try{
        await Usuarios.create({
            email,
            password
        });

        // crear url de confirmar
        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;
        // crear objeto de usuario
        const usuario = {
            email
        } 
        
        // enviar email
        await enviarEmail.enviar({
            usuario,
            subject: "Confirma tu cuenta uptask",
            confirmarUrl,
            archivo: "confirmar-cuenta"
        })
        
        // redirigir al usuario
        req.flash("correcto","Enviamos un correo para confirmar tu cuenta");
        res.redirect('/iniciar-sesion');
        
    }catch(error){
        console.log("object2")
        if(error.errors[0].message === "usuarios.usuarios_email_unique must be unique"){
            req.flash('error',["El usuario ya existe"]);
        }else{
            req.flash('error',error.errors.map(error => error.message));
        }
        
        res.render('crearCuenta',{
            mensajes: req.flash(),
            nombrePagina: 'Crear Cuenta en UpTask',
            email,
            password
        });
    }
    
    

}

exports.formReestablecerPassword = (req,res) => {
    res.render('reestablecer',{
        nombrePagina: 'Reestablecer tu contraseña'
    });
}

exports.confirmarCuenta = async(req,res) => {
    const usuario = await Usuarios.findOne({
        where:{
            email:req.params.correo 
        }
    });

    // si no existe el usuario
    if(!usuario){
        req.flash("error","No valido");
        res.redirect("/crear-cuenta");
    }

    usuario.activo = 1;
    await usuario.save();

    req.flash("correcto","Cuenta activada correctamente");
    res.redirect("/iniciar-sesion");
}