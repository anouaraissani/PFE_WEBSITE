const { getConnection, connect } = require('../db/connect')
const {queryR1, queryR1Exception, queryR2, queryR2Exception, queryR3, queryR3Exception , queryR4, queryR4Exception,
    queryR1Mois, queryR1MoisException, queryR2Mois, queryR2MoisException, queryR3Mois, queryR3MoisException , queryR4Mois, queryR4MoisException,
    queryR5, queryR5Exception, queryR5Mois, queryR5MoisException
} = require('../queries2')


const dashboardR= async (req, res) => {
    const user = await req.user
    console.log('the user name: ',user)
    res.render('dashboards/dashboard_R.ejs', { user })
} 

// Fonction pour récupérer le mois en cours - 1
function getCurrentMonth() {
    const dateTime = new Date().getMonth();
    return dateTime.toLocaleString();
};

// Query the database and fetch data
const fetchDataR = async (req, res) =>{
    const queryRAneee = queryR1
    const querRTypeInter = queryR2
    const queryRBranche = queryR3
    const queryRTableau = queryR4
    const queryRTaux = queryR5
    let currentMonth = getCurrentMonth()
    if(currentMonth === 0) {
        queryRAneee = queryR1Exception
        querRTypeInter = queryR2Exception
        queryRBranche = queryR3Exception
        queryRTableau = queryR4Exception
        queryRTaux = queryR5Exception
    }
    try {
        await connect()
        const connection = await getConnection()
        //fetch the data from the database
        const result1 = await connection.execute(queryRAneee)
        const result2 = await connection.execute(querRTypeInter)
        const result3 = await connection.execute(queryRBranche)
        const result4 = await connection.execute(queryRTableau)
        const result5 = await connection.execute(queryRTaux)
        
        await connection.close()
        
        // --------------------------------------------------------------------------------------------------
        // Règlements par année
        const anneeActu12 = (result1.rows[0][0] / 1000000).toFixed(2);
        const anneePrec11 = (result1.rows[0][1] / 1000000).toFixed(2);
        const data1 = {
            label: "Règlements",
            anneePrec   : anneePrec11,
            anneeActu : anneeActu12
        }
        // Règlements par type d'intermediaire

        const data2 = {
            label: result2.rows.map(row => row[0]),
            anneeActu: result2.rows.map(row => (row[1] / 1000000).toFixed(2)),
            anneePrec : result2.rows.map(row => (row[2] / 1000000).toFixed(2)),
        }

        // Règlements par Catégorie

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

const fetchDataRMois = async (req, res) =>{
    const queryRAneee = queryR1Mois
    const querRTypeInter = queryR2Mois
    const queryRBranche = queryR3Mois
    const queryRTableau = queryR4Mois
    const queryRTaux = queryR5Mois
    let currentMonth = getCurrentMonth()
    if(currentMonth === 0) {
        queryRAneee = queryR1MoisException
        querRTypeInter = queryR2MoisException
        queryRBranche = queryR3MoisException
        queryRTableau = queryR4MoisException
        queryRTaux = queryR5MoisException
    }
    try {
        await connect()
        const connection = await getConnection()
        //fetch the data from the database
        const result1 = await connection.execute(queryRAneee)
        const result2 = await connection.execute(querRTypeInter)
        const result3 = await connection.execute(queryRBranche)
        const result4 = await connection.execute(queryRTableau)
        const result5 = await connection.execute(queryRTaux)
        
        await connection.close()
        // --------------------------------------------------------------------------------------------------
        // Règlements par année
        const anneeActu12 = (result1.rows[0][0] / 1000000).toFixed(2);
        const anneePrec11 = (result1.rows[0][1] / 1000000).toFixed(2);
        const data1 = {
            label: "Règlements",
            anneePrec   : anneePrec11,
            anneeActu : anneeActu12
        }
        // Règlements par type d'intermediaire

        const data2 = {
            label: result2.rows.map(row => row[0]),
            anneeActu: result2.rows.map(row => (row[1] / 1000000).toFixed(2)),
            anneePrec: result2.rows.map(row => (row[2] / 1000000).toFixed(2)),
        }

        // Règlements par Catégorie

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

module.exports={dashboardR, fetchDataR, fetchDataRMois}