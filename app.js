const express = require("express"),

    expressLayouts = require("express-ejs-layouts"),

    mongoose = require("mongoose"),

    db = require("./config/keys").mongoURI,

    flash = require("connect-flash"),

    session = require("express-session"),

    passport = require("passport"),

    PORT = process.env.PORT || 5000,

    app = express();

// Passport config
require("./config/passport")(passport);

// BodyParser
app.use(express.urlencoded({ extended: false }));

// Session
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
        // ,cookie: { secure: true }
}))

// Passport init 
app.use(passport.initialize());
// Passport session
app.use(passport.session());

// Connect flash
app.use(flash())
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    next()
})

// EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

// Routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/user"));

// Listen
app.listen(PORT, console.log(`Server listening at ${PORT}`));

// Connect to mongoSdb
mongoose.connect(db, { useNewUrlParser: true })
    .then(() => console.log("mongoDB connected..."))
    .catch(err => console.log(err));