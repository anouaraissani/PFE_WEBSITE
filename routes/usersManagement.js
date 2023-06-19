const express = require('express')
const router = express.Router()
const {checkAuthenticated, checkNotAuthenticated} = require('../middlewares/authentification')
const {userspage, getUserCount, fetchDataUsers} = require('../controllers/usersManagement')


//use static files(.css, .html, ...)
router.use(express.static('./views'))

// router.get('/', checkAuthenticated, (req, res) => {
router.get('/', userspage)

// router.get('/users', checkAuthenticated, fetchDataUsers)
router.get('/api/users', fetchDataUsers)
// router.get('/users', checkAuthenticated, getUserCount)
router.get('/api/usercount', getUserCount)

module.exports = router