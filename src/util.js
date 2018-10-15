export const getMonthName = index => {
  var date = new Date();
  date.setMonth(index);
  return date.toLocaleString([], { month: "long" });
};

export const getDaysInMonth = (monthNumber, yearNumber) =>
  new Date(yearNumber, monthNumber, 0).getDate();

export const getFirstDayInTheWeekOfMonth = (monthNumber, yearNumber) =>
  new Date(yearNumber, monthNumber - 1, 1).getDay();
