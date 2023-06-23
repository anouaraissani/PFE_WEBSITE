
const { getConnection, connect } = require('../db/connect')
const {queryCA1, queryCA2, queryCA3, queryCA4, queryCA5, queryCA6, q} = require('../queries')

const dashboard = async (req, res) => {
    const user = await req.user
    res.render('index.ejs', { user})
} 

const dashboardCA = async (req, res) => {
    const user = await req.user;
    res.render('dashboards/dashboard_CA.ejs', { user});
  };

// Query the database and fetch data
const fetchDataCA= async (req, res) =>{
    try {
        await connect()
        const connection = await getConnection()
        //fetch the data from the database
        const result1 = await connection.execute(queryCA1)
        const result2 = await connection.execute(queryCA2)
        const result4 = await connection.execute(queryCA4)
        const result5 = await connection.execute(queryCA5)
        const result6 = await connection.execute(queryCA6)
        
        //put years values in an array
        const yearArray = result1.rows.map(row => row[0]);
        // create CA_annee_mois vaiable that contains "CA par mois pour chaque année"
        const CA_annee_mois = {}
        for (const annee of yearArray) {
            const d = await connection.execute(q, {annee});
            CA_annee_mois[annee] = d;
        } 
        console.log(CA_annee_mois)
        // create CA_annee_trimestre vaiable that contains "CA par trimestre pour chaque année"
        const CA_annee_trimestre = {}
        for (const annee of yearArray) {
            const d = await connection.execute(queryCA3, {annee});
            CA_annee_trimestre[annee] = d;
        }  
        await connection.close()
        // --------------------------------------------------------------------------------------------------
        //GRAPH 1
        // --------------------------------------------------------------------------------------------------
        // CA par année
        const CA_annee = result1.rows.map(row => {
            return {
                'annee': parseInt(row[0]),
                'ca': row[1]
            };
        });

        // data1: for each year: total revenue + the revenue for each month
        const data1 = CA_annee.map(item => ({
            annee: item.annee,
            ca: item.ca,
            moisData: CA_annee_mois[item.annee.toString()].rows.map(row => ({
                mois: row[0],
                ca: row[1]
            }))
        }));
        // console.log('mergeddata bb:', data1);
        // --------------------------------------------------------------------------------------------------
        //GRAPH 2
    
        const data2 = {
            labels: result2.rows.map(row => row[0]),
            datasets: [{
                data: result2.rows.map(row => row[1])
            }]
        };
        // --------------------------------------------------------------------------------------------------
        // GRAPH 3 
        const datasets = [];

        for (let i = 1; i <= 4; i++) {
        const quarterData = {
            label: `T${i}`,
            data: Object.values(CA_annee_trimestre).map((yearData) => {
            const rows = yearData.rows;
            const row = rows.find((r) => r[0] === i);
            return row ? row[1] : 0;
            }),
        };
        datasets.push(quarterData);
        }   
        const data3 = {
            labels: yearArray,
            datasets: datasets
        };
        // --------------------------------------------------------------------------------------------------
        //GRAPH 4
        // Extract unique assurance branches from the data
        const assuranceBranches = Array.from(new Set(result4.rows.map(row => row[0])));

        // Create datasets
        const datasets4 = assuranceBranches.map(branch => {
        const branchData = [];
        for (const year of yearArray) {
            const row = result4.rows.find(row => row[0] === branch && row[1] === String(year));
            const revenue = row ? row[2] : 0;
            branchData.push(revenue);
        }
        return {
            label: branch,
            data: branchData
        };
        });

        const data4 = {
            labels: yearArray,
            datasets: datasets4
        };
        // --------------------------------------------------------------------------------------------------
        //GRAPH 5
        const datasets5 = [];
        
        // Extract unique agencies from the data
        const agencies = [...new Set(result5.rows.map(row => row[0]))];
        
        // Iterate over each agency
        agencies.forEach(agency => {
        // Find rows corresponding to the agency
        const agencyRows = result5.rows.filter(row => row[0] === agency);
        
        // Create an array to store the revenue for each year
        const revenueArray = new Array(7).fill(0);
        
        // Iterate over the rows and assign revenue to the corresponding year
        agencyRows.forEach(row => {
            const year = parseInt(row[1]);
            const revenue = row[2];
            revenueArray[year - 2017] = revenue;
        });
        
        // Create the dataset object for the agency
        const dataset = {
            label: agency,
            data: revenueArray
        };
        
        // Add the dataset to the datasets array
        datasets5.push(dataset);
        });
        const data5 = {
        labels: yearArray,
        datasets: datasets5
        }
        // --------------------------------------------------------------------------------------------------
        //GRAPH 6
        const data6 = {
            labels: result6.rows.map(row => row[0]),
            data: result6.rows.map(row => row[1])
        }
        // --------------------------------------------------------------------------------------------------
        // combine data in one variable "data"
        const data = {
            data1: data1,
            data2: data2,
            data3: data3,
            data4: data4,
            data5: data5,
            data6: data6,
        };
        console.log('fetch data:',data)
        res.json(data);
    }catch (error) {
        console.error(error);
    }
}

module.exports={dashboard, dashboardCA, fetchDataCA}