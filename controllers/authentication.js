const { getConnection, connect, closePool } = require('../db/connect')
//authentication middleware 
const passport = require('passport')

const getLogin = (req, res) => {
    res.render('login.ejs')
}

const postLogin = passport.authenticate('local', {
    successRedirect: '/dashboard',
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

const dashboard = async (req, res) => {
    const user = await req.user
    console.log('the user name: ',user.name)
    res.render('index.ejs', { name: user.name })
}   

module.exports = {getLogin, postLogin, logout, dashboard}