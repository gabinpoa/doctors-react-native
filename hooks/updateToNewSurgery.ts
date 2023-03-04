import { Dispatch, SetStateAction, useContext } from "react";
import { AppContext, IContextDefaultValue } from "../context";
import {
  IDateObj,
  SurgeriesRecord,
  TCalendar,
  THourRowArray,
  TRoomDataArray,
} from "../types";
import insertSurgeriesIntoHours from "./insertSurgeryIntoHours";

function updateToNewSurgery(surgery: SurgeriesRecord, datesArray: IDateObj[]) {
  const surgeryArray = [surgery];

  const updatedRoomDates = insertSurgeriesIntoHours(surgeryArray, datesArray);

  return updatedRoomDates;
}

export default updateToNewSurgery;
