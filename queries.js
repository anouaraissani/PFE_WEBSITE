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
    FROM DATAWH.FAIT_PRODUCTION f, DATAWH.DIM_DATE d
    WHERE f.date_key = d.date_key
    AND d.annee = 2017
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
    FROM DATAWH.FAIT_PRODUCTION prod, DATAWH.DIM_DATE d, DATAWH.DIM_CATEGORIE cat
    WHERE prod.date_key = d.date_key
    AND cat.categorie_key = prod.categorie_key
    GROUP BY cat.libebran, d.annee
    ORDER BY cat.libebran, d.annee
`

const queryCA5 =`
    SELECT int.libtypin, d.annee, SUM(CA) 
    FROM DATAWH.FAIT_PRODUCTION prod, DATAWH.DIM_DATE d, DATAWH.DIM_INTERMEDIAIRE int
    WHERE prod.date_key = d.date_key
    AND int.intermediaire_key = prod.intermediaire_key
    GROUP BY int.libtypin, d.annee
    ORDER BY int.libtypin, d.annee
`
const queryCA6 = `
    SELECT int.libtypin, SUM(CA)
    FROM DATAWH.FAIT_PRODUCTION prod, DATAWH.DIM_INTERMEDIAIRE int
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
        FROM datawh.fait_production fp
        INNER JOIN datawh.dim_date dd ON fp.DATE_KEY = dd.DATE_KEY
        GROUP BY dd.ANNEE
    )
`
const queryT_NBC = `
    SELECT AVG (total_nb) AS average_ca
    FROM (
        SELECT SUM (affnouvelle  + renouvellement) AS total_nb
        FROM datawh.fait_production fp
        INNER JOIN datawh.dim_date dd ON fp.DATE_KEY = dd.DATE_KEY
        GROUP BY dd.ANNEE
    )
`
const queryT_RS = `   
    SELECT AVG (total_rs) AS average_ca
    FROM (
        SELECT SUM (montregl) AS total_rs
        FROM  datawh.fait_reglement fr
        INNER JOIN datawh.dim_date dd ON fr.DATE_KEY = dd.DATE_KEY
        GROUP BY dd.ANNEE
    )
`
// -------------------------------------------------------------------------------
//  CARD2: 1Les Branches les plus Performantes
const queryTopBranches = `
    SELECT *  
    FROM (
        SELECT dc.LIBEBRAN
        FROM datawh.fait_production fp, datawh.dim_categorie dc
        WHERE fp.CATEGORIE_KEY = dc.CATEGORIE_KEY
        GROUP BY dc.LIBEBRAN
        ORDER BY SUM(fp.CA) DESC
    ) WHERE ROWNUM <= 4
`

const queryTopBranchesP= `
    SELECT AVG (total_ca) AS average_ca,  AVG(total_nc) AS average_nc
    FROM(
    SELECT dd.ANNEE, SUM (fp.CA) AS total_ca, SUM(affnouvelle  + renouvellement) AS total_nc
    FROM datawh.fait_production fp, datawh.dim_categorie dc, datawh.dim_date dd
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
        FROM datawh.fait_reglement fr, datawh.dim_categorie dc, datawh.dim_date dd
        where fr.DATE_KEY = fr.DATE_KEY
        and fr.categorie_KEY = dc.categorie_KEY
        and DC.LIBEBRAN = :branche
        GROUP BY dd.ANNEE
    )
`
// -------------------------------------------------------------------------------
// CARD3: Les Type d'Intermédiaire les plus Actifs
module.exports={queryCA1, queryCA2, queryCA3, queryCA4, queryCA5, queryCA6, q, queryT_CA, queryT_NBC, queryT_RS, queryTopBranches, queryTopBranchesP, queryTopBranchesR}