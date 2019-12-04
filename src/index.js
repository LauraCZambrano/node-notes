//require
const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const session =  require('express-session');
const flash = require('connect-flash');

//initializations
const app = express();
require('./database');

//settings
app.set('port', process.env.PORT || 3000); //puerto
app.set('views', path.join(__dirname, 'views')); //carpeta de views
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'
})); //configurar hbs
app.set('view engine', '.hbs'); //extensiones

//middlewares
app.use(express.urlencoded({extended: false})); //recibir datos del usuario
app.use(methodOverride('_method')); //formularios con put, delete
app.use(session({
    secret: 'mysecretapp',
    resave: true,
    saveUninitialized: true
})); //sesiones
app.use(flash());

//global variables
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

//routes
app.use(require('./routes/index'));
app.use(require('./routes/users'));
app.use(require('./routes/notes'));

//static files
app.use(express.static(path.join(__dirname, 'public'))); //carpeta public

//server
app.listen(app.get('port'), () => {
    console.log('server on port', app.get('port'));
});