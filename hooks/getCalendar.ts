import { Dispatch, SetStateAction, useContext } from "react";
import { RoomsWithDate, TCalendar } from "../types";
import getHoursColumn from "./getHoursColumn";
import getRooms from "./getRooms";
import useSurgeries from "./useSurgeries";

async function getCalendar(
  date: Date,
  setCalendar: Dispatch<SetStateAction<TCalendar | []>>
) {
  const limitHour = {
    initial: 6,
    final: 23,
  };
  const rooms = await getRooms();
  if (rooms) {
    const calendar = await Promise.all(
      rooms.map(async (room) => {
        return {
          ...room,
          dates: await useSurgeries(date, room.id, limitHour),
        };
      })
    );
    const completeCalendar = [
      getHoursColumn(date, limitHour),
      calendar,
    ] as TCalendar;

    setCalendar(completeCalendar);
  }
}

export default getCalendar;
