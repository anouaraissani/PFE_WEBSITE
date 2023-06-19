const { getConnection, connect } = require('../db/connect')
const path = require('path')

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


module.exports = {userspage, getUserCount, fetchDataUsers}