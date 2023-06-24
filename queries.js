//dashboard: chiffre d'affaire
const queryCA1 = `
    SELECT d.annee, SUM(CA) 
    FROM FAIT_PRODUCTION f, DIM_DATE d
    WHERE f.date_key = d.date_key
    GROUP BY d.annee
    ORDER BY d.annee
`

const q = `
    SELECT d.mois, SUM(CA) 
    FROM FAIT_PRODUCTION f, DIM_DATE d
    WHERE f.date_key = d.date_key
    AND d.annee = :annee
    GROUP BY d.mois
    ORDER BY d.mois
`

const queryCA2 = `
    SELECT CAT.libebran, SUM(CA)
    FROM FAIT_PRODUCTION prod, DIM_CATEGORIE cat
    WHERE cat.categorie_key = prod.categorie_key
    GROUP BY cat.libebran
    ORDER BY cat.libebran
`

const queryCA3 = `
    SELECT d.trimestre, SUM(CA) 
    FROM FAIT_PRODUCTION f, DIM_DATE d
    WHERE f.date_key = d.date_key
    AND d.annee = :annee
    GROUP BY d.trimestre
    ORDER BY d.trimestre
` 

const queryCA4 =`
    SELECT cat.libebran, d.annee,  SUM(CA) 
    FROM FAIT_PRODUCTION prod, DIM_DATE d, DIM_CATEGORIE cat
    WHERE prod.date_key = d.date_key
    AND cat.categorie_key = prod.categorie_key
    GROUP BY cat.libebran, d.annee
    ORDER BY cat.libebran, d.annee
`

const queryCA5 =`
    SELECT int.libtypin, d.annee, SUM(CA) 
    FROM FAIT_PRODUCTION prod, DIM_DATE d, DIM_INTERMEDIAIRE int
    WHERE prod.date_key = d.date_key
    AND int.intermediaire_key = prod.intermediaire_key
    GROUP BY int.libtypin, d.annee
    ORDER BY int.libtypin, d.annee
`
const queryCA6 = `
    SELECT int.libtypin, SUM(CA)
    FROM FAIT_PRODUCTION prod, DIM_INTERMEDIAIRE int
    WHERE int.intermediaire_key = prod.intermediaire_key
    GROUP BY int.libtypin
    ORDER BY int.libtypin
`
// -------------------------------------------------------------------------------
// GLOBAL ACTIVITY
// -------------------------------------------------------------------------------
// CARD1: La Moyenne Activité Globale par Année
const queryT_CA = `
    SELECT AVG(total_ca) AS average_ca
    FROM (
        SELECT SUM(fp.CA) AS total_ca
        FROM fait_production fp
        INNER JOIN dim_date dd ON fp.DATE_KEY = dd.DATE_KEY
        GROUP BY dd.ANNEE
    )
`
const queryT_NBC = `
    SELECT AVG (total_nb) AS average_ca
    FROM (
        SELECT SUM (affnouvelle  + renouvellement) AS total_nb
        FROM fait_production fp
        INNER JOIN dim_date dd ON fp.DATE_KEY = dd.DATE_KEY
        GROUP BY dd.ANNEE
    )
`
const queryT_RS = `   
    SELECT AVG (total_rs) AS average_ca
    FROM (
        SELECT SUM (montregl) AS total_rs
        FROM  fait_reglement fr
        INNER JOIN dim_date dd ON fr.DATE_KEY = dd.DATE_KEY
        GROUP BY dd.ANNEE
    )
`
// -------------------------------------------------------------------------------
//  CARD2: Les Branches les plus Performantes
const queryTopBranches = `
    SELECT *  
    FROM (
        SELECT dc.LIBEBRAN
        FROM fait_production fp, dim_categorie dc
        WHERE fp.CATEGORIE_KEY = dc.CATEGORIE_KEY
        GROUP BY dc.LIBEBRAN
        ORDER BY SUM(fp.CA) DESC
    ) WHERE ROWNUM <= 4
`

const queryTopBranchesP= `
    SELECT AVG (total_ca) AS average_ca,  AVG(total_nc) AS average_nc
    FROM(
    SELECT dd.ANNEE, SUM (fp.CA) AS total_ca, SUM(affnouvelle  + renouvellement) AS total_nc
    FROM fait_production fp, dim_categorie dc, dim_date dd
    where fp.DATE_KEY = dd.DATE_KEY
    and fp.categorie_KEY = dc.categorie_KEY
    and DC.LIBEBRAN = :branche 
    GROUP BY dd.ANNEE
    )
`

const queryTopBranchesR= `
    SELECT AVG (total_rs) AS average_rs
    FROM(
        SELECT dd.ANNEE, SUM (fr.montregl) AS total_rs
        FROM fait_reglement fr, dim_categorie dc, dim_date dd
        where fr.DATE_KEY = fr.DATE_KEY
        and fr.categorie_KEY = dc.categorie_KEY
        and DC.LIBEBRAN = :branche
        GROUP BY dd.ANNEE
    )
`
// -------------------------------------------------------------------------------
// CARD3: Les Type d'Intermédiaire les plus Actifs
const queryTopInter = `
SELECT *  
    FROM (
        SELECT di.LIBTYPIN
        FROM fait_production fp, dim_intermediaire di
        WHERE fp.intermediaire_KEY = di.intermediaire_KEY
        GROUP BY di.LIBTYPIN
        ORDER BY SUM(fp.CA) DESC
    ) WHERE ROWNUM <= 4
`

const queryTopInterP= `
    SELECT AVG(total_ca)AS average_ca,  AVG(total_nc) AS average_nc
    FROM(
        SELECT dd.ANNEE, SUM (fp.CA) AS total_ca, SUM(affnouvelle  + renouvellement) AS total_nc
        FROM fait_production fp, dim_intermediaire di, dim_date dd
        where fp.DATE_KEY = dd.DATE_KEY
        and fp.intermediaire_KEY = di.intermediaire_KEY
        and di.LIBTYPIN = :inter
        GROUP BY dd.ANNEE
    )
`

const queryTopInterR= `
SELECT AVG (total_rs) AS average_rs
FROM(
SELECT dd.ANNEE, SUM(fr.montregl) AS total_rs
FROM fait_reglement fr, dim_intermediaire di, dim_date dd
where fr.DATE_KEY = dd.DATE_KEY
and fr.intermediaire_KEY = di.intermediaire_KEY
and di.LIBTYPIN = :inter
GROUP BY dd.ANNEE
)
`
// -------------------------------------------------------------------------------
//  CARD5: Les Années les plus Performantes

const queryTopYearsP = `
    SELECT *
    FROM(

    SELECT dd.annee, sum(fp.ca), sum(affnouvelle  + renouvellement)
    FROM fait_production fp, dim_date dd
    WHERE fp.date_key = dd.date_key
    GROUP BY dd.annee
    Order by sum(fp.ca) desc
    ) WHERE ROWNUM <= 4
`
const queryTopYearsRS = `   
    SELECT sum(montregl)
    FROM fait_reglement fr, dim_date dd
    WHERE fr.date_key = dd.date_key
    AND dd.annee = :year
    GROUP BY dd.annee
    Order by sum(montregl) desc

`
module.exports={queryCA1, queryCA2, queryCA3, queryCA4, queryCA5, queryCA6, q, queryT_CA, queryT_NBC, queryT_RS, queryTopBranches, queryTopBranchesP, queryTopBranchesR, queryTopInter, queryTopInterP, queryTopInterR, queryTopYearsP, queryTopYearsRS}