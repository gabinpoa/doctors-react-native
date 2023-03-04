function getDayDate(day: number) {
  const newDay = new Date();
  newDay.setDate(newDay.getDate() + day);

  return newDay;
}
export default getDayDate;
