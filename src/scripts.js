import './css/base.scss';
import './css/style.scss';

import './images/person walking on path.jpg';
import './images/The Rock.jpg';

import { buildHydroChart, buildActivityChart, buildStepChart, buildStairsChart, buildSleepChart, buildSleepQualityChart } from './charts.js';

import User from './User';
import Activity from './Activity';
import Hydration from './Hydration';
import Sleep from './Sleep';
import UserRepo from './User-repo';

var sidebarName = document.getElementById('sidebarName');
var stepGoalCard = document.getElementById('stepGoalCard');
var headerText = document.getElementById('headerText');
var userAddress = document.getElementById('userAddress');
var userEmail = document.getElementById('userEmail');
var userStridelength = document.getElementById('userStridelength');
var friendList = document.getElementById('friendList');
var hydrationToday = document.getElementById('hydrationToday');
var hydrationAverage = document.getElementById('hydrationAverage');
var hydrationEarlierWeek = document.getElementById('hydrationEarlierWeek');
var historicalWeek = document.querySelectorAll('.historicalWeek');
var sleepToday = document.getElementById('sleepToday');
var sleepQualityToday = document.getElementById('sleepQualityToday');
var avUserSleepQuality = document.getElementById('avUserSleepQuality');
var sleepThisWeek = document.getElementById('sleepThisWeek');
var sleepEarlierWeek = document.getElementById('sleepEarlierWeek');
var friendChallengeListToday = document.getElementById('friendChallengeListToday');
var friendChallengeListHistory = document.getElementById('friendChallengeListHistory');
var bigWinner = document.getElementById('bigWinner');
var userStepsToday = document.getElementById('userStepsToday');
var avgStepsToday = document.getElementById('avgStepsToday');
var userStairsToday = document.getElementById('userStairsToday');
var avgStairsToday = document.getElementById('avgStairsToday');
var userMinutesToday = document.getElementById('userMinutesToday');
var avgMinutesToday = document.getElementById('avgMinutesToday');
var streakList = document.getElementById('streakList');
var streakListMinutes = document.getElementById('streakListMinutes');
const milesWalked = document.querySelector('#milesWalked');
const hydrationChart = document.querySelector('#hydrationChart');
const emailIcon = document.querySelector('.fa-envelope');
const addressIcon = document.querySelector('.fa-home');
const strideIcon = document.querySelector('.fa-walking');
const stepIcon = document.querySelector('.fa-shoe-prints');
const friendsIcon = document.querySelector('.fa-user-friends');
const email = document.querySelector('#userEmail');
const address = document.querySelector('#userAddress');
const stride = document.querySelector('#userStridelength');
const step = document.querySelector('#stepGoalCard');
const friends = document.querySelector('#friendList');
var dateInput = document.querySelector("#waterDate");
var waterInput = document.querySelector('#waterInput');
var hoursSleptInput = document.querySelector('#hoursSleptInput');
var sleepQualityInput = document.querySelector('#sleepQualityInput');
var stepNumberInput = document.querySelector('#stepNumberInput');
var activeMinutesInput = document.querySelector('#activeMinutesInput');
var flightsOfStairsInput = document.querySelector('#flightInput');
var submitButton = document.querySelector('#submitButton');



var userNowId;

emailIcon.addEventListener('click', function() {
  displayIconInfo(email)
});
addressIcon.addEventListener('click', function() {
  displayIconInfo(address)
});
strideIcon.addEventListener('click', function() {
  displayIconInfo(stride)
});
stepIcon.addEventListener('click', function() {
  displayIconInfo(step)
});
friendsIcon.addEventListener('click', function() {
  displayIconInfo(friends)
});

function displayIconInfo(icon) {
  icon.classList.toggle('hidden');
}

function startApp(lists) {
  const allUsers = makeUsers(lists[0].userData);
  let userRepo = new UserRepo(allUsers);
  let hydrationRepo = new Hydration(lists[1].hydrationData);
  let sleepRepo = new Sleep(lists[2].sleepData);
  let activityRepo = new Activity(lists[3].activityData);
  userNowId = pickUser();
  let userNow = getUserById(userNowId, userRepo);
  let today = makeToday(userRepo, userNowId, lists[1].hydrationData);
  let randomHistory = makeRandomDate(userRepo, userNowId, lists[1].hydrationData);
  historicalWeek.forEach(instance => instance.insertAdjacentHTML('afterBegin', `Week of ${randomHistory}`));
  addInfoToSidebar(userNow, userRepo);
  addHydrationInfo(userNowId, hydrationRepo, today, userRepo, randomHistory);
  addSleepInfo(userNowId, sleepRepo, today, userRepo, randomHistory);
  let winnerNow = makeWinnerID(activityRepo, userNow, today, userRepo);
  addActivityInfo(userNowId, activityRepo, today, userRepo, randomHistory, userNow, winnerNow);
  // addMilesWalked(activityRepo);
  addFriendGameInfo(userNowId, activityRepo, userRepo, today, randomHistory, userNow);
  buildCharts(today, userRepo, userNowId, hydrationRepo, sleepRepo, activityRepo);
}

