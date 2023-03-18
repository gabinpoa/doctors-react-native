import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { LimitHours } from "../context";
import { RoomsWithDate, TCalendar } from "../types";
import getCalendar from "./getCalendar";
import getDayDate from "./getDayDate";

function useCalendar(
  day: number,
  setCalendar: Dispatch<SetStateAction<TCalendar | []>>,
  setLoading: Dispatch<SetStateAction<boolean>>,
  limitHours: LimitHours
) {
  useEffect(() => {
    setLoading(true);
    const newDay = getDayDate(day);
    getCalendar(newDay, setCalendar, setLoading, limitHours);
  }, [day]);
}

export default useCalendar;
