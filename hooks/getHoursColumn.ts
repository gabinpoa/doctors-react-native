import { LimitHours } from "../context";
import getFinalDate from "./getFinalDate";
import getInitialDate from "./getInitialDate";

function getHoursColumn(date: Date, limitHours: LimitHours) {
  const initialDate = getInitialDate(date, limitHours.start);
  const finalDate = getFinalDate(date, limitHours.end);

  const hoursColumn = [];
  for (
    let counterDate = new Date(initialDate);
    counterDate <= finalDate;
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
