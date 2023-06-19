const { getConnection, connect } = require('../db/connect')
const path = require('path')
//hash and compare passwords
const bcrypt = require('bcrypt')

// get users management page
const userspage = (req, res) => {
    const filePath = path.join(__dirname, '../public/html/usersManagement.html')
    res.sendFile(filePath);
}

//get the total number of users 
const getUserCount = async (req, res) => {
    try {
        await connect();
        const connection = await getConnection();
        const result = await connection.execute(`SELECT COUNT(*) AS count FROM users`);
        await connection.close()
    
        // const count = result.rows[0].count;
        const count = result.rows[0];
        res.json({ count });
        } catch (error) {
        console.error(error);
        }
}

// get the users data from the database
const fetchDataUsers = async (req, res) =>{
    try {
        await connect()
        const connection = await getConnection()
        //fetch the data from the database
        // const users = await connection.execute(`SELECT id, email, name, role FROM users`)
        const users = await connection.execute(`SELECT id, email, name, role FROM users`)
        await connection.close()
        res.json(users.rows)
    }catch (error) {
        console.error(error);
    }
}

const getRegister = (req, res) => {
    res.render('register.ejs')
}

const postRegister = async (req, res) => {
    try {
      //hash the password of the new user
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    await connect()
    const connection = await getConnection()
      //store the new user in our database
    await connection.execute(
        `INSERT INTO users (id, name, email, password, role) VALUES (${Date.now()}, '${req.body.name}', '${req.body.email}', '${hashedPassword}', '${req.body.role}')`
    );
    await connection.execute(
        `commit`
    );
    await connection.close();
      //if the registration is succefull, redirect to user management page
    res.redirect('/usersmanagement')
    } catch (e){
    console.error(e)
      //if the registration is failed, redirect to registration page
    res.redirect('/usersmanagement/register')
    }
}
module.exports = {userspage, getUserCount, fetchDataUsers, getRegister, postRegister}