function buildCharts(date, repo, id, hydroData, sleepData, actData) {
  buildHydroChart(repo, id, hydroData);
  buildStepChart(id, date, repo, actData);
  buildStairsChart(id, date, repo, actData);
  buildActivityChart(id, date, repo, actData);
  buildSleepChart(date, repo, id, sleepData);
  buildSleepQualityChart(date, repo, id, sleepData)
}

function makeUsers(userList) {
  const allUsers = userList.map( function(dataItem) {
    let user = new User(dataItem);
    return user;
  });
  return allUsers;
}

function pickUser() {
  return Math.floor(Math.random() * 50);
}

function getUserById(id, listRepo) {
  return listRepo.getDataFromID(id);
};

function addInfoToSidebar(user, userStorage) {
  headerText.innerText = `${user.name}'s Activity Tracker`;
  userAddress.innerText = user.address;
  userEmail.innerText = user.email;
  stepGoalCard.innerText = `Step goal is ${user.dailyStepGoal}. Avg goal: ${userStorage.calculateAverageStepGoal()}.`
  // avStepGoalCard.innerText = `The average daily step goal is ${userStorage.calculateAverageStepGoal()}`;
  userStridelength.innerText = `Stridelength is ${user.strideLength} feet.`;
  friendList.insertAdjacentHTML('afterBegin', makeFriendHTML(user, userStorage))
};

function makeFriendHTML(user, userStorage) {
  return user.getFriendsNames(userStorage).map(friendName => `-${friendName}`).join('');
}

function makeWinnerID(activityInfo, user, dateString, userStorage){
  return activityInfo.getWinnerId(user, dateString, userStorage)
}

function makeToday(userStorage, id, dataSet) {
  var sortedArray = userStorage.makeSortedUserArray(id, dataSet);
  return sortedArray[0].date;
}

function makeRandomDate(userStorage, id, dataSet) {
  var sortedArray = userStorage.makeSortedUserArray(id, dataSet);
  return sortedArray[Math.floor(Math.random() * sortedArray.length + 1)].date

}

function addHydrationInfo(id, hydrationInfo, dateString, userStorage, laterDateString) {
  hydrationToday.insertAdjacentHTML('afterBegin', `<p><span class="number">${hydrationInfo.calculateDailyOunces(id, dateString)}</span></p><p>oz water</p>`);
  hydrationAverage.insertAdjacentHTML('afterBegin', `<p><span class="number">${hydrationInfo.calculateAverageOunces(id)}</span></p> <p>average oz per day</p>`)
}

function addSleepInfo(id, sleepInfo, dateString, userStorage, laterDateString) {
  sleepToday.insertAdjacentHTML("afterBegin", `<p><span class="number">${sleepInfo.calculateDailySleep(id, dateString)}</span></p> <p>hours slept</p>`);
  sleepQualityToday.insertAdjacentHTML("afterBegin", `<p><span class="number">${sleepInfo.calculateDailySleepQuality(id, dateString)}</span></p><p>sleep quality of 5</p>`);
  avUserSleepQuality.insertAdjacentHTML("afterBegin", `<p><span class="number">${Math.round(sleepInfo.calculateAllUserSleepQuality() *100)/100}</span></p><p>average sleep quality of 5</p>`);
}

function makeSleepQualityHTML(id, sleepInfo, userStorage, method) {
  return method.map(sleepQualityData => `<li class="historical-list-listItem">On ${sleepQualityData}/5 quality of sleep</li>`).join('');
}

