import { ReactHookFormData } from "../components/CreateSurgeryModal";
import { pb } from "../lib/pocketbase";
import { ISurgeryName } from "../types";
import getPbDateString from "./getPbDateString";

export interface CreateSurgeryProps extends ReactHookFormData {
  room: string;
  startDate: string;
  endDate: string;
  name: string;
  hospitalization: string;
}

async function createSurgery(
  data: CreateSurgeryProps,
  aditionalFields?: any[]
) {
  try {
    const user = pb.authStore;
    if (user.isValid && user.model) {
      await pb.collection("surgeries").create({
        ...data,
        aditionalFields: JSON.stringify(aditionalFields),
        doctor: user.model.id,
      });
    }
  } catch (err) {
    console.error(JSON.stringify(err));
  }
}

export default createSurgery;
