require('dotenv').config();
express = require("express");
bodyParser = require("body-parser");
ejs = require("ejs");
mongoose = require("mongoose");
encrypt = require("mongoose-encryption");
md5 = require("md5");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"));
app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/user2DB", {useNewUrlParser: true});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const user2 = mongoose.model("user2", userSchema);


app.get("/", function(req,res){
  res.render("home");
});

app.get("/login", function(req,res){
  res.render("login");
});

app.get("/register", function(req,res){
  res.render("register");
});

app.post("/register", function(req,res){
  const newUser = new user2({
    email: req.body.username,
    password: md5(req.body.password)
  });
  newUser.save(function(err){
    if (err){
      console.log(err);
    } else {
      res.render("secrets");
    };
  });
});

app.post("/login", function(req, res){
  const uName = req.body.username;
  const pWord = md5(req.body.password);

  user2.findOne({email: uName}, function(err, foundUser){
    if (err) {
      console.log(err);
    } else {
      if (foundUser.password === pWord) {
        res.render("secrets");
      } else {
        res.send("Nothing found!");
      }
    }
  });
});

app.listen(3000, function(){
  console.log("The server is working on port 3000.");
});
