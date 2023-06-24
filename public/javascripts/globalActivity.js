// Fetch user data from the API and populate the table
fetch('/dashboard/api/dataGA')
  .then(response => response.json())
  .then(dataAPI => {
    // console.log(data)
    //CARD1
    const label1 = document.getElementById('label1')
    label1.textContent = `${dataAPI.data1.data11.label}`
    const ca = document.getElementById('ca')
    ca.textContent = `${dataAPI.data1.data11.data} MDA`

    const label2 = document.getElementById('label2')
    label2.textContent = `${dataAPI.data1.data12.label}`
    const nc = document.getElementById('nc')
    nc.textContent = `${dataAPI.data1.data12.data}`

    const label3 = document.getElementById('label3')
    label3.textContent = `${dataAPI.data1.data13.label}`
    const rs = document.getElementById('rs')
    rs.textContent = `${dataAPI.data1.data13.data} MDA`

    // --------------------------------------------------------------------------------------------------
    //CARD 2
    // --------------------------------------------------------------------------------------------------
    $('#branches_table').DataTable( {
      
      paging: false,
      searching: false,
      info:false,
      ordering: false
    })

      const table = $('#branches_table').DataTable();
      table.clear().draw(); // Effacer les données existantes dans le tableau
          // Ajouter les données au tableau
          dataAPI.data2.forEach((row) => {
            table.row.add(row).draw();
          })
    // --------------------------------------------------------------------------------------------------
    //CARD 3
    // --------------------------------------------------------------------------------------------------
    $('#inter_table').DataTable( {
      
      paging: false,
      searching: false,
      info:false,
      ordering: false
    })

      const table2 = $('#inter_table').DataTable();
      table2.clear().draw(); // Effacer les données existantes dans le tableau
          // Ajouter les données au tableau
          dataAPI.data3.forEach((row) => {
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

     // --------------------------------------------------------------------------------------------------
    //CARD 4
    // --------------------------------------------------------------------------------------------------
    // colors data
    const colorsData = [
      { color: 'rgba(255, 26, 104, 0.2)', borderColor: 'rgba(255, 26, 104, 1)' },   // Red
      { color: 'rgba(54, 162, 235, 0.2)', borderColor: 'rgba(54, 162, 235, 1)' },   // Blue
      { color: 'rgba(255, 206, 86, 0.2)', borderColor: 'rgba(255, 206, 86, 1)' },   // Yellow
      { color: 'rgba(138, 43, 226, 0.2)', borderColor: 'rgba(138, 43, 226, 1)' },   // Purple
      { color: 'rgba(0, 128, 0, 0.2)', borderColor: 'rgba(0, 128, 0, 1)' },         // Green
      { color: 'rgba(255, 165, 0, 0.2)', borderColor: 'rgba(255, 165, 0, 1)' } ,     // Orange
      { color: 'rgba(139, 69, 19, 0.2)', borderColor: 'rgba(139, 69, 19, 1)' }   // brown
    ];
const coordinates = {
        top:0,
        bottom:0,
        left:0,
        right:0,
      }
      
      const timeData = dataAPI.data4.map((data) => {
        // Return the mapped object
        return {
          year: data.annee,
          revenue: data.ca,
          monthData: data.moisData,
        };
      });
      // assign a color to each bar
      timeData.forEach((year, index) => {
        year.color = colorsData[index].color;
        year.borderColor = colorsData[index].borderColor;
      });
      const data = {
        labels: timeData.map((data) => data.year),
        datasets: [
          {
            label: 'Chiffre d\'affaire par Année en Millions',
            data: timeData.map((data) => data.revenue),
            backgroundColor: timeData.map((data) => data.color),
            borderColor: timeData.map((data) => data.borderColor),
            borderWidth: 1,
          },
        ],
      };
      
      const resetButton = {
        // Plugin options (if any)
        id: 'resetButton',
        beforeDraw:((chart, args, options)=>{
          if(myChart1.config.data.datasets[0].label != 'Chiffre d\'affaire par Année en Millions'){
          
            const {ctx, chartArea: {top, bottom, left, right, width, height} } = chart
            // console.log('test')
            // console.log('daata:', data.datasets[0])
            ctx.save()
            const text = 'Précedent'
            const thickBorder = 3
            const textWidth = ctx.measureText(text).width
      
            // background
            ctx.fillStyle = 'rgba(255, 26, 104, 0.2)'
            ctx.fillRect(right - (textWidth + 1 + 10), 5, textWidth + 10, 20)
            
      
            //draw text
            ctx.fillStyle = '#666'
            ctx.font = '12px Arial'
            ctx.fillText(text, right - (textWidth + 1 + 5 ), 15)
      
            //draw border
            ctx.lineWidth = '3px'
            ctx.strokeStyle = 'rgba(255, 26, 104, 1)'
            ctx.strokeRect(right - (textWidth + 1 + 10), 5, textWidth + 10, 20)
            // console.log(coordinates)
      
            //coordinates
            coordinates.top = 5
            coordinates.bottom = 25
            coordinates.left = right - (textWidth + 1 + 10)
            coordinates.right = right 
            // console.log('broser data:', timeData)
            ctx.restore()
          }
          
        })
      }
      
      ctx = document.getElementById('ca_par_annee')
      // 
      const myChart1 = new Chart(ctx,{
        type: 'bar',
        data,
        options: {
          // responsive: true,
          // maintainAspectRatio: false,
          onHover:(event, chartElement) => {
            if(myChart1.config.data.datasets[0].label === 'Chiffre d\'affaire par Année en Millions'){
              // if my cursor is on a bar element show the default value
              event.native.target.style.cursor = chartElement[0] ? 'pointer' : 'default'
          }else{
            event.native.target.style.cursor = 'default'
          }
      
          },
          parsing:{
            xAxisKey: 'year',
            yAxisKey: 'revenue'
          },
          scales: {
            x: {
              beginAtZero: true,
            },
            y: {
              beginAtZero: true
            }
          },        
        },
      }    
      )
      
      // a handler does the same thing over and over
      //change rhe chaet when click on a certain bar
      function clickHandler (click){
        if(myChart1.config.data.datasets[0].label === 'Chiffre d\'affaire par Année en Millions'){
          //getElementsAtEventForMode: get the element that we click on at an event ( in our case event = click)
          const bar = myChart1.getElementsAtEventForMode(click, 'nearest', {intersect: true}, true)
          // console.log('bar is : ',bar)
          if(bar.length){
            //  console.log('bar bar bar bar: ',bar[0].index)
            changeChart(bar[0].index)
          }
        }
      }
      
      // change the chart when we click on a bar element function
      function changeChart(year){
        //console.log(value + 'grabbed from clickHandler function')
        myChart1.config.options.parsing.xAxisKey = 'monthData.mois'
        myChart1.config.options.parsing.yAxisKey ='monthData.ca'
      
        const vColor = []
        const vBorderColor = []
        const vCA = []
        const vLabels = timeData[year].monthData.map(labels => {
          vColor.push(timeData[year].color)
          vBorderColor.push(timeData[year].borderColor)
          vCA.push((labels.ca)/1000000)
          return labels.mois
        })
        // console.log(vLabels, vCA, vColor, vBorderColor)
        myChart1.config.data.datasets[0].data = vCA
        myChart1.config.data.labels = vLabels
        myChart1.config.data.datasets[0].backgroundColor = vColor
        myChart1.config.data.datasets[0].borderColor = vBorderColor
        myChart1.config.data.datasets[0].label = timeData[year].year
        myChart1.update()   
      }
      
      //go back to previous chart
      function resetChart(){
        // console.log('clicked reset button')
        myChart1.config.options.parsing.xAxisKey = 'year'
        myChart1.config.options.parsing.yAxisKey = 'revenue'
      
        const bColor = []
        const bBorderColor = []
        const brevenue = []
        const bLabels = timeData.map(year=>{
          bColor.push(year.color)
          bBorderColor.push(year.borderColor)
          brevenue.push(year.revenue)
          return year.year
        })
        myChart1.config.data.datasets[0].backgroundColor = bColor
        
        myChart1.config.data.datasets[0].borderColor = bBorderColor
        myChart1.config.data.labels = bLabels
        myChart1.config.data.datasets[0].label = 'Chiffre d\'affaire par Année en Millions'
        myChart1.config.data.datasets[0].data = brevenue
        
        myChart1.update()
      } 
      
      // show a pointer when the mouses moves on the back button function
      function mousemoveHandler(canvas, mousemove){
        const x = mousemove.offsetX
        const y = mousemove.offsetY
        if(myChart1.config.data.datasets[0].label != 'Chiffre d\'affaire par Année en Millions'){
          //console.log(mousemove.offsetY)
          // console.log(coordinates)
          if(x > coordinates.left && x < coordinates.right && y > coordinates.top && y < coordinates.bottom ){
            canvas.style.cursor = 'pointer'
          }else{
            canvas.style.cursor = 'default'
          }
        }
        
      }
      
      
      // function that shows the previous chart when we click on the back button
      function clickButtonHandler(canvas, click){
        const x = click.offsetX
        const y = click.offsetY
        if(myChart1.config.data.datasets[0].label != 'Chiffre d\'affaire par Année en Millions'){
          if(x > coordinates.left && x < coordinates.right && y > coordinates.top && y < coordinates.bottom){
            resetChart()
          }
        }
        
      }
      ctx.onclick = clickHandler
      
      //when we move the cursor on the back button it becomes a pointer
      ctx.addEventListener('mousemove', (e) => {
        myChart1.resize()
        mousemoveHandler(ctx, e)
      })
      
      //when we click on the back button the canvas shows the previous chart
      ctx.addEventListener('click', (e) => {
        myChart1.resize()
        clickButtonHandler(ctx, e)
      })
      
      Chart.register(resetButton)


    // --------------------------------------------------------------------------------------------------
    //CARD 5
    // --------------------------------------------------------------------------------------------------
    $('#years_table').DataTable( {
      
      paging: false,
      searching: false,
      info:false,
      ordering: false
    })

      const table3 = $('#years_table').DataTable();
      table3.clear().draw(); // Effacer les données existantes dans le tableau
          // Ajouter les données au tableau
          dataAPI.data5.forEach((row) => {
            table3.row.add(row).draw();
          })
    // --------------------------------------------------------------------------------------------------
    //CARD 5
    // --------------------------------------------------------------------------------------------------
          //get the datasets from dataJ
      const datasetsChar3 =  dataAPI.data6.datasets
      // assign a color to each bar
      datasetsChar3.forEach((quarter, index) => {
        quarter.backgroundColor = colorsData[index].color;
        quarter.borderColor = colorsData[index].borderColor;
      });
      myChart3 = new Chart('cd-par-trimestre', {
        type: 'bar',
        data: {
          labels: dataAPI.data6.labels,
          datasets:  datasetsChar3,  
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          },
          borderWidth: 1,
          responsive: true,
          maintainAspectRatio: false,
        }
      });
          // if the data values are not visible show it else hide the data
          function toggleData(index) {
            if (myChart3) {
              myChart3.data.datasets.forEach((dataset, datasetIndex) => {
                if (datasetIndex === index) {
                  dataset.hidden = false; // Set the clicked dataset to visible
                } else {
                  dataset.hidden = true; // Hide the other datasets
                }
              })
              myChart3.update(); // Update the chart to apply the changes
            }

          }
          // Attach the toggleData function to the button onclick event
          const buttons = document.querySelectorAll('.buttonBox button');
          buttons.forEach((button, index) => {
            button.addEventListener('click', () => {
              toggleData(index);
            });
          })
          
          // Get the reference to the show all button
          const showAllButton = document.getElementById('showAllButton');

          // Add a click event listener to the show all button
          showAllButton.addEventListener('click', () => {
            if (myChart3) {
              myChart3.data.datasets.forEach((dataset) => {
                dataset.hidden = false; // Set all datasets to visible
              });
              myChart3.update(); // Update the chart to apply the changes
            }
          })

})