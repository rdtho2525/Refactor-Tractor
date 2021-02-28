class UserRepo {
  constructor(users) {
    this.users = users;
  };
  getDataFromID(id) {
    // returns basic user info (e.g. name, address, etc. for user 1)
    return this.users.find((user) => id === user.id);
  };
  getDataFromUserID(id, dataSet) {
    // returns category data (e.g. hydration data for user 1)
    return dataSet.filter((userData) => id === userData.userID);
  };
  calculateAverageStepGoal() {
    var totalStepGoal = this.users.reduce((sumSoFar, data) => {
      return sumSoFar = sumSoFar + data.dailyStepGoal;
    }, 0);
    return totalStepGoal / this.users.length;
  };
  makeSortedUserArray(id, dataSet) {
    // sorts from most recent to oldest
    let selectedID = this.getDataFromUserID(id, dataSet)
    let sortedByDate = selectedID.sort((a, b) => new Date(b.date) - new Date(a.date));
    return sortedByDate;
  }
  getToday(id, dataSet) {
    // returns dataSet item for given id for most recent date available in the dataset
    return this.makeSortedUserArray(id, dataSet)[0].date;
  };
  getFirstWeek(id, dataSet) {
    // returns (up to) 7 most recent dataSet items for given id in descending order -- can return fewer than 7
    return this.makeSortedUserArray(id, dataSet).slice(0, 7);
  };
  getWeekFromDate(date, id, dataSet) {
    // returns (up to) 7 dataSet items for given id leading up to and including the given date in descending order -- can return fewer than 7
    let dateIndex = this.makeSortedUserArray(id, dataSet).indexOf(this.makeSortedUserArray(id, dataSet).find((sortedItem) => (sortedItem.date === date)));
    return this.makeSortedUserArray(id, dataSet).slice(dateIndex, dateIndex + 7);
  };
  chooseWeekDataForAllUsers(dataSet, date) {
    // returns (up to) 7 dataSet items for each user leading up to and including the given date
    return dataSet.filter(function(dataItem) {
      return (new Date(date)).setDate((new Date(date)).getDate() - 7) <= new Date(dataItem.date) && new Date(dataItem.date) <= new Date(date)
    });
  };
  chooseDayDataForAllUsers(dataSet, date) {
    // returns all dataSet items for all users for given date
    return dataSet.filter(function(dataItem) {
      return dataItem.date === date
    });
  }
  isolateUsernameAndRelevantData(dataSet, date, relevantData, listFromMethod) {
    // returns an object with keys of userIDs and properties that are arrays of numbers
    // note that the relevantData parameter is a string, e.g. 'sleepQuality'
    // and the listFromMethod parameter is something like userRepo.chooseWeekDataForAllUsers(sleepData, "2019/06/21")
    return listFromMethod.reduce(function(objectSoFar, dataItem) {
      if (!objectSoFar[dataItem.userID]) {
        objectSoFar[dataItem.userID] = [dataItem[relevantData]]
      } else {
        objectSoFar[dataItem.userID].push(dataItem[relevantData])
      }
      return objectSoFar;
    }, {});
  }
  rankUserIDsbyRelevantDataValue(dataSet, date, relevantData, listFromMethod) {
    // returns array with ranked list, e.g. ['5', '2', '4'] (user 5 had the highest value for whatever we're looking at)
    // note that the relevantData parameter is a string, e.g. 'sleepQuality'
    // and the listFromMethod parameter is something like userRepo.chooseWeekDataForAllUsers(sleepData, "2019/06/21")
    let sortedObjectKeys = this.isolateUsernameAndRelevantData(dataSet, date, relevantData, listFromMethod)
    return Object.keys(sortedObjectKeys).sort(function(b, a) {
      return (sortedObjectKeys[a].reduce(function(sumSoFar, sleepQualityValue) {
        sumSoFar += sleepQualityValue
        return sumSoFar;
      }, 0) / sortedObjectKeys[a].length) - (sortedObjectKeys[b].reduce(function(sumSoFar, sleepQualityValue) {
        sumSoFar += sleepQualityValue
        return sumSoFar;
      }, 0) / sortedObjectKeys[b].length)
    });
  }
  combineRankedUserIDsAndAveragedData(dataSet, date, relevantData, listFromMethod) {
    // returns array of objects; each object has key of userID and property of average value of whatever quality we're looking at
    // note that the relevantData parameter is a string, e.g. 'sleepQuality'
    // and the listFromMethod parameter is something like userRepo.chooseWeekDataForAllUsers(sleepData, "2019/06/21")
    let sortedObjectKeys = this.isolateUsernameAndRelevantData(dataSet, date, relevantData, listFromMethod)
    let rankedUsersAndAverages = this.rankUserIDsbyRelevantDataValue(dataSet, date, relevantData, listFromMethod)
    return rankedUsersAndAverages.map(function(rankedUser) {
      rankedUser = {
        [rankedUser]: sortedObjectKeys[rankedUser].reduce(
          function(sumSoFar, sleepQualityValue) {
            sumSoFar += sleepQualityValue
            return sumSoFar;
          }, 0) / sortedObjectKeys[rankedUser].length
      };
      return rankedUser;
    });
  }
}

export default UserRepo;
