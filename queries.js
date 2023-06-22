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
// ----------------------------------------------------
// GLOBAL ACTIVITY
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
module.exports={queryCA1, queryCA2, queryCA3, queryCA4, queryCA5, queryCA6, queryT_CA, queryT_NBC, queryT_RS, q}