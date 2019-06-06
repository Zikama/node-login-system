const LocalStrategy = require("passport-local").Strategy,
    //mongoose = require("mongoose"),
    bcrypt = require("bcryptjs"),

    // User model here for check up
    User = require("../models/User");

module.exports = (passport) => {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
            // Match user email
            User.findOne({ email: email }, )
                .then(user => {
                    if (!user) {
                        return done(null, false, { message: 'That email is not registered' })
                    }
                    // match the user password
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) throw err;
                        if (isMatch) {
                            return done(null, user)
                        } else {
                            return done(null, false, { message: 'Password incorrect, check your password and try again!' })
                        }
                    })
                })
                .catch(err => console.log(err))
        })
    )
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });
}