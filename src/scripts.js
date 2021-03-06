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

const stepGoalCard = document.getElementById('stepGoalCard');
const headerText = document.getElementById('headerText');
const userAddress = document.getElementById('userAddress');
const userEmail = document.getElementById('userEmail');
const userStridelength = document.getElementById('userStridelength');
const friendList = document.getElementById('friendList');
const hydrationToday = document.getElementById('hydrationToday');
const hydrationAverage = document.getElementById('hydrationAverage');
const historicalWeek = document.querySelectorAll('.historicalWeek');
const sleepToday = document.getElementById('sleepToday');
const sleepQualityToday = document.getElementById('sleepQualityToday');
const friendChallengeListToday = document.getElementById('friendChallengeListToday');
const bigWinner = document.getElementById('bigWinner');
const userStepsToday = document.getElementById('userStepsToday');
const avgStepsToday = document.getElementById('avgStepsToday');
const userStairsToday = document.getElementById('userStairsToday');
const avgStairsToday = document.getElementById('avgStairsToday');
const userMinutesToday = document.getElementById('userMinutesToday');
const avgMinutesToday = document.getElementById('avgMinutesToday');
const milesWalked = document.querySelector('#milesWalked');
const emailIcon = document.querySelector('.fa-envelope');
const addressIcon = document.querySelector('.fa-home');
const strideIcon = document.querySelector('.fa-walking');
const stepIcon = document.querySelector('.fa-shoe-prints');
const friendsIcon = document.querySelector('.fa-user-friends');
const arrowIcon = document.querySelector('.fa-angle-double-down');
const inputBox = document.querySelector('#inputBox');
const email = document.querySelector('#userEmail');
const address = document.querySelector('#userAddress');
const stride = document.querySelector('#userStridelength');
const step = document.querySelector('#stepGoalCard');
const friends = document.querySelector('#friendList');
const inputForm = document.querySelector('.input-box');
const dateInput = document.querySelector("#date");
const waterInput = document.querySelector('#waterInput');
const hoursSleptInput = document.querySelector('#hoursSleptInput');
const sleepQualityInput = document.querySelector('#sleepQualityInput');
const stepNumberInput = document.querySelector('#stepNumberInput');
const activeMinutesInput = document.querySelector('#activeMinutesInput');
const flightsOfStairsInput = document.querySelector('#flightInput');
const formErrorMessage = document.querySelector('.form-error-message');
const bigErrorMessage = document.querySelector('#bigErrorMessage');

let userNowId;

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

arrowIcon.addEventListener('click', function() {
  return inputBox.classList.toggle('hidden')
})

function displayIconInfo(icon) {
  icon.classList.toggle('hidden');
}

function startApp(lists) {
  const allUsers = makeUsers(lists[0].userData);
  const userRepo = new UserRepo(allUsers);
  const hydrationRepo = new Hydration(lists[1].hydrationData);
  const sleepRepo = new Sleep(lists[2].sleepData);
  const activityRepo = new Activity(lists[3].activityData);
  userNowId = pickUser();
  const userNow = getUserById(userNowId, userRepo);
  const today = makeToday(userRepo, userNowId, lists[1].hydrationData);
  const randomHistory = makeRandomDate(userRepo, userNowId, lists[1].hydrationData);
  historicalWeek.forEach(instance => instance.insertAdjacentHTML('afterBegin', `Week of ${randomHistory}`));
  addInfoToSidebar(userNow, userRepo);
  addHydrationInfo(userNowId, hydrationRepo, today, userRepo, randomHistory);
  addSleepInfo(userNowId, sleepRepo, today, userRepo, randomHistory);
  const winnerNow = makeWinnerID(activityRepo, userNow, today, userRepo);
  addActivityInfo(userNowId, activityRepo, today, userRepo, userNow);
  addFriendGameInfo(userNowId, activityRepo, userRepo, today, userNow);
  buildCharts(today, userRepo, userNowId, hydrationRepo, sleepRepo, activityRepo);
  hide(bigErrorMessage);
  hide(formErrorMessage);
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
    const user = new User(dataItem);
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
  stepGoalCard.innerText = `Step goal: ${user.dailyStepGoal}. Avg goal: ${userStorage.calculateAverageStepGoal()}.`
  userStridelength.innerText = `Stridelength: ${user.strideLength} feet.`;
  friendList.insertAdjacentHTML('afterBegin', makeFriendHTML(user, userStorage))
};

