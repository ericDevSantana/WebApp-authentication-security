//jshint esversion:6

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const ejs = require("ejs");

const app = express();

// To serve static files inside folder "public"
app.use(express.static("public"));

// Set the view engine to EJS
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const User = new mongoose.model("User", userSchema);

/////////////////////////////////////////GET////////////////////////////////////////////////////

app.get("/", function(req, res){
    res.render("home");
});

app.get("/login", function(req, res){
    res.render("login");
});

app.get("/register", function(req, res){
    res.render("register");
});

/////////////////////////////////////////POST//////////////////////////////////////////////////

app.post("/register", function(req, res){

    // Using bcrypt
    bcrypt.hash(req.body.password, saltRounds, function(err, hash){
        if(err){
            console.log(err);
        } else {
            const newUser = new User({
                email: req.body.username,
                password: hash
            });

            newUser.save(function(err){
                if(err) {
                    console.log(err);
                } else {
                    res.render("secrets");
                }
            });
        }
    });
});

app.post("/login", function(req, res){
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username}, function(err, foundUser){
        if(err){
            console.log(err);
        } else {
            if(foundUser) {
                bcrypt.compare(password, foundUser.password, function(err, results){
                    if(results === true){
                        res.render("secrets");
                    }
                });
            } else {
                console.log(password);
            }
        }
    });
});

app.listen(3000, function(){
    console.log("Server started on port 3000.");
});