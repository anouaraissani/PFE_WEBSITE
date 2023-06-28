//Ajout du mois EXERCICE dans le header
const monthNames = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Aout",
    "Séptembre",
    "Octobre",
    "Novembrre",
    "Decembre",
  ];
  const d = new Date();
  const dateDisplay = document.getElementById("date");
  dateDisplay.innerHTML = "Exercice du mois de : " + monthNames[d.getMonth() -1];
  
  // Récupérer les années: Récupérer l'année en cours puis retourner un tableau à 2 valeurs
  const currentYear = new Date().getFullYear();
  const yearLabels = getCurrentYearLabels();
  
  let myBarChart1 = null;
  let myBarChart2 = null;
  let myDoughnutChart = null;
  
  // Tableau qui contient les deux années étudiées
  function getCurrentYearLabels() {
    const currentMonth = getCurrentMonth();
    if (currentMonth === 0) {
      return [`${currentYear - 3}`, `${currentYear - 2}`];
    } else {
      return [`${currentYear - 2}`, `${currentYear - 1}`];
    }
  }
  
  // Initialiser le tableau
  let table;
  const initializeTableau = () => {
    table = $("#ca-tableau").DataTable({
      language: {
        emptyTable: "Auncune donnée n'a été trouvée",
        info: "Affichage de _START_ à _END_ entrées sur _TOTAL_",
        infoEmpty: "Affichage de 0 à 0 sur 0 entrées",
        infoFiltered: "(filtré à partir de _MAX_ entrées au total)",
        infoPostFix: "",
        thousands: ",",
        lengthMenu: "Afficher  _MENU_ entrées",
        loadingRecords: "Chargement...",
        processing: "",
        search: "Rechercher:",
        zeroRecords: "Aucun enregistrement correspondant n'a été trouvé",
        paginate: {
          first: "Premier",
          last: "Dernier",
          next: "Prochain",
          previous: "Précédent",
        },
        aria: {
          sortAscending: ": activer pour trier les colonnes par ordre croissant",
          sortDescending: ": activer pour trier les colonnes par ordre décroissant",
        },
      },
    });
  };
  
  // Fonction pour générer des couleurs aléatoires
  const generateColors = (count, opacity) => {
    const palette = chroma
     .scale(["#2f8bcc", "#2A4858", "#58508d", "#ffa600", "#bc5090", "d13e56", "#FFCC66", "#6600CC", "#339933", "#FF9900",  "#FF6600", "#3399CC"])
      /* .scale(["#FFCC66", "#6600CC", "#339933", "#FF9900",  "#FF6600", "#3399CC"]) */
      .mode("lch")
      .colors(count);
    
    const colorsWithOpacity = palette.map(color => chroma(color).alpha(opacity).css());
    
    return colorsWithOpacity;
  };
  
  
  // Fonction pour récupérer le mois en cours (- 1)
  function getCurrentMonth() {
    const dateTime = new Date().getMonth();
    return dateTime.toLocaleString();
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    // Récupérer l'etat du select
    const filterCumule = document.getElementById("filterType-page2");
    console.log(filterCumule);
    let route = "/dashboard/api/dataCA";
  
    filterCumule.addEventListener("change", function () {
      const selectedFilter = filterCumule.value;
      console.log(selectedFilter);
      if (selectedFilter === "year") {
        route = "/dashboard/api/dataCA";
      } else if (selectedFilter === "month") {
        route = "/dashboard/api/dataCAMois";
      }
  
      fetch(route)
        .then((response) => response.json())
        .then((data) => {
          generateCharts(data);
          generateTable(data.data4);
        });
    });
    fetch(route)
      .then(response => response.json())
      .then(data => {
        generateCharts(data);
        generateTable(data.data4);
    });
  });
  
  function generateCharts(data) {
    // --------------------------------------------------------------------------------------------------
    // Taux
    const taux = document.getElementById('ca-performance');
    const tauxValue = parseFloat(data.data5);
    taux.textContent = `${tauxValue}%`
    taux.style.fontWeight = "bold";
    if (tauxValue > 0) {
      taux.textContent = `+${tauxValue}%`;
      taux.style.color = "green"; 
    } else if (tauxValue < 0) {
      taux.style.color = "red";
    } else {
      taux.style.color = "black";
    }
  
    // --------------------------------------------------------------------------------------------------
    //GRAPH 1
    // --------------------------------------------------------------------------------------------------
    // Chiffre d'affaires par année
    if (myBarChart1 !== null) {
      myBarChart1.destroy();
    }
    const chartData1 = {
      labels: [data.data1.label],
      datasets: [
        {
          label: yearLabels[0],
          data: [data.data1.anneePrec],
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
        {
          label: yearLabels[1],
          data: [data.data1.anneeActu],
          backgroundColor: "rgba(255, 26, 104, 0.2)",
          borderColor: "rgba(255, 26, 104, 1)",
          borderWidth: 1,
        },
      ],
    };
  
    myBarChart1 = new Chart("ca-bar-chart1", {
      type: "bar",
      data: chartData1,
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            mode: "index",
            intersect: false,
          },
        },
      },
    });
  
    // --------------------------------------------------------------------------------------------------
    //GRAPH 2
    // --------------------------------------------------------------------------------------------------
    // Chiffre d'affaires  par intermédiaire
    if (myBarChart2 !== null) {
      myBarChart2.destroy();
    }
    const chartData2 = {
      labels: data.data2.label,
      datasets: [
        {
          label: yearLabels[0],
          data: data.data2.anneePrec,
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
        {
          label: yearLabels[1],
          data: data.data2.anneeActu,
          backgroundColor: "rgba(255, 26, 104, 0.2)",
          borderColor: "rgba(255, 26, 104, 1)",
          borderWidth: 1,
        },
      ],
    };
  
    myBarChart2 = new Chart("ca-bar-chart2", {
      type: "bar",
      data: chartData2,
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            mode: "index",
            intersect: false,
          },
        },
      },
    });
  
    // --------------------------------------------------------------------------------------------------
    //Chiffre d'affaires 
    // --------------------------------------------------------------------------------------------------
    // Règlements par branche
  
    if (myDoughnutChart !== null) {
      myDoughnutChart.destroy();
    }
    const labels3 = data.data3.label;
    const colors = generateColors(labels3.length, 0.5);
    const bcolors = generateColors(labels3.length, 0.2);
  
    const chartData3 = {
      labels: labels3,
      datasets: [
        {
          label: yearLabels[0],
          data: data.data3.anneePrec,
          backgroundColor: colors,
          borderColor: bcolors,
        },
        {
          label: yearLabels[1],
          data: data.data3.anneeActu,
          backgroundColor: colors,
          borderColor: bcolors,
        },
      ],
    };
  
    myDoughnutChart = new Chart("ca-doughnut-chart", {
      type: "doughnut",
      data: chartData3,
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            mode: "index",
            intersect: false,
          },
        },
      },
    });
  }
  
  function generateTable(data) {
    //GRAPH 4
    // --------------------------------------------------------------------------------------------------
    // Tableau
  
    // Check if DataTable is already initialized
    if (!table) {
      initializeTableau();
    } else {
      table.clear().draw(); // Clear existing data in the table
    }
  
    data.forEach((row) => {
      table.row.add(row).draw();
    });
  }
  