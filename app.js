if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require("express");
const app = express();
const port = 8000;
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const engine = require("ejs-mate");
const path = require("path");
const flash = require("connect-flash");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./modules/user.js");
const signupRouter = require("./views/routes/signup.js");
const router = require("./views/routes/router-auth.js");


const db_url = process.env.MONGOATLS_DB;
// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, 'public')));
app.engine('ejs', engine);

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


// mongo store
const store = MongoStore.create({
    mongoUrl: db_url,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 3600,
});

store.on("error",(err)=>{
    console.log("ERROR IN MONGO SESSION STORE",err);
})
// Session configuration
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
};


app.use(session(sessionOptions));
app.use(flash());

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash messages middleware
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
});

// Database connection
const dbConnection = async () => {
    try {
        await mongoose.connect(db_url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("DB connected successfully");
    } catch (err) {
        console.log("Error in DB connection", err);
    }
};

dbConnection();

// Routers
app.use("/", signupRouter);
app.use("/", router);

// Error-handling middleware
app.use((error, req, res, next) => {
    const statusCode = error.status || 500;
    const message = error.message || 'Something went wrong on the server';
    res.status(statusCode).send(message);
});

app.listen(port, () => {
    console.log(`App started on port ${port}`);
});
