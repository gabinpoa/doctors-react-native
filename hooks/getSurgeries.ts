import { Record } from "pocketbase";
import { pb } from "../lib/pocketbase";
import { SurgeriesRecord } from "../types";
import getPbDateString from "./getPbDateString";

async function getSurgeries(
  initialDate: Date,
  finalDate: Date,
  roomId: string
) {
  const initialDatePbString = getPbDateString(initialDate);

  const finalDatePbString = getPbDateString(finalDate);
  try {
    const surgeries: SurgeriesRecord[] = await pb
      .collection("surgeries")
      .getFullList(20, {
        $autoCancel: false,
        filter: `startDate > "${initialDatePbString}" && endDate < "${finalDatePbString}" && room = "${roomId}"`,
        expand: "doctor,room",
      });

    return surgeries;
  } catch (err) {
    console.log(err + " surgeries");
  }
}

export default getSurgeries;
