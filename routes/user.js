const express = require("express"),

    router = express.Router(),

    bcrypt = require("bcryptjs"),

    User = require("../models/User"),

    passport = require("passport");
  
// Login route
router.get("/login", (req, res) => res.render("login"));
// Register route
router.get("/register", (req, res) => res.render("register"));

// Register Handler
router.post("/register", (req, res) => {

    const { name, email, password, password2 } = req.body;
    let errors = [];

    // Check  required fields
    if (!name || !email || !password || !password2) {
        errors.push({ msg: "Please all fill all the fields" });
    }
    // Check password match
    if (password !== password2) {
        errors.push({ msg: "Password deos not match" });
    }
    // Check password length
    if (password.length < 6) {
        errors.push({ msg: "Password must be at least 6 characters" });
    }
    if (errors.length > 0) {

        res.render("register", {
            errors,
            name,
            email,
            password,
            password2
        })

    } else {
        User.findOne({ email: email })
            .then((user) => {
                if (user) {

                    // User exists
                    errors.push({ msg: "Email is already registered" });
                    res.render("register", {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    })
                } else {
                    const newUser = new User({
                        name,
                        email,
                        password
                    });
                    // Hash password
                    bcrypt.genSalt(10, (err, salt) => {
                        if (err) throw err;
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            // Assign password to hashed
                            newUser.password = hash;
                            // Finally save new user to DB
                            newUser.save()
                                .then(user => {
                                    req.flash("success_msg", "Registered, Login now");
                                    res.redirect("/users/login")
                                })
                                .catch(err => console.log(err));

                        });
                    });

                    // console.log(newUser);
                    // res.end("loged in")

                }
            })
    }
});

// Login handle
router.post("/login", (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next)
})

// logout handle
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success_msg", "You're logedout")
    res.redirect("../users/login")

})

module.exports = router;