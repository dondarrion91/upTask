const passport = require("passport");
const Usuarios = require("../models/Usuarios");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const crypto = require("crypto");
const bcrypt = require("bcrypt-nodejs");

const enviarEmail = require("../handlers/email");

exports.autenticarUsuario = passport.authenticate("local", {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos Campos son Obligatorios'
});

// Funcion para revisar si el usuario esta logueado o no
exports.usuarioAutenticado = (req,res,next) => {
    // si el usuario esta autenticado, adelante

    if(req.isAuthenticated()){
        return next();
    }

    // sino esta autenticado, redirigir al formulario
    return res.redirect('/iniciar-sesion');
}

exports.cerrarSesion = (req,res,next) => {
    req.session = null;
    res.redirect('/iniciar-sesion');
}

// genera un token si el usario es valido
exports.enviarToken = async(req,res) => {
    // verficiar que el usuario existe
    const {email} = req.body;
    const usuario = await Usuarios.findOne({where: {email}});

    // Si no existe el usuario
    if(!usuario){
        req.flash("error","No existe esa cuenta");
        res.redirect('/reestablecer');
    }

    // usuario existe
    usuario.token = crypto.randomBytes(20).toString("hex");
    //expiracion
    usuario.expiracion = Date.now() + 3600000;

    // guardarlos en la bbdd
    await usuario.save();

    //url de reset
    const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;
    
    //envia el correo con el token
    await enviarEmail.enviar({
        usuario,
        subject: "Password Reset",
        resetUrl,
        archivo: "reestablecer-password"
    })
    req.flash("correcto","Se acaba de mandar un mail a tu correo para reestablecer la contraseña");
    res.redirect("/iniciar-sesion");
} 

exports.validarToken = async(req,res) =>{
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token
        }
    })
    
    if(!usuario){
        req.flash("error","No Valido");
        res.redirect("/reestablecer");
    }

    // formulario para gener password
    res.render('resetPassword',{
        nombrePagina: 'Reestablecer Contraseña'
    })
}

// cambia el password por uno nuevo
exports.actualizarPassword = async(req,res) => {
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token,
            expiracion: {
                [Op.gte] : Date.now()
            }
        }
    })

    if(!usuario){
        req.flash("error","No valido")
        res.redirect("/reestablecer");
    }
    // hashear el nuev password
    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    usuario.token = null;
    usuario.expiracion = null;
    
    //guardamos el nuevo password
    await usuario.save();

    req.flash('correcto','Tu password se ha modificado correctamente');
    res.redirect('/iniciar-sesion');
}