function makeFriendHTML(user, userStorage) {
  return user.getFriendsNames(userStorage).map(friendName => ` ${friendName} | `).join('');
}

function makeWinnerID(activityInfo, user, dateString, userStorage){
  return activityInfo.getWinnerId(user, dateString, userStorage)
}

function makeToday(userStorage, id, dataSet) {
  const sortedArray = userStorage.makeSortedUserArray(id, dataSet);
  return sortedArray[0].date;
}

function makeRandomDate(userStorage, id, dataSet) {
  const sortedArray = userStorage.makeSortedUserArray(id, dataSet);
  return sortedArray[Math.floor(Math.random() * sortedArray.length + 1)].date

}

function addHydrationInfo(id, hydrationInfo, dateString) {
  hydrationToday.insertAdjacentHTML('afterBegin', `<p><span class="number">${hydrationInfo.calculateDailyOunces(id, dateString)}</span></p><p>oz water</p>`);
  hydrationAverage.insertAdjacentHTML('afterBegin', `<p><span class="number">${hydrationInfo.calculateAverageOunces(id)}</span></p> <p>average oz per day</p>`)
}

function addSleepInfo(id, sleepInfo, dateString) {
  sleepToday.insertAdjacentHTML("afterBegin", `<p><span class="number">${sleepInfo.calculateDailySleep(id, dateString)}</span></p> <p>hours slept</p>`);
  sleepQualityToday.insertAdjacentHTML("afterBegin", `<p><span class="number">${sleepInfo.calculateDailySleepQuality(id, dateString)}</span></p><p>sleep quality of 5</p>`);
}


function addActivityInfo(id, activityInfo, dateString, userStorage, user) {
  userStairsToday.insertAdjacentHTML("afterBegin", `<p>Stair Count:</p><span class="number">${activityInfo.userDataForToday(id, dateString, userStorage, 'flightsOfStairs')}</span></p>`);
  avgStairsToday.insertAdjacentHTML("afterBegin", `<p>Stair Count: </p><p><span class="number">${activityInfo.getAllUserAverageForDay(dateString, userStorage, 'flightsOfStairs')}</span></p>`);
  userStepsToday.insertAdjacentHTML("afterBegin", `<p>Step Count:</p><p><span class="number">${activityInfo.userDataForToday(id, dateString, userStorage, 'numSteps')}</span></p>`);
  avgStepsToday.insertAdjacentHTML("afterBegin", `<p>Step Count:</p><p><span class="number">${activityInfo.getAllUserAverageForDay(dateString, userStorage, 'numSteps')}</span></p>`);
  userMinutesToday.insertAdjacentHTML("afterBegin", `<p>Active Minutes:</p><p><span class="number">${activityInfo.userDataForToday(id, dateString, userStorage, 'minutesActive')}</span></p>`);
  avgMinutesToday.insertAdjacentHTML("afterBegin", `<p>Active Minutes:</p><p><span class="number">${activityInfo.getAllUserAverageForDay(dateString, userStorage, 'minutesActive')}</span></p>`);
  milesWalked.insertAdjacentHTML("afterBegin", `<p><span class="number">${activityInfo.getMilesFromStepsByDate(id, dateString, user)}</span><p>miles walked</p></p>`)
}

function addFriendGameInfo(id, activityInfo, userStorage, dateString, user) {
  friendChallengeListToday.insertAdjacentHTML("afterBegin", makeFriendChallengeHTML(activityInfo.compareWeeklyUsers(user, dateString, userStorage)));
  bigWinner.insertAdjacentHTML('afterBegin', `${activityInfo.showcaseWinner(user, dateString, userStorage)} steps`)
}

