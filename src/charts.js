import Chart from 'chart.js';
console.log('hi there')
export function buildHydroChart(userRepo, user, hydration) {
  var hydrationChart = document.getElementById('hydrationChart');
  var waterConsumed = new Chart(hydrationChart, {
    type: 'bar',
    data: {
      labels: Object.keys(hydration.calculateFirstWeekOunces(userRepo, user)),
      datasets: [{
        label: 'Ounces of water drank',
        data: Object.values(hydration.calculateFirstWeekOunces(userRepo, user)),
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            callback: function(value) {
              return `${value}`;
            }
          }
        }]
      }
    }
  });
}

export function buildStepChart(id, date, userRepo, activityInfo) {
  var stepCountChart = document.getElementById('stepCountChart');
  var weeklySteps = new Chart(stepCountChart, {
    type: 'bar',
    data: {
      labels: Object.keys(activityInfo.userDataForWeek(id, date, userRepo, "numSteps")),
      datasets: [{
        label: 'Steps taken this week: ',
        data: Object.values(activityInfo.userDataForWeek(id, date, userRepo, "numSteps")),
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            callback: function(value) {
              return value;
            }
          }
        }]
      }
    }
  });
}

export function buildStairsChart(id, date, userRepo, activityInfo) {
  var flightsOfStairsChart = document.getElementById('flightsOfStairsChart');
  var flightsWalked = new Chart(flightsOfStairsChart, {
    type: 'bar',
    data: {
      labels: Object.keys(activityInfo.userDataForWeek(id, date, userRepo, "flightsOfStairs")),
      datasets: [{
        label: 'Flights of stairs walked this week:',
        data: Object.values(activityInfo.userDataForWeek(id, date, userRepo, "flightsOfStairs")),
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            callback: function(value) {
              return value;
            }
          }
        }]
      }
    }
  });
}

 export function buildActivityChart(id, date, userRepo, activityInfo) {
  var activeMinutesChart = document.getElementById('activeMinutesChart');
  var minutesActive = new Chart(activeMinutesChart, {
    type: 'bar',
    data: {
      labels: Object.keys(activityInfo.userDataForWeek(id, date, userRepo, "minutesActive")),
      datasets: [{
        label: 'Minutes active this week:',
        data: Object.values(activityInfo.userDataForWeek(id, date, userRepo, "minutesActive")),
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            callback: function(value) {
              return `${value} mins.`;
            }
          }
        }]
      }
    }
  });
}

export function buildSleepChart(date, userRepo, user, sleepData) {
  var hoursSleptChart = document.getElementById('hoursSleptChart');
  var hoursSlept = new Chart(hoursSleptChart, {
    type: 'bar',
    data: {
      labels: Object.keys(sleepData.calculateWeekSleep(date, user, userRepo)),
      datasets: [{
        label: 'Hours slept',
        data: Object.values(sleepData.calculateWeekSleep(date, user, userRepo)),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            callback: function(value) {
              return `${value}`;
            }
          }
        }]
      }
    }
  });
}

export function buildSleepQualityChart(date, userRepo, user, sleepData) {
  var sleepQualityChart = document.getElementById('sleepQualityChart');
  var sleepQuality = new Chart(sleepQualityChart, {
    type: 'bar',
    data: {
      labels: Object.keys(sleepData.calculateWeekSleepQuality(date, user, userRepo)),
      datasets: [{
        label: 'Quality of sleep:',
        data: Object.values(sleepData.calculateWeekSleepQuality(date, user, userRepo)),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            callback: function(value) {
              return value;
            }
          }
        }]
      }
    }
  });
}

function buildIncreasinglyActChart() {
  var increasinglyActiveChart = document.getElementById('increasinglyActiveChart');
  var activeStreak = new Chart(increasinglyActiveChart, {
    type: 'bar',
    data: {
      labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'],
      datasets: [{
        label: 'Current streak of increased activity:',
        data: getTestData(),
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            callback: function(value) {
              return value;
            }
          }
        }]
      }
    }
  });
}
