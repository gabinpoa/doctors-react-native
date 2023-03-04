import { useContext } from "react";
import { AppContext, IContextDefaultValue } from "../context";
import getHours from "./getHours";
import getFinalDate from "./getFinalDate";
import getInitialDate from "./getInitialDate";
import getSurgeries from "./getSurgeries";
import pbDateStringToDate from "./pbDateStringToDate";
import insertSurgeriesIntoHours from "./insertSurgeryIntoHours";

async function useSurgeries(
  date: Date,
  roomId: string,
  limitHour: { initial: number; final: number }
) {
  const initialDate = getInitialDate(date, limitHour.initial);
  const finalDate = getFinalDate(date, limitHour.final);

  const hours = await getHours(initialDate, finalDate, roomId);
  const surgeries = await getSurgeries(initialDate, finalDate, roomId);

  if (surgeries) {
    const newHours = insertSurgeriesIntoHours(surgeries, hours);

    return newHours;
  }
  return hours;
}

export default useSurgeries;
