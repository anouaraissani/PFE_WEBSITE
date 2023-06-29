const { getConnection, connect } = require('../db/connect')
const {queryC1,
    queryC1Exception,
    queryC2,
    queryC2Exception,
    queryC3,
    queryC3Exception,
    queryC4,
    queryC4Exception,
    queryC1Mois,
    queryC1MoisException,
    queryC2Mois,
    queryC2MoisException,
    queryC3Mois,
    queryC3MoisException,
    queryC4Mois,
    queryC4MoisException,
    queryC5,
    queryC5Exception,
    queryC5Mois,
    queryC5MoisException
} = require('../queries2')


const dashboardC= async (req, res) => {
    const user = await req.user
    console.log('the user name: ',user)
    res.render('dashboards/dashboard_C.ejs', { user })
} 

// Fonction pour récupérer le mois en cours - 1
function getCurrentMonth() {
    const dateTime = new Date().getMonth();
    return dateTime.toLocaleString();
};

// Query the database and fetch data
const fetchDataC = async (req, res) =>{
    const queryCAnnee = queryC1
    const queryCTypeInter = queryC2
    const queryCBranche = queryC3
    const querCTableau = queryC4
    const queryCTaux = queryC5
    let currentMonth = getCurrentMonth()
    if(currentMonth === 0) {
        queryCAnnee = queryC1Exception
        queryCTypeInter = queryC2Exception
        queryCBranche = queryC3Exception
        querCTableau = queryC4Exception
        queryCTaux = queryC5Exception
    }
    try {
        await connect()
        const connection = await getConnection()
        //fetch the data from the database
        const result1 = await connection.execute(queryCAnnee)
        const result2 = await connection.execute(queryCTypeInter)
        const result3 = await connection.execute(queryCBranche)
        const result4 = await connection.execute(querCTableau)
        const result5 = await connection.execute(queryCTaux)
        
        await connection.close()
        
        // --------------------------------------------------------------------------------------------------
        // Contrats par année
        const anneeActu12 = (result1.rows[0][0]);
        const anneePrec11 = (result1.rows[0][1]);
        const data1 = {
            label: "Contrats",
            anneePrec   : anneePrec11,
            anneeActu : anneeActu12
        }
        // Contrats par type d'intermediaire

        const data2 = {
            label: result2.rows.map(row => row[0]),
            anneeActu: result2.rows.map(row => (row[1])),
            anneePrec : result2.rows.map(row => (row[2])),
        }

        // Contrats par Catégorie

        const data3 = {
            label: result3.rows.map(row => row[0]),
            anneeActu: result3.rows.map(row => (row[1] )),
            anneePrec: result3.rows.map(row => (row[2] )),
        }

        // Tableau

         const data4 = result4.rows.map((row) => [row[0], row[1], row[2], row[3], (row[4] )]);

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
        console.log('fetch data:',data)
        res.json(data);
    }catch (error) {
        console.error(error);
    }
}

const fetchDataCMois = async (req, res) =>{
    const queryCAnnee = queryC1Mois
    const queryCTypeInter = queryC2Mois
    const queryCBranche = queryC3Mois
    const querCTableau = queryC4Mois
    const queryCTaux = queryC5Mois
    let currentMonth = getCurrentMonth()
    if(currentMonth === 0) {
        queryCAnnee = queryC1MoisException
        queryCTypeInter = queryC2MoisException
        queryCBranche = queryC3MoisException
        querCTableau = queryC4MoisException
        queryCTaux = queryC5MoisException
    }
    try {
        await connect()
        const connection = await getConnection()
        const result1 = await connection.execute(queryCAnnee)
        const result2 = await connection.execute(queryCTypeInter)
        const result3 = await connection.execute(queryCBranche)
        const result4 = await connection.execute(querCTableau)
        const result5 = await connection.execute(queryCTaux)
        
        await connection.close()
        // --------------------------------------------------------------------------------------------------
        // Contrats par année
        const anneeActu12 = (result1.rows[0][0] );
        const anneePrec11 = (result1.rows[0][1] );
        const data1 = {
            label: "Contrats",
            anneePrec   : anneePrec11,
            anneeActu : anneeActu12
        }
        // Contrats par type d'intermediaire

        const data2 = {
            label: result2.rows.map(row => row[0]),
            anneeActu: result2.rows.map(row => (row[1] )),
            anneePrec: result2.rows.map(row => (row[2] )),
        }

        // Contrats par Catégorie

        const data3 = {
            label: result3.rows.map(row => row[0]),
            anneeActu: result3.rows.map(row => (row[1] )),
            anneePrec: result3.rows.map(row => (row[2] )),
        }

        // Tableau

         const data4 = result4.rows.map((row) => [row[0], row[1], row[2], row[3], (row[4] )]);

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

module.exports={dashboardC, fetchDataC, fetchDataCMois}