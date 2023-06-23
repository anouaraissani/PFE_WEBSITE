
const { getConnection, connect } = require('../db/connect')
const {queryT_CA, queryT_NBC, queryT_RS, queryTopBranches, queryTopBranchesP, queryTopBranchesR} = require('../queries')

const dashboard = async (req, res) => {
    const user = await req.user
    res.render('index.ejs', { user })
} 

const dashboardGA = async (req, res) => {
    const user = await req.user;
    res.render('dashboards/globalActivity.ejs', { user });
}

// Query the database and fetch data
const fetchDataGA= async (req, res) =>{
    try {
        await connect()
        const connection = await getConnection()
        //fetch the data from the database
        const result1 = await connection.execute(queryT_CA)
        const result2 = await connection.execute(queryT_NBC)
        const result3 = await connection.execute(queryT_RS)
        // card2
        const resultC21 = await connection.execute(queryTopBranches)
        //put topBranches values in an array
        const topBranches = resultC21.rows.map(row => row[0])
        // create brancheRows vaiable that contains rows of branch, avg(ca), avg(nbc)
        const branchepRows = {}
        const brancherRows = {}
        for (const branche of topBranches) {
            const branchep = await connection.execute(queryTopBranchesP, {branche})
            const branchr  = await connection.execute(queryTopBranchesR, {branche})
            branchepRows[branche] = branchep.rows
            brancherRows[branche] = branchr.rows
        }
        const branchesRows = Object.keys(branchepRows).map(branch => [branch, ...branchepRows[branch][0], ...brancherRows[branch][0]])
        // console.log(branchesRows)

        const branchesRowsUpdated = branchesRows.map(row => [
            row[0],
            Math.round(row[1] / 1000000)+ ' M',
            Math.round(row[2]),
            Math.round(row[3] / 1000000000)+' Mrd'
          ])
        //   console.log(branchesRowsUpdated)
        await connection.close()
        // --------------------------------------------------------------------------------------------------
        //CARD 1
        // --------------------------------------------------------------------------------------------------
        //Chiffre d'Affaire
        const r1 = (result1.rows[0] / 1000000).toFixed(0);
        const data11 = {
            label: "Chiffre d'Affaire",
            data: r1   
        }
        // Nombre Contrats
        const data12 = {
            label: "Nombre Contrats",
            data: result2.rows[0]    
        }
        // Règlements Sinistre
        const r3 = (result3.rows[0] / 1000000).toFixed(0);
        const data13 = {
            label: "Règlements Sinistres",
            data: r3   
        }
        const data1 = {
            data11: data11,
            data12: data12,
            data13: data13,
        }
        // --------------------------------------------------------------------------------------------------
        //CARD 2
        // --------------------------------------------------------------------------------------------------
        
        const data2 = branchesRowsUpdated

        // --------------------------------------------------------------------------------------------------
        //CARD 3
        // --------------------------------------------------------------------------------------------------
        
        // combine data in one variable "data"
        const data = {
            data1: data1,
            data2: data2,
            // data3: data3,
            // data4: data4,
            // data5: data5,
            // data6: data6,
        }
        // console.log(data.data2[0])
        // console.log('fetch data:',data)
        res.json(data)
    }catch (error) {
        console.error(error)
    }
}

module.exports={dashboard, dashboardGA, fetchDataGA}