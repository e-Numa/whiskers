const express = require("express"),
    app = express(),
    flash = require("connect-flash"),
    { urlencoded } = require("express"),
    mongoose = require('mongoose'),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Pet = require("./models/pet"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    seedDB = require("./seed");

const petsRoute = require("./routes/pets"),
    commentsRoute = require("./routes/comments"),
    authRoute = require("./routes/auth");

const port = process.env.PORT || 3000;

mongoose.connect('mongodb+srv://enumauzoegwu:April05@savilock.yfqi4gj.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to DB!'))
    .catch(error => console.log(error.message));

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// Passport configuration

// Passport configuration
app.use(require("express-session")({
    secret: "Deal with it",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", authRoute);
app.use("/pets", petsRoute);
app.use("/pets/:id/comments", commentsRoute);

app.listen(port, function () {
    console.log("Whiskers started running on port 3000");
});