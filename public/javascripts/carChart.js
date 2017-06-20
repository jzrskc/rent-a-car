let myChart = document.getElementById('myChart').getContext('2d');

// Global Options
Chart.defaults.global.defaultFontFamily = 'Lato';
Chart.defaults.global.defaultFontSize = 18;
Chart.defaults.global.defaultFontColor = '#777';

let carChart = new Chart(myChart, {
  type:'pie',
  data:{
    labels:['Mercedes-Benz E', 'Alfa Romeo 4C Spider', 'Porsche Boxster 2016', 'Aston Martin V8 Vantage', 'Cambridge', 'Ford F-350 Pickup'],
    datasets:[{
      label:'Car',
      data:[
        1980,
        1700,
        1486,
        1655,
        999,
        230
      ],
      backgroundColor:[
        '#ff6384',
        '#36a2eb',
        '#ffce56',
        '#4bc0c0',
        '#9966ff',
        '#ff9f40',
        '#ff6384'
      ],
      borderWidth:1,
      borderColor:'#777',
      hoverBorderWidth:3,
      hoverBorderColor:'#000'
    }]
  },
  options:{
    legend:{
      // display: false,
      display:true,
      position:'right',
      labels:{
        fontColor:'#000'
      }
    },
    tooltips:{
      enabled:true
    }
  }
});
