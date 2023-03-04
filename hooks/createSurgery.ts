import { pb } from "../lib/pocketbase";
import getPbDateString from "./getPbDateString";

interface Props {
  name: string;
  roomId: string;
  startDate: Date;
  endDate: Date;
  patient?: string;
}

async function createSurgery(data: Props) {
  try {
    const user = pb.authStore;
    if (user.isValid) {
      await pb.collection("surgeries").create({
        name: data.name,
        room: data.roomId,
        doctor: user.model?.id,
        startDate: getPbDateString(data.startDate),
        endDate: getPbDateString(data.endDate),
        patient: data.patient,
      });
    }
  } catch (err) {
    console.error(err);
  }
}

export default createSurgery;
