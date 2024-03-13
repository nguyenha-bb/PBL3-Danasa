const path = require('path');
const express = require('express');
const morgan = require('morgan');
const handlebars = require('express-handlebars');
const session = require('express-session')
const methodOverride = require('method-override');
//const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const route = require('./routes');
const db = require('./config/db');

const flash = require('connect-flash');
const bcrypt = require('bcrypt');
//Connect to DB
db.connect;

const app = express();
const port = 3000;
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({
  extended: true
}));
//app.use(fetch);
app.use(session({ secret: 'Your_Secret_Key', resave: true, saveUninitialized: true }))
// app.use(express.json);

app.use(flash());

// app.use(function(req, res, next) {
//   res.setHeader('Cache-Control', 'no-store');
//   res.setHeader('Pragma', 'no-cache');
//   next();
// });


app.use(function (req, res, next) {
  res.locals.success = req.flash('success');
  next();
});



//HTTP logger
// app.use(morgan('combined'));

//Template engine
app.use(methodOverride('_method'));


app.engine('hbs', handlebars.engine({
  extname: '.hbs',
  defaultLayout: 'main'
}));


app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

var hbs = handlebars.create({});

// register new function
hbs.handlebars.registerHelper('if_eq', function (a, b, opts) {
  if (a == b) {
    return opts.fn(this);
  } else {
    return opts.inverse(this);
  }
});

route(app);


app.listen(port, () => {
  console.log(`App listening on port http://localhost:${port}`)
})