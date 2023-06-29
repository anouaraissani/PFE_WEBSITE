const express = require('express')
const router = express.Router()
const {dashboard/* , dashboardCA, fetchDataCA */} = require('../controllers/dashboard')
const {dashboardContrats} = require('../controllers/dashboard-contrats')
const {checkAuthenticated} = require('../middlewares/authentification')
const { dashboardGA, fetchDataGA } = require('../controllers/globalActivity')
const { dashboardR, fetchDataR, fetchDataRMois } = require('../controllers/dashboard-reglements')
const { dashboardCA, fetchDataCA, fetchDataCAMois } = require('../controllers/dashboard-ca')
const { dashboardC, fetchDataC, fetchDataCMois } = require('../controllers/dashboard-contrats')
//use static files(.css, .html, ...)
router.use(express.static('./views'))

router.get('/', checkAuthenticated, dashboard)
router.get('/api/dataCA', checkAuthenticated, fetchDataCA)
router.get('/chiffre-daffaire', checkAuthenticated, dashboardCA)

// Activité Globale dashboard
router.get('/api/dataGA', checkAuthenticated, fetchDataGA)
router.get('/activite-globale', checkAuthenticated, dashboardGA)

//  Dashboard des règlements
router.get('/api/dataR', checkAuthenticated, fetchDataR)
router.get('/api/dataRMois', checkAuthenticated, fetchDataRMois)
router.get('/reglements', checkAuthenticated, dashboardR)

//  Dashboard des chiffre d'affaies
router.get('/api/dataCA', checkAuthenticated, fetchDataCA)
router.get('/api/dataCAMois', checkAuthenticated, fetchDataCAMois)
router.get('/chiffre-d-affaires', checkAuthenticated, dashboardCA)


//  Dashboard des contrats
router.get('/api/dataC', checkAuthenticated, fetchDataC)
router.get('/api/dataCMois', checkAuthenticated, fetchDataCMois)
router.get('/nombre-de-contrats', checkAuthenticated, dashboardC)

module.exports = router