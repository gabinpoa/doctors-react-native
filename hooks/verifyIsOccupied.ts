import { IDateObj } from "../types";

interface Props {
  exists: boolean;
  startDate?: Date;
  endDate: Date;
  roomDatesArray: IDateObj[];
  oldEndDate?: Date;
}

export default function verifyIsOccupied({
  exists,
  startDate = undefined,
  endDate,
  oldEndDate = undefined,
  roomDatesArray,
}: Props) {
  if (!exists && startDate) {
    const startDateIndex = roomDatesArray.findIndex(
      (dateObj) => dateObj.startDate.toISOString() === startDate.toISOString()
    );
    const endDateIndex = roomDatesArray.findIndex(
      (dateObj) => dateObj.endDate.toISOString() === endDate.toISOString()
    );
    for (let i = startDateIndex; i <= endDateIndex; i++) {
      if (roomDatesArray[i].reserved) {
        return true;
      }
    }

    return false;
  } else if (exists && oldEndDate) {
    const oldEndDateIndex =
      roomDatesArray.findIndex(
        (dateObj) => dateObj.endDate.toISOString() === oldEndDate.toISOString()
      ) + 1;
    const endDateIndex = roomDatesArray.findIndex(
      (dateObj) => dateObj.endDate.toISOString() === endDate.toISOString()
    );

    for (let i = oldEndDateIndex; i <= endDateIndex; i++) {
      if (roomDatesArray[i].reserved) {
        return true;
      }
    }

    return false;
  }
}
