import { Dispatch, SetStateAction, useEffect } from "react";
import { pb } from "../lib/pocketbase";
import { TCalendar, THourRowArray, TRoomDataArray } from "../types";
import subcribeToSurgeries from "./subscribeToSurgeries";

function useSubscribeToSurgeries(
  day: number,
  setDay: Dispatch<SetStateAction<number>>,
  roomArray: TRoomDataArray | undefined,
  hoursColumn: THourRowArray | undefined,
  setCalendar: Dispatch<SetStateAction<TCalendar | []>>
) {
  useEffect(() => {
    if (roomArray && hoursColumn) {
      let roomArrayVar = roomArray;
      subcribeToSurgeries(day, setDay, roomArrayVar, hoursColumn, setCalendar);
      return () => {
        pb.collection("surgeries")
          .unsubscribe("*")
          .catch((err) => console.log(err));
      };
    }
  });
}

export default useSubscribeToSurgeries;
