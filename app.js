require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');

//PASO 2 IMPORT PACKAGES
const bcrypt = require('bcryptjs')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')
const LocalStategy = require('passport-local').Strategy


// PASO 9 IMPORTAR MODELO USER
const User = require('./models/User.model')


// DATABASE CONFIG
mongoose
  .connect('mongodb://localhost/passport-example', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });


// EXPRESS
const app = express();


// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


// PASO 3 MIDDLEWARE DE SESSION
app.use(session({
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: true
}))

// PASO 4 SERIALIZACION DEL USUARIO
passport.serializeUser((user, callback)=>{
  callback(null, user._id);
})

// PASO 5 DESERIALIZACION DEL USUARIO
passport.deserializeUser((id, callback)=>{

  User.findById(id)
    .then(result => {
      callback(null, result)
    })
    .catch(error => {
      callback(error)
    })
})

// PASO 6 CONFIGURAR FLASH
app.use(flash())


// PASO 7 CONFIGURAR EL MIDDLEWARE DEL STRATEGY
passport.use(new LocalStategy({
  // Si se va a iniciar sesion con el email habria que poner email en usernameField.
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, (req, username, password, next)=>{

  User.findOne({username})
    .then(user => {
      if(!user){
        return next(null, false, {message: 'Incorrect username'})
      }else if(!bcrypt.compareSync(password, user.password)){
        return next(null, false, {message: 'Incorrect password'})
      }else{
        return next(null, user)
      }
    })
    .catch(error => {
      next(error)
    })
}))


// PASO 10 CONFIGURAR EL MIDDLEWARE DE PASSPORT (siempre despues del Strategy)
app.use(passport.initialize())
app.use(passport.session())


// Express View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));


// ROUTES
app.use('/', require('./routes/index.routes'))
app.use ('/', require('./routes/auth.routes'))
app.use('/sports', require('./routes/sports.routes'))


// SERVER LISTEN
app.listen(process.env.PORT, ()=> {
  console.log(`Conectado en puerto ${process.env.PORT}`)
  
})
