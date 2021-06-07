const pool = require("../db1");
const bcrypt = require("bcrypt");
const LocalStrategy = require('passport-local').Strategy;

function passportConfig(passport) {
    passport.use(new LocalStrategy(
        function (username, password, done) {
            pool.query('SELECT user_id, user_email, user_password FROM users WHERE user_email = $1',
                [username], (err, user) => {
                    if (err) { return done(err); }
                    if (!user) {
                        return done(null, false, { message: 'Incorrect username.' });
                    }
                    bcrypt.compare(password, user.user_password, (err, result) => {
                        if (err) throw err;
                        if (result == false) {
                            return done(null, false, { message: 'Incorrect password.' });
                        } else {
                            return done(null, user);
                        }
                    });
                });
        }
    ));

    passport.serializeUser((user, done) => {
        done(null, user.user_id);
    });

    passport.deserializeUser((id, cb) => {
        pool.query('SELECT user_email FROM users WHERE user_id = $1', [id], (err, user) => {
            const userInformation = {
            username: user.user_email,
            };
            cb(err, userInformation);
        });
    });
}

module.exports = passportConfig;