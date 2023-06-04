const express = require('express')
const router = express.Router()
const {dashboard, dashboardCA, fetchDataCA} = require('../controllers/dashboard')
const {dashboardContrats} = require('../controllers/dashboard-contrats')
const {checkAuthenticated} = require('../middlewares/authentification')
//use static files(.css, .html, ...)
router.use(express.static('./views'))

router.get('/', checkAuthenticated, dashboard)
router.get('/api/dataCA', checkAuthenticated, fetchDataCA)
router.get('/chiffre-daffaire', checkAuthenticated, dashboardCA)
router.get('/nombre-de-contrats', checkAuthenticated, dashboardContrats);

module.exports = router