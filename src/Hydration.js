class Hydration {
  constructor(hydrationData) {
    this.hydrationData = hydrationData;
  }
  calculateAverageOunces(id) {
    // returns all-time daily average for given user
    let perDayUserHydration = this.hydrationData.filter((data) => id === data.userID);
    let roundNum = perDayUserHydration.reduce((sumSoFar, data) => {
      return sumSoFar += data.numOunces;
    }, 0) / perDayUserHydration.length;
    return Math.round(roundNum * 10) /10;
  }
  calculateDailyOunces(id, date) {
    let findOuncesByDate = this.hydrationData.find((data) => id === data.userID && date === data.date);
    return findOuncesByDate.numOunces;
  }
  calculateFirstWeekOunces(userRepo, id) {
    return userRepo.getFirstWeek(id, this.hydrationData).reduce((acc, data) => {
      acc[data.date] = data.numOunces;
      return acc;
    },{});
  }
  calculateRandomWeekOunces(date, id, userRepo) {
    // returns the 7 most recent entries leading up to and including the given data
    // ... even if those 7 entries don't all fall inside the same week
    // if there aren't 7 entries leading up to the current date, it grabs as many entries as it can
    return userRepo.getWeekFromDate(date, id, this.hydrationData).map((data) => `${data.date}: ${data.numOunces}`);
  }
}

export default Hydration;
