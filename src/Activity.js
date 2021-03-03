class Activity {
  constructor(activityData) {
    this.activityData = activityData
  }
  getMilesFromStepsByDate(id, date, userRepo) {
    let userStepsByDate = this.activityData.find(data => id === data.userID && date === data.date);
    console.log(userStepsByDate);
    return parseFloat(((userStepsByDate.numSteps * userRepo.strideLength) / 5280).toFixed(1));
  }
  getActiveMinutesByDate(id, date) {
    let userActivityByDate = this.activityData.find(data => id === data.userID && date === data.date);
    return userActivityByDate.minutesActive;
  }
  calculateActiveAverageForWeek(id, date, userRepo) {
    return parseFloat((userRepo.getWeekFromDate(date, id, this.activityData).reduce((acc, elem) => {
      return acc += elem.minutesActive;
    }, 0) / 7).toFixed(1));
  }
  accomplishStepGoal(id, date, userRepo) {
    let userStepsByDate = this.activityData.find(data => id === data.userID && date === data.date);
    if (userStepsByDate.numSteps >= userRepo.dailyStepGoal) {
      return true;
    }
    return false
  }
  getDaysGoalExceeded(id, userRepo) {
    return this.activityData.filter(data => id === data.userID && data.numSteps > userRepo.dailyStepGoal).map(data => data.date);
  }
  getStairRecord(id) {
    return this.activityData.filter(data => id === data.userID).reduce((acc, elem) => (elem.flightsOfStairs > acc) ? elem.flightsOfStairs : acc, 0);
  }
  getAllUserAverageForDay(date, userRepo, relevantData) {
    let selectedDayData = userRepo.chooseDayDataForAllUsers(this.activityData, date);
    return parseFloat((selectedDayData.reduce((acc, elem) => acc += elem[relevantData], 0) / selectedDayData.length).toFixed(1));
  }
  userDataForToday(id, date, userRepo, relevantData) {
    let userData = userRepo.getDataFromUserID(id, this.activityData);
    return userData.find(data => data.date === date)[relevantData];
  }
  userDataForWeek(id, date, userRepo, releventData) {
    return userRepo.getWeekFromDate(date, id, this.activityData).map((data) => `${data.date}: ${data[releventData]}`);
  }

  // Friends

  getAllUserActivity(user, userRepo) {
    let data = this.activityData;
    let userData = userRepo.getDataFromUserID(user.id, data);
    let friendsDatalist = user.friends.map(function(friend) {
      return userRepo.getDataFromUserID(friend, data)
    });
    const fullDataList = friendsDatalist.concat(userData);
    return fullDataList.reduce(function(arraySoFar, listItem) {
      return arraySoFar.concat(listItem);
    }, []);
  }
  calcWeeklyStepsAverage(user, date, userRepo) {
    let allActivity = this.getAllUserActivity(user, userRepo);
    let timeline = userRepo.chooseWeekDataForAllUsers(allActivity, date);
    return userRepo.combineRankedUserIDsAndAveragedData(allActivity, date, 'numSteps', timeline)
  }

  calcWeeklyStepsTotal(user, date, userRepo) {
    const allActivity = this.getAllUserActivity(user, userRepo);
    const timeline = userRepo.chooseWeekDataForAllUsers(allActivity, date);
    const sortedObjectKeys = userRepo.isolateUsernameAndRelevantData(allActivity, date, 'numSteps', timeline);
    const rankedUsersAndAverages = userRepo.rankUserIDsbyRelevantDataValue(allActivity, date, 'numSteps', timeline);
    return rankedUsersAndAverages.map(function(rankedUser) {
      const result = rankedUser = {
      [rankedUser]: sortedObjectKeys[rankedUser].reduce(
        function(currentSum, stepValue) {
          return currentSum + stepValue;
        }, 0)
      }
      return result;
    });
  }
  compareWeeklyUsers(user, date, userRepo) {
    let rankedList = this.calcWeeklyStepsTotal(user, date, userRepo);
    return rankedList.map(function(listItem) {
      let userID = Object.keys(listItem)[0];
      let userName = userRepo.getDataFromID(parseInt(userID)).name;
      return `${userName}: ${listItem[userID]}`
    })
  }
  showcaseWinner(user, date, userRepo) {
    let winner = this.compareWeeklyUsers(user, date, userRepo).shift();
    return winner;
  }
  getStreak(userRepo, id, relevantData) {
    let data = this.activityData;
    let sortedUserArray = (userRepo.makeSortedUserArray(id, data)).reverse();
    let streaks = sortedUserArray.filter(function(element, index) {
      if (index >= 2) {
        return (sortedUserArray[index - 2][relevantData] < sortedUserArray[index - 1][relevantData] && sortedUserArray[index - 1][relevantData] < sortedUserArray[index][relevantData])
      }
    });
    return streaks.map(function(streak) {
      return streak.date;
    })
  }
  getWinnerId(user, date, userRepo) {
    let rankedList = this.calcWeeklyStepsTotal(user, date, userRepo);
    let keysList = rankedList.map(listItem => Object.keys(listItem));
    return parseInt(keysList[0].join(''))
  }
}



export default Activity;
