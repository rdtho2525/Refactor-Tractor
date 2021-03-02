class Hydration {
  constructor(hydrationData) {
    this.hydrationData = hydrationData;
  }
  calculateAverageOunces(id) {
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
    return userRepo.getWeekFromDate(date, id, this.hydrationData).map((data) => `${data.date}: ${data.numOunces}`);
  }
}


export default Hydration;
