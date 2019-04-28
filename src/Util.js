class Util {

  static getCopyrightYears() {
    const startYear = 2019;
    const currentYear = new Date().getFullYear();

    let copyrightYears;
    if (currentYear !== startYear) {
      copyrightYears = `${startYear}-${currentYear}`;
    } else {
      copyrightYears = `${startYear}`;
    }

    return copyrightYears;
  }
}

export default Util;
