import { useContext } from "react";
import { AppContext, IContextDefaultValue, LimitHours } from "../context";
import getHours from "./getHours";
import getFinalDate from "./getFinalDate";
import getInitialDate from "./getInitialDate";
import getSurgeries from "./getSurgeries";
import pbDateStringToDate from "./pbDateStringToDate";
import insertSurgeriesIntoHours from "./insertSurgeryIntoHours";

async function useSurgeries(
  date: Date,
  roomId: string,
  limitHours: LimitHours
) {
  const initialDate = getInitialDate(date, limitHours.start);
  const finalDate = getFinalDate(date, limitHours.end);

  const hours = await getHours(initialDate, finalDate, roomId);
  const surgeries = await getSurgeries(initialDate, finalDate, roomId);

  if (surgeries) {
    const newHours = insertSurgeriesIntoHours(surgeries, hours);

    return newHours;
  }
  return hours;
}

export default useSurgeries;
