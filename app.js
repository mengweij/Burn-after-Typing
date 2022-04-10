require('dotenv').config();
express = require("express");
bodyParser = require("body-parser");
ejs = require("ejs");
mongoose = require("mongoose");
session = require('express-session');
passport = require('passport');
passportLocalMongoose = require('passport-local-mongoose');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"));
app.set('view engine', 'ejs');

app.use(session({
  secret: "it is a smart key.",
  resave: false,
  saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/user2DB", {useNewUrlParser: true});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

userSchema.plugin(passportLocalMongoose);

const user2 = mongoose.model("user2", userSchema);

passport.use(user2.createStrategy());

passport.serializeUser(user2.serializeUser());
passport.deserializeUser(user2.deserializeUser());

app.get("/", function(req,res){
  res.render("home");
});

app.get("/login", function(req,res){
  res.render("login");
});

app.get("/register", function(req,res){
  res.render("register");
});

app.get("/secrets", function(req, res){
  if (req.isAuthenticated()){
    res.render("secrets");
  } else {
    res.redirect("/login");
  }
});

app.get("/logout", function(req, res){
  req.logout();
  res.redirect("/");
});

app.post("/register", function(req,res){

  user2.register({username: req.body.username, active: false}, req.body.password, function(err, user) {
    if (err) {
      console.log(err);
      res.redirect("/register");
    } else {
      passport.authenticate("local")(req, res, function(){
        res.redirect("/secrets");
      });
    }
  })

});

app.post("/login", function(req, res){

  const user = new user2({
    username: req.body.username,
    password: req.body.password
  });

//Passport exposes a login() function on req (also aliased as logIn()) that can be used to establish a login session.
  req.login(user, function(err) {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function(){
        res.redirect("/secrets");
      });
    }
  });
});

app.listen(3000, function(){
  console.log("The server is working on port 3000.");
});
