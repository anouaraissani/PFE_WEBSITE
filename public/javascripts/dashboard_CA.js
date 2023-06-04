// Fetch data from the server
async function fetchData() {
    try {
      const response = await fetch('/dashboard/api/dataCA');
      if (!response.ok) {
        throw new Error('Request failed');
      }
      const dataJ = await response.json();
  
      return dataJ;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }
  
  // Fetch data and create the chart
  fetchData()
    .then(dataJ => {
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
      // -----------------------------------------------------------------------------------------------------------------------
      // CHART1
      // -----------------------------------------------------------------------------------------------------------------------
      const coordinates = {
        top:0,
        bottom:0,
        left:0,
        right:0,
      }
      
      const timeData = dataJ.data1.map((data) => {
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
            label: 'Chiffre d\'affaire par année',
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
          if(myChart1.config.data.datasets[0].label != 'Chiffre d\'affaire par année'){
          
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
            if(myChart1.config.data.datasets[0].label === 'Chiffre d\'affaire par année'){
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
        }
      }    
      )
      
      // a handler does the same thing over and over
      //change rhe chaet when click on a certain bar
      function clickHandler (click){
        if(myChart1.config.data.datasets[0].label === 'Chiffre d\'affaire par année'){
          //getElementsAtEventForMode: get the element that we click on at an event ( in our case event = click)
          const bar = myChart1.getElementsAtEventForMode(click, 'nearest', {intersect: true}, true)
          // console.log('bar is : ',bar)
          if(bar.length){
            // console.log('bar bar bar bar: ',bar[0].index)
            changeChart(bar[0].index)
          }
        }
      }
      
      // change the chart when we click on a bar element function
      function changeChart(year){
        //console.log(value + 'grabbed from clickHandler function')
        myChart1.config.options.parsing.xAxisKey = 'monthData.mois'
        myChart1.config.options.parsing.yAxisKey = 'monthData.ca'
      
        const vColor = []
        const vBorderColor = []
        const vCA = []
        const vLabels = timeData[year].monthData.map(labels => {
          vColor.push(timeData[year].color)
          vBorderColor.push(timeData[year].borderColor)
          vCA.push(labels.ca)
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
        myChart1.config.data.datasets[0].label = 'Chiffre d\'affaire par année'
        myChart1.config.data.datasets[0].data = brevenue
        
        myChart1.update()
      } 
      
      // show a pointer when the mouses moves on the back button function
      function mousemoveHandler(canvas, mousemove){
        const x = mousemove.offsetX
        const y = mousemove.offsetY
        if(myChart1.config.data.datasets[0].label != 'Chiffre d\'affaire par année'){
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
        if(myChart1.config.data.datasets[0].label != 'Chiffre d\'affaire par année'){
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
      // -----------------------------------------------------------------------------------------------------------------------
      // CHART2
      // -----------------------------------------------------------------------------------------------------------------------     
        myChart2 = new Chart(ca_par_branche, {
          type: 'bar',
          data: {
          labels: dataJ.data2.labels,
          datasets: [{
              label: 'Chiffre d affaire par branche',
              //data: datasets.data,
              data: dataJ.data2.datasets[0].data,
              backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
          }]},
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales:{
              y: {
                beginAtZero: true,
                // ticks: {
                //   stepSize: 100000
                // }
          },
                //display in millions
                // ticks: {
                //   callback: function (value) {
                //     return value / 1000000 + 'M'; // Divide the value by 1000000 to display in millions
                //   }
                // }
              // }
            },
            // responsive: true,
            // maintainAspectRatio: false,
            plugins: {
              legend: {
                label: {
                  font: {
                    size: 5// Set a smaller font size for the labels
                  },
                  // fontSize: 0 // Set a smaller font size for the labels
                  textOverflow: 'ellipsis'
                }
              },

            }
          }
      });
      // -----------------------------------------------------------------------------------------------------------------------
      // CHART3
      // -----------------------------------------------------------------------------------------------------------------------
      //get the datasets from dataJ
      const datasetsChar3 =  dataJ.data3.datasets
      // assign a color to each bar
      datasetsChar3.forEach((quarter, index) => {
        quarter.backgroundColor = colorsData[index].color;
        quarter.borderColor = colorsData[index].borderColor;
      });
      myChart3 = new Chart('cd-par-trimestre', {
        type: 'bar',
        data: {
          labels: dataJ.data3.labels,
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
          function toggleData(value) {
            if (myChart3) {
              const showValue = myChart3.isDatasetVisible(value);
              if (showValue === true) {
                myChart3.hide(value);
              } else {
                myChart3.show(value);
              }
            }
          }
          // Attach the toggleData function to the button onclick event
          const buttons = document.querySelectorAll('.buttonBox button');
          buttons.forEach((button, index) => {
            button.addEventListener('click', () => {
              toggleData(index);
            });
          });
          // -----------------------------------------------------------------------------------------------------------------------
      // CHART4
      // -----------------------------------------------------------------------------------------------------------------------
      // Create a new chart instance
      myChart4 = new Chart('ca-par-annee-branche', {
        type: 'line',
        data: {
          labels: dataJ.data4.labels,
          datasets: dataJ.data4.datasets
        },
        options: {
          // responsive: true,
          // maintainAspectRatio: false,
          title: {
            display: true,
            text: 'Multiple Line Chart'
          },
          scales: {
            x: {
              display: true,
              title: {
                display: true,
                text: 'Year'
              }
            },
            y: {
              display: true,
              title: {
                display: true,
                text: 'Value'
              }
            }
          }
        }
      });       
    })
    .catch(error => {
        console.error('Error fetching data:', error)
    });