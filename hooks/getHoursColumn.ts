import getFinalDate from "./getFinalDate";
import getInitialDate from "./getInitialDate";

function getHoursColumn(
  date: Date,
  limitHour: { initial: number; final: number }
) {
  const initialDate = getInitialDate(date, limitHour.initial);
  const finalDate = getFinalDate(date, limitHour.final);

  const hoursColumn = [];
  for (
    let counterDate = new Date(initialDate);
    counterDate.getHours() <= finalDate.getHours() &&
    counterDate.getHours() !== 0;
    counterDate.setHours(counterDate.getHours() + 1)
  ) {
    const row = {
      hour: counterDate.getHours(),
    };

    hoursColumn.push(row);
  }

  return hoursColumn;
}

export default getHoursColumn;
