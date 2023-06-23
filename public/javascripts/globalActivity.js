// Fetch user data from the API and populate the table
fetch('/dashboard/api/dataGA')
  .then(response => response.json())
  .then(data => {
    // console.log(data)
    //CARD1
    const label1 = document.getElementById('label1')
    label1.textContent = `${data.data1.data11.label}`
    const ca = document.getElementById('ca')
    ca.textContent = `${data.data1.data11.data} MDA`

    const label2 = document.getElementById('label2')
    label2.textContent = `${data.data1.data12.label}`
    const nc = document.getElementById('nc')
    nc.textContent = `${data.data1.data12.data}`

    const label3 = document.getElementById('label3')
    label3.textContent = `${data.data1.data13.label}`
    const rs = document.getElementById('rs')
    rs.textContent = `${data.data1.data13.data} MDA`

    // --------------------------------------------------------------------------------------------------
    //CARD 2
    // --------------------------------------------------------------------------------------------------
    $('#branches_table').DataTable( {
      
      paging: false,
      searching: false,
      info:false
    })

      const table = $('#branches_table').DataTable();
      table.clear().draw(); // Effacer les données existantes dans le tableau
          // Ajouter les données au tableau
          data.data2.forEach((row) => {
            table.row.add(row).draw();
          })
    // --------------------------------------------------------------------------------------------------
    //CARD 3
    // --------------------------------------------------------------------------------------------------
    $('#inter_table').DataTable( {
      
      paging: false,
      searching: false,
      info:false
    })

      const table2 = $('#inter_table').DataTable();
      table2.clear().draw(); // Effacer les données existantes dans le tableau
          // Ajouter les données au tableau
          data.data3.forEach((row) => {
            table2.row.add(row).draw();
          })
    // const tableBody = document.querySelector('tbody')

    // data.data2.forEach(branche => {
    //     const row = document.createElement('tr')

    //     const idBranche = document.createElement('td')
    //     idBranche.textContent = branche[0]
    //     row.appendChild(idBranche)

    //     const idCA = document.createElement('td')
    //     idCA.textContent = branche[1]
    //     row.appendChild(idCA)

    //     const idNBC = document.createElement('td')
    //     idNBC.textContent = branche[2]
    //     row.appendChild(idNBC)

    //     const idRS = document.createElement('td')
    //     idRS.textContent = branche[3]
    //     row.appendChild(idRS)
    //     tableBody.appendChild(row)
    // })

})