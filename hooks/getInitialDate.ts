function getInitialDate(date: Date, initialHour: number) {
  const initialDate = new Date(date);

  initialDate.setHours(initialHour, 0, 0, 0);

  return initialDate;
}

export default getInitialDate;
