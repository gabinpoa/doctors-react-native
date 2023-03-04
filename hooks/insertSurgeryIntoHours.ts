import { getRandomColor } from "../lib/colors";
import { IDateObj, SurgeriesRecord } from "../types";
import pbDateStringToDate from "./pbDateStringToDate";

function insertSurgeriesIntoHours(
  surgeries: SurgeriesRecord[],
  hours: IDateObj[]
) {
  surgeries.forEach((surgery) => {
    const surgeryStartDate = pbDateStringToDate(surgery.startDate);
    const surgeryEndDate = pbDateStringToDate(surgery.endDate);

    const startObjIndex = hours.findIndex(
      (dateObj) =>
        dateObj.startDate.toISOString() === surgeryStartDate.toISOString()
    );

    const endObjIndex = hours.findIndex(
      (dateObj) =>
        dateObj.endDate.toISOString() === surgeryEndDate.toISOString()
    );

    for (let counter = startObjIndex; counter <= endObjIndex; counter++) {
      if (counter === startObjIndex) {
        hours[counter].isStart = true;
      }
      if (counter === endObjIndex) {
        hours[counter].isEnd = true;
      }
      hours[counter].reserved = true;
      hours[counter].data = { ...surgery, color: getRandomColor() };
    }
  });

  return hours;
}

export default insertSurgeriesIntoHours;
