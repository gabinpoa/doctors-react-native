import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { RoomsWithDate, TCalendar } from "../types";
import getCalendar from "./getCalendar";
import getDayDate from "./getDayDate";

function useCalendar(
  day: number,
  setCalendar: Dispatch<SetStateAction<TCalendar | []>>
) {
  useEffect(() => {
    const newDay = getDayDate(day);
    getCalendar(newDay, setCalendar);
  }, [day]);
}

export default useCalendar;
