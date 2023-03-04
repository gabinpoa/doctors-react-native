import { IDateObj } from "../types";

async function getHours(initialDate: Date, finalDate: Date, roomId: string) {
  let dates = [];

  for (
    let counterDate = new Date(initialDate);
    counterDate.getHours() < finalDate.getHours();
    counterDate.setMinutes(counterDate.getMinutes() + 30)
  ) {
    const objEndDate = new Date(counterDate);
    objEndDate.setMinutes(counterDate.getMinutes() + 30);

    const dateObj: IDateObj = {
      startDate: new Date(counterDate),
      endDate: objEndDate,
      reserved: false,
      roomId: roomId,
    };

    dates.push(dateObj);
  }

  return dates;
}

export default getHours;
