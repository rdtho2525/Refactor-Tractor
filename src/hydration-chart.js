module.exports = function makeChart() {
  var ctx = document.getElementById('hydrationChart').getContext('2d');
  var myChart = new Chart(ctx, {
      type: 'horizontalBar',
      data: {
          labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'],
          datasets: [{
              label: '# Oz Drank',
              data: [24, 83, 68, 84, 73, 36, 29],
              backgroundColor: ['rgba(54, 162, 235, 0.2)'],
              borderColor: ['rgba(255, 99, 132, 1)'],
              borderWidth: 1
          }]
      },
      options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero: true
                  }
              }]
          }
      }
  });
  return myChart; 
}
