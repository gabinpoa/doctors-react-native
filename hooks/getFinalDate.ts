function getFinalDate(date: Date, finalHour: number) {
  const finalDate = new Date(date);

  finalDate.setHours(finalHour, 0, 0, 0);

  if (finalHour === 0) {
    finalDate.setHours(finalDate.getHours() + 24);
  }

  return finalDate;
}

export default getFinalDate;
