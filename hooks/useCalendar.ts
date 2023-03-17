import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { RoomsWithDate, TCalendar } from "../types";
import getCalendar from "./getCalendar";
import getDayDate from "./getDayDate";

function useCalendar(
  day: number,
  setCalendar: Dispatch<SetStateAction<TCalendar | []>>,
  setLoading: Dispatch<SetStateAction<boolean>>
) {
  useEffect(() => {
    setLoading(true);
    const newDay = getDayDate(day);
    getCalendar(newDay, setCalendar, setLoading);
  }, [day]);
}

export default useCalendar;
