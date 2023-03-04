function getFinalDate(date: Date, finalHour: number) {
  const finalDate = new Date(date);

  finalDate.setHours(finalHour, 0, 0, 0);

  return finalDate;
}

export default getFinalDate;
