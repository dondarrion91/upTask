const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//Referencia al modelo donde vamos a autenticar
const Usuarios = require('../models/Usuarios');

// Local Strategy - Loguin con credenciales propios

passport.use(
    new LocalStrategy(
        // por default passport espera un usuario y password
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email,password,done) => {
            try{
                const usuario = await Usuarios.findOne({
                    where: {
                        email,
                        activo:1
                    }
                });
                if(!usuario.verificarPassword(password)){
                    return done(null,false,{
                        message: 'Password Incorrecto'
                    })
                }

                return done(null,usuario);
            }catch(error){
                return done(null,false,{
                    message: 'Esa Cuenta no Existe'
                }) // error,usuario,mensaje
            }
        }
    )
)


// Serializar el usuario
passport.serializeUser((usuario,callback) => {
    callback(null,usuario)
})

//desearilzar el usuario

passport.deserializeUser((usuario,callback) => {
    callback(null,usuario)
})


module.exports = passport;