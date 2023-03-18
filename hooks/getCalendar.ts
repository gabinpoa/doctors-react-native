import { Dispatch, SetStateAction, useContext } from "react";
import { LimitHours } from "../context";
import { RoomsWithDate, TCalendar } from "../types";
import getHoursColumn from "./getHoursColumn";
import getRooms from "./getRooms";
import useSurgeries from "./useSurgeries";

async function getCalendar(
  date: Date,
  setCalendar: Dispatch<SetStateAction<TCalendar | []>>,
  setLoading: Dispatch<SetStateAction<boolean>>,
  limitHours: LimitHours
) {
  const rooms = await getRooms();
  if (rooms) {
    const calendar = await Promise.all(
      rooms.map(async (room) => {
        return {
          ...room,
          dates: await useSurgeries(date, room.id, limitHours),
        };
      })
    );
    const completeCalendar = [
      getHoursColumn(date, limitHours),
      calendar,
    ] as TCalendar;

    setCalendar(completeCalendar);
    setLoading(false);
  }
}

export default getCalendar;
