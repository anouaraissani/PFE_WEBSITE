const { getConnection, connect } = require('../db/connect')
const {queryCA1,
    queryCA1Exception,
    queryCA2,
    queryCA2Exception,
    queryCA3,
    queryCA3Exception,
    queryCA4,
    queryCA4Exception,
    queryCA1Mois,
    queryCA1MoisException,
    queryCA2Mois,
    queryCA2MoisException,
    queryCA3Mois,
    queryCA3MoisException,
    queryCA4Mois,
    queryCA4MoisException,
    queryCA5,
    queryCA5Exception,
    queryCA5Mois,
    queryCA5MoisException
} = require('../queries2')


const dashboardCA= async (req, res) => {
    const user = await req.user
    console.log('the user name: ',user)
    res.render('dashboards/dashboard_CA.ejs', { user })
} 

// Fonction pour récupérer le mois en cours - 1
function getCurrentMonth() {
    const dateTime = new Date().getMonth();
    return dateTime.toLocaleString();
};

// Query the database and fetch data
const fetchDataCA = async (req, res) =>{
    const queryCAAnnee = queryCA1
    const queryCATypeInter = queryCA2
    const queryCABranche = queryCA3
    const querCATableau = queryCA4
    const queryCATaux = queryCA5
    let currentMonth = getCurrentMonth()
    if(currentMonth === 0) {
        queryCAAnnee = queryCA1Exception
        queryCATypeInter = queryCA2Exception
        queryCABranche = queryCA3Exception
        querCATableau = queryCA4Exception
        queryCATaux = queryCA5Exception
    }
    try {
        await connect()
        const connection = await getConnection()
        //fetch the data from the database
        const result1 = await connection.execute(queryCAAnnee)
        const result2 = await connection.execute(queryCATypeInter)
        const result3 = await connection.execute(queryCABranche)
        const result4 = await connection.execute(querCATableau)
        const result5 = await connection.execute(queryCATaux)
        
        await connection.close()
        
        // --------------------------------------------------------------------------------------------------
        // Chiffre d'affaires par année
        const anneeActu12 = (result1.rows[0][0] / 1000000).toFixed(2);
        const anneePrec11 = (result1.rows[0][1] / 1000000).toFixed(2);
        const data1 = {
            label: "Règlements",
            anneePrec   : anneePrec11,
            anneeActu : anneeActu12
        }
        // Chiffre d'affaires par type d'intermediaire

        const data2 = {
            label: result2.rows.map(row => row[0]),
            anneeActu: result2.rows.map(row => (row[1] / 1000000).toFixed(2)),
            anneePrec : result2.rows.map(row => (row[2] / 1000000).toFixed(2)),
        }

        // Chiffre d'affaires par Catégorie

        const data3 = {
            label: result3.rows.map(row => row[0]),
            anneeActu: result3.rows.map(row => (row[1] / 1000000).toFixed(2)),
            anneePrec: result3.rows.map(row => (row[2] / 1000000).toFixed(2)),
        }

        // Tableau

         const data4 = result4.rows.map((row) => [row[0], row[1], row[2], row[3], (row[4] / 1000000).toFixed(2)]);

        // Taux

        const data5 = Math.round(result5.rows[0] * 100) / 100;


        // --------------------------------------------------------------------------------------------------
        // combine data in one variable "data"
        const data = {
            data1: data1,
            data2: data2,
            data3: data3,
            data4 : data4,
            data5 : data5
        };
        /* console.log('fetch data:',data) */
        res.json(data);
    }catch (error) {
        console.error(error);
    }
}

const fetchDataCAMois = async (req, res) =>{
    const queryCAAnnee = queryCA1Mois
    const queryCATypeInter = queryCA2Mois
    const queryCABranche = queryCA3Mois
    const querCATableau = queryCA4Mois
    const queryCATaux = queryCA5Mois
    let currentMonth = getCurrentMonth()
    if(currentMonth === 0) {
        queryCAAnnee = queryCA1MoisException
        queryCATypeInter = queryCA2MoisException
        queryCABranche = queryCA3MoisException
        querCATableau = queryCA4MoisException
        queryCATaux = queryCA5MoisException
    }
    try {
        await connect()
        const connection = await getConnection()
        const result1 = await connection.execute(queryCAAnnee)
        const result2 = await connection.execute(queryCATypeInter)
        const result3 = await connection.execute(queryCABranche)
        const result4 = await connection.execute(querCATableau)
        const result5 = await connection.execute(queryCATaux)
        
        await connection.close()
        // --------------------------------------------------------------------------------------------------
        // Chiffre d'affaires par année
        const anneeActu12 = (result1.rows[0][0] / 1000000).toFixed(2);
        const anneePrec11 = (result1.rows[0][1] / 1000000).toFixed(2);
        const data1 = {
            label: "Règlements",
            anneePrec   : anneePrec11,
            anneeActu : anneeActu12
        }
        // Chiffre d'affaires par type d'intermediaire

        const data2 = {
            label: result2.rows.map(row => row[0]),
            anneeActu: result2.rows.map(row => (row[1] / 1000000).toFixed(2)),
            anneePrec: result2.rows.map(row => (row[2] / 1000000).toFixed(2)),
        }

        // Chiffre d'affaires par Catégorie

        const data3 = {
            label: result3.rows.map(row => row[0]),
            anneeActu: result3.rows.map(row => (row[1] / 1000000).toFixed(2)),
            anneePrec: result3.rows.map(row => (row[2] / 1000000).toFixed(2)),
        }

        // Tableau

         const data4 = result4.rows.map((row) => [row[0], row[1], row[2], row[3], (row[4] / 1000000).toFixed(2)]);

         // Taux
         const data5 = Math.round(result5.rows[0] * 100) / 100;

        // --------------------------------------------------------------------------------------------------
        // combine data in one variable "data"
        const data = {
            data1: data1,
            data2: data2,
            data3: data3,
            data4 : data4,
            data5 : data5

        };
        /* console.log('fetch data:',data) */
        res.json(data);
    }catch (error) {
        console.error(error);
    }
}

module.exports={dashboardCA, fetchDataCA, fetchDataCAMois}