function addActivityInfo(id, activityInfo, dateString, userStorage, laterDateString, user, winnerId) {
  userStairsToday.insertAdjacentHTML("afterBegin", `<p>Stair Count:</p><span class="number">${activityInfo.userDataForToday(id, dateString, userStorage, 'flightsOfStairs')}</span></p>`);
  avgStairsToday.insertAdjacentHTML("afterBegin", `<p>Stair Count: </p><p><span class="number">${activityInfo.getAllUserAverageForDay(dateString, userStorage, 'flightsOfStairs')}</span></p>`);
  userStepsToday.insertAdjacentHTML("afterBegin", `<p>Step Count:</p><p><span class="number">${activityInfo.userDataForToday(id, dateString, userStorage, 'numSteps')}</span></p>`);
  avgStepsToday.insertAdjacentHTML("afterBegin", `<p>Step Count:</p><p><span class="number">${activityInfo.getAllUserAverageForDay(dateString, userStorage, 'numSteps')}</span></p>`);
  userMinutesToday.insertAdjacentHTML("afterBegin", `<p>Active Minutes:</p><p><span class="number">${activityInfo.userDataForToday(id, dateString, userStorage, 'minutesActive')}</span></p>`);
  avgMinutesToday.insertAdjacentHTML("afterBegin", `<p>Active Minutes:</p><p><span class="number">${activityInfo.getAllUserAverageForDay(dateString, userStorage, 'minutesActive')}</span></p>`);
  milesWalked.insertAdjacentHTML("afterBegin", `<p>Total Miles Walked This Week:</p><p><span class="number">${activityInfo.getMilesFromStepsByDate(id, dateString, user)}</span></p>`)
}

// function addMilesWalked(actData) {
//   milesWalked.innerHTML = `You walked ${actData.getMilesFromStepsByDatemiles()}!`;
// }

function addFriendGameInfo(id, activityInfo, userStorage, dateString, laterDateString, user) {
  friendChallengeListToday.insertAdjacentHTML("afterBegin", makeFriendChallengeHTML(id, activityInfo, userStorage, activityInfo.compareWeeklyUsers(user, dateString, userStorage)));
  // streakList.insertAdjacentHTML("afterBegin", makeStepStreakHTML(id, activityInfo, userStorage, activityInfo.getStreak(userStorage, id, 'numSteps')));
  // streakListMinutes.insertAdjacentHTML("afterBegin", makeStepStreakHTML(id, activityInfo, userStorage, activityInfo.getStreak(userStorage, id, 'minutesActive')));
  bigWinner.insertAdjacentHTML('afterBegin', `${activityInfo.showcaseWinner(user, dateString, userStorage)} steps`)
}

function makeFriendChallengeHTML(id, activityInfo, userStorage, method) {
  return method.map(friendChallengeData => `<li class="historical-list-listItem">Your friend ${friendChallengeData} total steps.</li>`).join('');
}

// function makeStepStreakHTML(id, activityInfo, userStorage, method) {
//   return method.map(streakData => `<li class="historical-list-listItem">${streakData}!</li>`).join('');
// }

const userFetch = fetch('http://localhost:3001/api/v1/users')
  .then(response => response.json())
  .catch(err => console.log(err));

const hydrationFetch = fetch('http://localhost:3001/api/v1/hydration')
  .then(response => response.json())
  .catch(err => console.log(err));

const sleepFetch = fetch('http://localhost:3001/api/v1/sleep')
  .then(response => response.json())
  .catch(err => console.log(err));

const activityFetch = fetch('http://localhost:3001/api/v1/activity')
  .then(response => response.json())
  .catch(err => console.log(err));

Promise.all([userFetch, hydrationFetch, sleepFetch, activityFetch])
  .then(values => startApp(values));


submitButton.addEventListener('click', (event) => {
  event.preventDefault();
  const sleepObj = {
    "userID": userNowId,
    "date": dateInput.value,
    "hoursSlept": hoursSleptInput.value,
    "sleepQuality": sleepQualityInput.value
  };

  const activityObj = {
    "userID": userNowId,
    "date": dateInput.value,
    "numSteps": stepNumberInput.value,
    "minutesActive": activeMinutesInput.value,
    "flightsOfStairs": flightsOfStairsInput.value
  };

  const hydrationObj = {
    "userID": userNowId,
    "date": dateInput.value,
    "numOunces": waterInput.value
  };

  const postSleep = fetch('http://localhost:3001/api/v1/sleep', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(sleepObj),
})
  .then(response => response.json())
  .catch(err => console.log(err))

const postActivity = fetch('http://localhost:3001/api/v1/activity', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(activityObj)
})
  .then(response => response.json())
  .catch(err => console.log(err))

const postHydration = fetch('http://localhost:3001/api/v1/hydration', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(hydrationObj),
})
  .then(response => response.json())
  .then(thisData => console.log(thisData))
  .catch(err => console.log(err))
})
