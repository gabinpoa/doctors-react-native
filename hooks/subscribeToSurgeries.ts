import { RecordSubscription } from "pocketbase";
import { Dispatch, SetStateAction, useEffect } from "react";
import { pb } from "../lib/pocketbase";
import {
  IRoomData,
  IRoomOnExpand,
  ISurgeryData,
  IUser,
  RoomsRecord,
  SurgeriesRecord,
  TCalendar,
  THourRowArray,
  TRoomDataArray,
} from "../types";
import getDayDate from "./getDayDate";
import getPbDateString from "./getPbDateString";
import pbDateStringToDate from "./pbDateStringToDate";
import removeSurgeryFromArray from "./removeSurgeryFromArray";
import updateToNewSurgery from "./updateToNewSurgery";
import useCalendar from "./useCalendar";

async function subcribeToSurgeries(
  day: number,
  setDay: Dispatch<SetStateAction<number>>,
  roomArrayVar: TRoomDataArray,
  hoursColumn: THourRowArray,
  setCalendar: Dispatch<SetStateAction<TCalendar | []>>
) {
  pb.collection("surgeries")
    .subscribe("*", (e: RecordSubscription<ISurgeryData>) => {
      const dayDate = getDayDate(day);
      dayDate.setDate(dayDate.getDate() + 1);
      const roomIndex = roomArrayVar.findIndex(
        (room) => room.id === e.record.room
      );
      if (e.action === "create" || e.action === "update") {
        pb.collection("users")
          .getOne(e.record.doctor)
          .then((userRecord: unknown) => {
            pb.collection("rooms")
              .getOne(e.record.room)
              .then((roomRecord: unknown) => {
                e.record.expand = {
                  doctor: userRecord as IUser,
                  room: roomRecord as IRoomOnExpand,
                };
                roomArrayVar[roomIndex].dates = updateToNewSurgery(
                  e.record as ISurgeryData,
                  roomArrayVar[roomIndex].dates
                );
                setCalendar([hoursColumn, roomArrayVar]);
              });
          })
          .catch((err) => console.log(err + " users"));
      } else if (e.action === "delete") {
        roomArrayVar[roomIndex].dates = removeSurgeryFromArray(
          e.record.id,
          roomArrayVar[roomIndex].dates
        );
        setCalendar([hoursColumn, roomArrayVar]);
      }
    })
    .catch((err) => {
      console.log(err + " subcribe");
    });
}

export default subcribeToSurgeries;
