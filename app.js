const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const path = require('path');
const app = express();
const passport = require('passport');


//load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

//passport config

require('./config/passport')(passport);
//db config
const db = require('./config/database');

//connecting to mongoose
mongoose.connect(db.mongoURI, {})
    .then(() => console.log('MongoDb connected'))
    .catch(err => console.log(err));


//handlebars middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');


//body parser middleware
app.use(bodyparser.urlencoded({
    extended: false
}))
app.use(bodyparser.json())


//method override middleware
app.use(methodOverride('_method'));

//express session middleware
app.use(session({
    secret:'secret',
    resave: true,
    saveUninitialized: true,
}));
//passport middleware
app.use(passport.initialize());
app.use(passport.session());
//connect flash

app.use(flash());

//global variables 

app.use(function(req,res,next){
    res.locals.success_msg=req.flash('success_msg');
    res.locals.error_msg=req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

//static folder assets
app.use(express.static(path.join(__dirname,'public')));


//index route
app.get('/', (req, res) => {
    const title = 'welcome1';
    res.render('index');
});


// About Route
app.get('/about', (req, res) => {
    res.render('about');

});

//use routes
app.use('/ideas', ideas);
app.use('/users',users);

const port = process.env.PORT ||5000;
app.listen(port, () => {
    console.log(`server started on port ${port}`);
});