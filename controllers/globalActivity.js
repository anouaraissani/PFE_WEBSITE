
const { getConnection, connect } = require('../db/connect')
const {queryT_CA, queryT_NBC, queryT_RS, queryTopBranches, queryTopBranchesP, queryTopBranchesR, queryTopInter, queryTopInterP, queryTopInterR, queryCA1, q, queryTopYearsP, queryTopYearsRS} = require('../queries')

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
        // -----------------------------------------------------------------------
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

        //------------------------------------------------------------------------------------------------
        // card3
        const resultC31 = await connection.execute(queryTopInter)
        //put topInters values in an array
        const topInter = resultC31.rows.map(row => row[0])
        // create interRows vaiable that contains rows ofinter, avg(ca), avg(nbc)
        const InterpRows = {}
        const InterrRows = {}
        for (const Inter of topInter) {
            const Interp = await connection.execute(queryTopInterP, {Inter})
            const interr  = await connection.execute(queryTopInterR, {Inter})
            InterpRows[Inter] = Interp.rows
            InterrRows[Inter] = interr.rows
        }
        //------------------------------------------------------------------------------------------------
        // card4
        const result4 = await connection.execute(queryCA1)
        
        //put years values in an array
        const yearArray = result4.rows.map(row => row[0]);
        // create CA_annee_mois vaiable that contains "CA par mois pour chaque année"
        const CA_annee_mois = {}
        for (const annee of yearArray) {
            const d = await connection.execute(q, {annee});
            CA_annee_mois[annee] = d;
        } 
        //------------------------------------------------------------------------------------------------
        // card5
        const resultC51 = await connection.execute(queryTopYearsP)
        // console.log('best years revenue',resultC51)
        //put topYears values in an array
        const topYears = resultC51.rows.map(row => row[0])
        // create yearsRSRows variable that contains rows of years, sum(montrgl)
        const yearsRSRows = {};

        topYears.forEach((year) => {
        yearsRSRows[year] = null;
        });

        for (const year of topYears) {
        const yearrs = await connection.execute(queryTopYearsRS, { year });
        yearsRSRows[year] = yearrs.rows;
        }

        // console.log('RS pour chaque annee',yearsRSRows)
        //close the database connection
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
        const branchesRows = Object.keys(branchepRows).map(branch => [branch, ...branchepRows[branch][0], ...brancherRows[branch][0]])
        const branchesRowsUpdated = branchesRows.map(row => [
            row[0],
            Math.round(row[1] / 1000000)+ ' M',
            Math.round(row[2]),
            Math.round(row[3] / 1000000000)+' Mrd'
        ])
        const data2 = branchesRowsUpdated

        // --------------------------------------------------------------------------------------------------
        //CARD 3
        // --------------------------------------------------------------------------------------------------
        const IntersRows = Object.keys(InterpRows).map(inter => [inter, ...InterpRows[inter][0], ...InterrRows[inter][0]])
          // console.log(IntersRows)

        const IntersRowsUpdated = IntersRows.map(row => [
                row[0],
                (row[1] / 1000000).toFixed(2) + ' M',
                // row[1],
                Math.round(row[2]),
                Math.round(row[3] / 1000000)+' M'
            ])
        const data3 = IntersRowsUpdated
        // --------------------------------------------------------------------------------------------------
        //CARD 4
        // --------------------------------------------------------------------------------------------------
        // CA par année
        const CA_annee = result4.rows.map(row => {
            return {
                'annee': parseInt(row[0]),
                'ca': (row[1]/1000000)
            };
        });
        const data4 = CA_annee.map(item => ({
            annee: item.annee,
            ca: item.ca,
            moisData: CA_annee_mois[item.annee.toString()].rows.map(row => ({
                mois: row[0],
                ca: row[1]
            }))
        }))
        // --------------------------------------------------------------------------------------------------
        //CARD 5
        // --------------------------------------------------------------------------------------------------
        const yearsRows = resultC51.rows.map((row) => {
            const year = row[0];
            const ca = row[1];
            const nc = row[2];
            const rs = yearsRSRows[year][0][0];
            return [year, ca, nc, rs];
          });
          
        //   console.log('p + rs', yearsRows);
        const yearsRowsUpdated = yearsRows.map(row => [
                row[0],
                Math.round(row[1] / 1000000) + ' M',
                // row[1],
                Math.round(row[2]),
                Math.round(row[3] / 1000000)+' M'
            ])
            console.log(yearsRowsUpdated)
        const data5 = yearsRowsUpdated
        // console.log(data5)
        // combine data in one variable "data"
        const data = {
            data1: data1,
            data2: data2,
            data3: data3,
            data4: data4,
            data5: data5,
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