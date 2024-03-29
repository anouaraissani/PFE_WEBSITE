const express = require('express')
const router = express.Router()
const {getLogin, postLogin, logout} = require('../controllers/authentication')
const {checkNotAuthenticated} = require('../middlewares/authentification')
const { getConnection, connect} = require('../db/connect')

//authentication middleware 
const passport = require('passport')
router.use(express.json())

const initialize = require('../passport-config')
initialize(
    passport,
    //getUserByEmail 
    async (email) => {
        try {
            await connect()
            const connection = await getConnection()
            const result = await connection.execute(
            'SELECT * FROM users WHERE email = :email',{email})
            await connection.close()
            if (result.rows.length > 0) {
                const user = {};
                const metaData = result.metaData;
                const row = result.rows[0];
                //from array to json format
                for (let i = 0; i < metaData.length; i++) {
                    const columnName = metaData[i].name.toLowerCase();
                    user[columnName] = row[i];
                }
            return user
            }
        } catch (error) {
            console.error(error)
        }
    },
    //getUserById
    async (id) => {
        try {
            await connect()
            const connection = await getConnection()
            const result = await connection.execute(
            'SELECT * FROM users WHERE TO_NUMBER(id) = :id',{id})
            await connection.close();
            if (result.rows.length > 0) {
                const user = {};
                const metaData = result.metaData;
                const row = result.rows[0];
                //from array to json format
                for (let i = 0; i < metaData.length; i++) {
                    const columnName = metaData[i].name.toLowerCase();
                    user[columnName] = row[i];
                }
                return user
            }
        } catch (error) {
            console.error(error)
        }
    }
)

router.use(passport.initialize())

//use static files(.css, .html, ...)
router.use(express.static('./views'))
//login
router.route('/login').get(checkNotAuthenticated, getLogin).post(checkNotAuthenticated, postLogin)
//logout
router.get('/logout', logout)
module.exports = router