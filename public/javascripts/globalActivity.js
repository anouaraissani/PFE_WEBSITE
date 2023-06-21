// Fetch user data from the API and populate the table
fetch('/dashboard/api/dataGA')
  .then(response => response.json())
  .then(data => {
    console.log("response")
    console.log(data)
    const label1 = document.getElementById('label1')
    label1.textContent = `${data.data1.label}`
    const ca = document.getElementById('ca')
    ca.textContent = `${data.data1.data} Mrd`

    const label2 = document.getElementById('label2')
    label2.textContent = `${data.data2.label}`
    const nc = document.getElementById('nc')
    nc.textContent = `${data.data2.data}`

    const label3 = document.getElementById('label3')
    label3.textContent = `${data.data3.label}`
    const rs = document.getElementById('rs')
    rs.textContent = `${data.data3.data} M`
  })

