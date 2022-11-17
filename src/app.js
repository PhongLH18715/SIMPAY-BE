const express = require('express');
const path = require('path');
const passport = require("passport");
const cors = require('cors');
const cookieParser = require('cookie-parser');
const {jwtStrategy} = require("./config/passport.config");
const routes = require('./routes/api');
const {errorConverter, errorHandler} = require("./middlewares/error.middleware");
const config = require('./config');
const app = express();


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, './public')));

app.use(cookieParser(config.jwt.secret));

app.use(cors());
app.options('*', cors());

app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

app.use('/api', routes);

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);


module.exports = app;
