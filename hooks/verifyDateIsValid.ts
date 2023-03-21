import { LimitHours } from "../context";
import { TRoomDataArray } from "../types";

interface Params {
  startDate: Date;
  endDate: Date;
  roomsArray: TRoomDataArray;
  roomId: string;
  surgeryId?: string;
  limitHours: LimitHours;
}

export default ({
  startDate,
  limitHours,
  endDate,
  roomsArray,
  roomId,
  surgeryId,
}: Params) => {
  if (
    startDate >= endDate ||
    (endDate.getHours() >= limitHours.end && limitHours.end !== 0) ||
    startDate.getHours() < limitHours.start
  ) {
    return false;
  }

  const roomDates =
    roomsArray[roomsArray.findIndex((room) => room.id === roomId)].dates;

  const startObjIndex = roomDates.findIndex(
    (dateObj) => dateObj.startDate.toISOString() === startDate.toISOString()
  );
  const endObjIndex = roomDates.findIndex(
    (dateObj) => dateObj.endDate.toISOString() === endDate.toISOString()
  );

  for (let i = startObjIndex; i <= endObjIndex; i++) {
    if (roomDates[i].reserved && roomDates[i].data?.id !== surgeryId) {
      return false;
    }
  }

  return true;
};