function makeFriendChallengeHTML(method) {
  return method.map(friendChallengeData => `<li class="historical-list-listItem">Your friend ${friendChallengeData} total steps.</li>`).join('');
}

const userFetch = fetch('http://localhost:3001/api/v1/users')
  .then(checkForError)
  .catch(err => displayErrorMessage(err));

const hydrationFetch = fetch('http://localhost:3001/api/v1/hydration')
  .then(checkForError)
  .catch(err => displayErrorMessage(err));

const sleepFetch = fetch('http://localhost:3001/api/v1/sleep')
  .then(checkForError)
  .catch(err => displayErrorMessage(err));

const activityFetch = fetch('http://localhost:3001/api/v1/activity')
  .then(checkForError)
  .catch(err => displayErrorMessage(err));

Promise.all([userFetch, hydrationFetch, sleepFetch, activityFetch])
  .then(values => startApp(values));

function hide(something) {
  something.classList.add('hidden');
}

function show(something) {
  something.classList.remove('hidden');
}

function isEmpty(input) {
  const trimmedInput = input.trim();
  if (!trimmedInput) {
    return true;
  } else {
    return false;
  }
}

function isValidForm(date, ounces, hours, quality, steps, minutes, flights) {
  hide(formErrorMessage);

  if (isEmpty(ounces) 
    && isEmpty(hours) 
    && isEmpty(quality) 
    && isEmpty(steps) 
    && isEmpty(minutes) 
    && isEmpty(flights)
  ) {
    formErrorMessage.innerHTML = 'Please enter data for at least one category';
    show(formErrorMessage);
    return false;
  } else {
    return true;
  }
}  

function isValidSleep(sleepObj) {
  if (sleepObj.hoursSlept || sleepObj.sleepQuality) {
    return true;
  } else {
    return false;
  }
}

function isValidActivity(activityObj) {
  if (activityObj.numSteps || activityObj.minutesActive || activityObj.flightsOfStairs) {
    return true;
  } else {
    return false;
  }
}

function isValidHydration(hydrationObj) {
  if (hydrationObj.numOunces) {
    return true;
  } else {
    return false;
  }
}

function checkForError(response) {
  if (!response.ok) {
    throw new Error('Please make sure you\'ve entered some data.');
  } else {
    return response.json();
  }
}

function displayErrorMessage(err) {
  const message = '';

  if (err.message === 'Failed to fetch') {
    message = 'Something went wrong. Please check your internet connection.';
    bigErrorMessage.innerText = message;
    show(bigErrorMessage);
    hide(formErrorMessage);
  } else {
    message = err.message;
    formErrorMessage.innerText = message;
    show(formErrorMessage);
    hide(bigErrorMessage);
  }
}


inputForm.addEventListener('submit', (event) => {
  event.preventDefault();

  if (!isValidForm(dateInput.value, waterInput.value, hoursSleptInput.value, sleepQualityInput.value, stepNumberInput.value, activeMinutesInput.value, flightsOfStairsInput.value)) {
    return;
  }

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

  if (isValidSleep(sleepObj)) {
    const postSleep = fetch('http://localhost:3001/api/v1/sleep', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(sleepObj),
    })
    .then(checkForError)
    .then(thisData => console.log("sleep data: ", thisData))
    .catch(err => displayErrorMessage(err));
  }

  if (isValidActivity(activityObj)) {
    const postActivity = fetch('http://localhost:3001/api/v1/activity', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(activityObj)
    })
    .then(checkForError)
    .then(thisData => console.log("activity data: ", thisData))
    .catch(err => displayErrorMessage(err));
  }

  if (isValidHydration(hydrationObj)) {
    const postHydration = fetch('http://localhost:3001/api/v1/hydration', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(hydrationObj),
    })
    .then(checkForError)
    .then(thisData => console.log("hydration data: ", thisData))
    .catch(err => displayErrorMessage(err));
  }

  event.target.reset();
});
