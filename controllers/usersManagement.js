const { getConnection, connect } = require('../db/connect')
//hash and compare passwords
const bcrypt = require('bcrypt')

// get users management page
const userspage = async (req, res) => {
    const user = await req.user
    res.render('usersManagement.ejs', {user})
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

const getRegister = async (req, res) => {
    const user = await req.user
    res.render('register.ejs', {user})
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


const editUser = async (req, res) => {
    try {
        const user = await req.user
        const id = req.params.id;
        await connect();
        const connection = await getConnection();
        const result = await connection.execute(`SELECT * FROM USERS WHERE TO_NUMBER(id) = :id`, {id})
        await connection.execute(`commit`)
        const useredit = result.rows[0]
        await connection.close()
        res.render('editUser.ejs', {useredit, user} )
    } catch (error) {
        console.error(error);
    }
}

const updateUser = async (req, res) =>{
    
    try {
        const {name, email, password, role} = req.body
          //hash the password of the new user
        const hashedPassword = await bcrypt.hash(password, 10)
        const id = req.params.id
        await connect();
        const connection = await getConnection()
        await connection.execute(`UPDATE USERS SET NAME = :name, email = :email, password = :hashedPassword, role = :role WHERE id = :id`, {name, email, hashedPassword, role, id})
        await connection.execute(`commit`)
        await connection.close()
        // const filePath = path.join(__dirname, '../public/html/usersManagement.html')
        // res.sendFile(filePath)
        res.redirect('/usersmanagement')
        } catch (error) {
        console.error(error)
    }
}


const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        await connect();
        const connection = await getConnection();
        await connection.execute(`DELETE FROM USERS WHERE TO_NUMBER(id) = :id`, {id})
        await connection.execute(`commit`)
        await connection.close();
    
        res.redirect('/usersmanagement')
        } catch (error) {
        console.error(error);
    }
}
module.exports = {userspage, getUserCount, fetchDataUsers, getRegister, postRegister, deleteUser, editUser, updateUser}