//authentication middleware 
const passport = require('passport')

const getLogin = (req, res) => {
    res.render('login.ejs')
}

const postLogin = passport.authenticate('local', {
    successRedirect: '/dashboard/activite-globale',
    failureRedirect: '/auth/login',
    failureFlash: true
})

const logout = (req, res) => {

    req.logout(function(err) {
    if(err) {
        console.log(err);
    }
    res.redirect('/auth/login');
    })
}

module.exports = {getLogin, postLogin, logout}