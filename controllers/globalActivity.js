
const { getConnection, connect } = require('../db/connect')
const {queryT_CA, queryT_NBC, queryT_RS} = require('../queries')

const dashboard = async (req, res) => {
    const user = await req.user
    console.log('the user name: ',user.name)
    res.render('index.ejs', { name: user.name })
} 

const dashboardGA = async (req, res) => {
    const user = await req.user;
    console.log('the user name: ', user.name);
    res.render('dashboards/globalActivity.ejs', { name: user.name });
  };

// Query the database and fetch data
const fetchDataGA= async (req, res) =>{
    try {
        await connect()
        const connection = await getConnection()
        //fetch the data from the database
        const result1 = await connection.execute(queryT_CA)
        const result2 = await connection.execute(queryT_NBC)
        const result3 = await connection.execute(queryT_RS)
        // const result5 = await connection.execute(queryCA5)
        // const result6 = await connection.execute(queryCA6)
        
        await connection.close()
        // --------------------------------------------------------------------------------------------------
        //GRAPH 1
        // --------------------------------------------------------------------------------------------------
        //Chiffre d'Affaire
        const data11 = (result1.rows[0] / 1000000000).toFixed(2);
        const data1 = {
            label: "Chiffre d'Affaire",
            data: data11    
        }
        // Nombre Contrats
        const data2 = {
            label: "Nombre Contrats",
            data: result2.rows[0]    
        }
        // Règlements Sinistre
        const data31 = (result3.rows[0] / 1000000).toFixed(2);
        const data3 = {
            label: "Règlements Sinistres",
            data: data31   
        }
        // --------------------------------------------------------------------------------------------------
        // combine data in one variable "data"
        const data = {
            data1: data1,
            data2: data2,
            data3: data3,
            // data4: data4,
            // data5: data5,
            // data6: data6,
        };
        // console.log('fetch data:',data)
        res.json(data);
    }catch (error) {
        console.error(error);
    }
}

module.exports={dashboard, dashboardGA, fetchDataGA}