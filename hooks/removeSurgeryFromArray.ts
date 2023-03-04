import { IDateObj } from "../types";

export default function removeSurgeryFromArray(
  id: string,
  roomDatesArray: IDateObj[]
) {
  const newRoomsDates = roomDatesArray.map((date) => {
    if (date.data?.id === id) {
      return {
        ...date,
        data: undefined,
        isEnd: false,
        isStart: false,
        reserved: false,
      };
    } else {
      return date;
    }
  });
  return newRoomsDates;
}
