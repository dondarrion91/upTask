const express = require('express');
const routes = require('./routes/index');
const path = require('path'); // leer los archivos del file system (rutas)
const bodyParser = require("body-parser");
const expressValidator = require('express-validator');
const flash = require("connect-flash");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("./config/passport");
//variablkes de entorno
require("dotenv").config({path:'../variables.env'});

// helpers con algunas funciones
const helpers = require("./helpers");

// Cnexion a BBDD
const db = require("./config/db");

// Importar el modelo
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');

db.sync()
    .then(() => console.log("Conectado al servidor"))
    .catch(error => console.log(error)) 

// crear una app de express
const app = express(); // contiene todo lo necesario de express 

//donde cargar los archivos estaticos
app.use(express.static('public'));

// Habilitar Pug
app.set('view engine','pug'); // set para agregar cierto valor , view engine  es palabra reservada de express

// habilitar bodyParser para leer datos del formulario
app.use(bodyParser.urlencoded({
    extended: true
}))



//añadir la carpetade las vistas
app.set('views',path.join(__dirname,'./views'));

app.use(flash());

app.use(cookieParser());

//session permite navegar entre distintas paginas sin volver a autenticarse
app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());

//pasar vardump a la aplicacion
app.use((req,res,next) => {
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = {...req.user} || null;
    
    next(); //pasa al siguiente middleware
    // pasar funcion para que este disponible en cualq lugar de la aplicacion se logra con locals
});

app.use((req,res,next) => {
    const fecha = new Date();
    res.locals.year = fecha.getFullYear();
    next();
})




app.use('/',routes());


const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

app.listen(port,host,() => {
    console.log("El servidor esta funcionando");
});